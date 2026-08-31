import { describe, it, expect } from "vitest";
import {
  initialListeningPlaybackState,
  playbackStart,
  playbackProgress,
  playbackAdvance,
  playbackFinish,
  resumePartIndex,
  resumeCurrentTime,
} from "./listening-state";

const T0 = 1_700_000_000_000;

describe("listening playback state", () => {
  it("starts unstarted and unfinished", () => {
    const s = initialListeningPlaybackState(T0);
    expect(s.started).toBe(false);
    expect(s.finished).toBe(false);
    expect(s.partIndex).toBe(0);
    expect(s.currentTime).toBe(0);
  });

  it("start sets started=true and records startedAt", () => {
    const s = playbackStart(initialListeningPlaybackState(T0), T0 + 1000);
    expect(s.started).toBe(true);
    expect(s.startedAt).toBe(T0 + 1000);
  });

  it("start never flips an already-started state back", () => {
    const started = playbackStart(initialListeningPlaybackState(T0), T0);
    const resumed = playbackStart(started, T0 + 5000);
    expect(resumed.started).toBe(true);
    expect(resumed.startedAt).toBe(T0); // original start time preserved
  });

  it("progress records currentTime", () => {
    const started = playbackStart(initialListeningPlaybackState(T0), T0);
    const progressed = playbackProgress(started, 42.5, T0 + 5000);
    expect(progressed.currentTime).toBe(42.5);
    expect(progressed.started).toBe(true);
  });

  it("advance moves part and resets currentTime", () => {
    const s = playbackStart(initialListeningPlaybackState(T0), T0);
    const advanced = playbackAdvance(s, 1, T0 + 60000);
    expect(advanced.partIndex).toBe(1);
    expect(advanced.currentTime).toBe(0);
    expect(advanced.started).toBe(true);
  });

  it("finish sets finished and never un-finishes", () => {
    const s = playbackStart(initialListeningPlaybackState(T0), T0);
    const finished = playbackFinish(s, T0 + 120000);
    expect(finished.finished).toBe(true);
    // start must not reset finished
    const restarted = playbackStart(finished, T0 + 130000);
    expect(restarted.finished).toBe(true);
  });

  it("resume helpers return the persisted part and offset", () => {
    const s = playbackProgress(playbackAdvance(playbackStart(initialListeningPlaybackState(T0), T0), 2), 17.25);
    expect(resumePartIndex(s)).toBe(2);
    expect(resumeCurrentTime(s)).toBe(17.25);
  });

  it("resume helpers return 0 for an unstarted state", () => {
    const s = initialListeningPlaybackState(T0);
    expect(resumePartIndex(s)).toBe(0);
    expect(resumeCurrentTime(s)).toBe(0);
  });
});
