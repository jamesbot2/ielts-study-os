#!/usr/bin/env python3
"""Generate original listening audio from speaker-marked scripts (Piper TTS).

Generic CLI:

    python scripts/tts/generate_audio.py --input <job.json> --output <out_dir>
    python scripts/tts/generate_audio.py --input <job.json> --output <out_dir> --set <setId>

Without arguments it preserves the legacy full-test behavior
(listening-scripts.json -> public/audio/listening-1/).

Job JSON shape:

    {
      "parts": [
        { "part": 1, "title": "...", "lines": [
            { "speaker": "Officer", "voice": "en_US-lessac-medium", "text": "..." }
        ]}
      ]
    }

Output: one MP3 per part plus manifest.json with src/sizeBytes/durationSeconds.
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
LEGACY_SCRIPTS = os.path.join(HERE, "listening-scripts.json")
VOICES_DIR = os.path.join(HERE, "voices")
LEGACY_OUT = os.path.join(ROOT, "public", "audio", "listening-1")

PY = sys.executable  # the venv python that has piper installed
# Prefer a dedicated TTS venv if one exists (e.g. /home/box/tts-venv).
_TTS_VENV = os.path.expanduser(os.environ.get("PIPER_VENV", "~/tts-venv"))
if os.path.exists(os.path.join(_TTS_VENV, "bin", "python")):
    PY = os.path.join(_TTS_VENV, "bin", "python")
SILENCE_SECONDS = 0.5


def synth_line(text: str, voice: str, out_wav: str) -> None:
    model = os.path.join(VOICES_DIR, f"{voice}.onnx")
    if not os.path.exists(model):
        raise FileNotFoundError(f"Voice model not found: {model}")
    proc = subprocess.run(
        [PY, "-m", "piper", "-m", model, "-f", out_wav, "--sentence-silence", "0.1"],
        input=text.encode("utf-8"),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"piper failed: {proc.stderr.decode()}")


def make_silence(path: str, seconds: float) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono",
         "-t", str(seconds), "-q:a", "9", "-acodec", "pcm_s16le", path],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
    )


def concat_and_convert(wavs: list[str], out_mp3: str) -> None:
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        for w in wavs:
            f.write(f"file '{os.path.abspath(w)}'\n")
        concat_file = f.name
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_file,
         "-ac", "1", "-b:a", "64k", out_mp3],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
    )
    os.unlink(concat_file)


def probe_duration(path: str) -> float | None:
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "csv=p=0", path],
            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, check=True,
        )
        return float(out.stdout.decode().strip())
    except Exception:
        return None


def generate(job_path: str, out_dir: str, only_set: str | None = None) -> None:
    with open(job_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    os.makedirs(out_dir, exist_ok=True)
    entries = data.get("sets", [data]) if "sets" in data else [data]
    manifest = []

    for entry in entries:
        setId = entry.get("setId", "listening-1")
        if only_set and setId != only_set:
            continue
        set_out = os.path.join(out_dir, setId)
        os.makedirs(set_out, exist_ok=True)
        with tempfile.TemporaryDirectory() as tmp:
            for part in entry["parts"]:
                wavs = []
                for i, line in enumerate(part["lines"]):
                    wav = os.path.join(tmp, f"p{part['part']}_{i}.wav")
                    print(f"[{setId}] part {part['part']} line {i + 1}/{len(part['lines'])} ({line['voice']})…")
                    synth_line(line["text"], line["voice"], wav)
                    wavs.append(wav)
                    if i < len(part["lines"]) - 1:
                        silence = os.path.join(tmp, f"sil_{part['part']}_{i}.wav")
                        make_silence(silence, SILENCE_SECONDS)
                        wavs.append(silence)
                mp3 = os.path.join(set_out, f"part{part['part']}.mp3")
                concat_and_convert(wavs, mp3)
                size = os.path.getsize(mp3)
                duration = probe_duration(mp3)
                manifest.append({
                    "setId": setId,
                    "part": part["part"],
                    "title": part.get("title", f"Part {part['part']}"),
                    "src": f"/audio/targeted/{setId}/part{part['part']}.mp3",
                    "sizeBytes": size,
                    "durationSeconds": round(duration, 1) if duration is not None else None,
                })
                print(f"  -> {mp3} ({size} bytes, {duration}s)")

    with open(os.path.join(out_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump({"parts": manifest}, f, indent=2)
    print(f"Done. Wrote manifest.json ({len(manifest)} parts)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Listening audio via Piper TTS")
    parser.add_argument("--input", default=None, help="Job JSON path (default: legacy listening-scripts.json)")
    parser.add_argument("--output", default=None, help="Output directory (default: public/audio/listening-1)")
    parser.add_argument("--set", default=None, help="Only generate the given setId")
    args = parser.parse_args()

    job = args.input or LEGACY_SCRIPTS
    out = args.output or LEGACY_OUT
    generate(job, out, only_set=args.set)


if __name__ == "__main__":
    main()
