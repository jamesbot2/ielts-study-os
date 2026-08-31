#!/usr/bin/env python3
"""Generate original listening audio from the speaker-marked scripts.

Uses Piper (local TTS). Voices are downloaded to scripts/tts/voices/ (gitignored).
Output is written to public/audio/listening-1/ as MP3.

Run:
    python scripts/tts/generate_audio.py
"""

import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SCRIPTS = os.path.join(HERE, "listening-scripts.json")
VOICES_DIR = os.path.join(HERE, "voices")
OUT_DIR = os.path.join(ROOT, "public", "audio", "listening-1")

PY = sys.executable  # the venv python that has piper installed
SILENCE_SECONDS = 0.5


def synth_line(text: str, voice: str, out_wav: str) -> None:
    model = os.path.join(VOICES_DIR, f"{voice}.onnx")
    if not os.path.exists(model):
        raise FileNotFoundError(f"Voice model not found: {model}")
    # piper reads text from stdin and writes WAV to -f
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
    # Build a concat list and join, then transcode to mono MP3.
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


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(SCRIPTS, "r", encoding="utf-8") as f:
        data = json.load(f)

    manifest = []
    with tempfile.TemporaryDirectory() as tmp:
        for part in data["parts"]:
            wavs = []
            for i, line in enumerate(part["lines"]):
                wav = os.path.join(tmp, f"p{part['part']}_{i}.wav")
                print(f"Part {part['part']} line {i + 1}/{len(part['lines'])} ({line['voice']})…")
                synth_line(line["text"], line["voice"], wav)
                wavs.append(wav)
                if i < len(part["lines"]) - 1:
                    silence = os.path.join(tmp, f"sil_{part['part']}_{i}.wav")
                    make_silence(silence, SILENCE_SECONDS)
                    wavs.append(silence)
            mp3 = os.path.join(OUT_DIR, f"part{part['part']}.mp3")
            concat_and_convert(wavs, mp3)
            size = os.path.getsize(mp3)
            manifest.append({"part": part["part"], "title": part["title"], "src": f"/audio/listening-1/part{part['part']}.mp3", "sizeBytes": size})
            print(f"  -> {mp3} ({size} bytes)")

    with open(os.path.join(OUT_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump({"parts": manifest}, f, indent=2)
    print("Done. Wrote manifest.json")


if __name__ == "__main__":
    main()
