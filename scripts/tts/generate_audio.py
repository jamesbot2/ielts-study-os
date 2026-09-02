#!/usr/bin/env python3
"""Generate original listening audio from speaker-marked scripts (Piper TTS).

Generic CLI:

    python scripts/tts/generate_audio.py --input <job.json> --output <out_dir> [--set setId] [--url-root /audio/targeted]

Legacy no-argument invocation preserves the original full-test behavior and
writes public/audio/listening-1/partN.mp3 + manifest.json directly (no setId
subdirectory).

Sets mode writes one subdirectory per setId, each with its own manifest.json,
and deterministically rebuilds the GLOBAL manifest.json from every per-set
manifest (so `--set` never clobbers unrelated entries).
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

# Prefer a dedicated TTS venv if one exists (e.g. ~/tts-venv).
PY = sys.executable
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


def rebuild_global_manifest(out_dir: str, url_root: str) -> None:
    """Deterministically merge every per-set manifest.json into one global file."""
    parts = []
    if os.path.isdir(out_dir):
        for setId in sorted(os.listdir(out_dir)):
            per = os.path.join(out_dir, setId, "manifest.json")
            if not os.path.isfile(per):
                continue
            with open(per, "r", encoding="utf-8") as f:
                data = json.load(f)
            for part in data.get("parts", []):
                part = dict(part)
                part["src"] = f"{url_root.rstrip('/')}/{setId}/{part['src'].rsplit('/', 1)[-1]}"
                parts.append(part)
    with open(os.path.join(out_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump({"parts": parts}, f, indent=2)


def generate(job_path: str, out_dir: str, url_root: str, only_set: str | None = None) -> None:
    with open(job_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    os.makedirs(out_dir, exist_ok=True)
    # Legacy single-job format (no "sets" wrapper) -> full-test layout.
    entries = data.get("sets", [data])
    is_legacy = "sets" not in data

    for entry in entries:
        setId = entry.get("setId", "listening-1")
        if only_set and setId != only_set:
            continue
        if is_legacy:
            set_out = out_dir
            set_manifest_path = os.path.join(out_dir, "manifest.json")
        else:
            set_out = os.path.join(out_dir, setId)
            os.makedirs(set_out, exist_ok=True)
            set_manifest_path = os.path.join(set_out, "manifest.json")

        manifest_parts = []
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
                manifest_parts.append({
                    "setId": setId,
                    "part": part["part"],
                    "title": part.get("title", f"Part {part['part']}"),
                    "src": f"part{part['part']}.mp3",
                    "sizeBytes": size,
                    "durationSeconds": round(duration, 1) if duration is not None else None,
                })
                print(f"  -> {mp3} ({size} bytes, {duration}s)")

        with open(set_manifest_path, "w", encoding="utf-8") as f:
            json.dump({"parts": manifest_parts}, f, indent=2)

    if not is_legacy:
        rebuild_global_manifest(out_dir, url_root)
    print("Done.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Listening audio via Piper TTS")
    parser.add_argument("--input", default=None, help="Job JSON path (default: legacy listening-scripts.json)")
    parser.add_argument("--output", default=None, help="Output directory (default: public/audio/listening-1)")
    parser.add_argument("--url-root", default=None, help="URL root for global-manifest src entries")
    parser.add_argument("--set", default=None, help="Only generate the given setId")
    args = parser.parse_args()

    job = args.input or LEGACY_SCRIPTS
    out = args.output or LEGACY_OUT
    if args.url_root:
        url_root = args.url_root
    else:
        url_root = "/audio/targeted" if "targeted" in out else "/audio/listening-1"
    generate(job, out, url_root, only_set=args.set)


if __name__ == "__main__":
    main()
