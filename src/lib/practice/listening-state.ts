// Shared listening playback state model. Pure and testable.
// Used by both the mock runner and the standalone listening runner so that
// refresh can never reset strict one-play audio.

export interface ListeningPlaybackState {
  started: boolean;
  finished: boolean;
  partIndex: number;
  currentTime: number; // seconds within the current part
  startedAt: number | null; // ms epoch when playback first started
  updatedAt: number; // ms epoch of last state change
}

export function initialListeningPlaybackState(now = Date.now()): ListeningPlaybackState {
  return { started: false, finished: false, partIndex: 0, currentTime: 0, startedAt: null, updatedAt: now };
}

export function playbackStart(state: ListeningPlaybackState, now = Date.now()): ListeningPlaybackState {
  // Once started, we never flip back to an unstarted state, and a finished
  // playback never becomes unfinished.
  return {
    ...state,
    started: true,
    partIndex: state.partIndex,
    currentTime: state.currentTime,
    startedAt: state.startedAt ?? now,
    updatedAt: now,
  };
}

export function playbackProgress(
  state: ListeningPlaybackState,
  currentTime: number,
  now = Date.now(),
): ListeningPlaybackState {
  if (!state.started) return state;
  return { ...state, currentTime, updatedAt: now };
}

export function playbackAdvance(
  state: ListeningPlaybackState,
  nextPartIndex: number,
  now = Date.now(),
): ListeningPlaybackState {
  return { ...state, partIndex: nextPartIndex, currentTime: 0, updatedAt: now };
}

export function playbackFinish(state: ListeningPlaybackState, now = Date.now()): ListeningPlaybackState {
  return { ...state, finished: true, currentTime: 0, updatedAt: now };
}

// In strict exam mode, a started (and not yet finished) playback must resume,
// never restart from the beginning.
export function resumePartIndex(state: ListeningPlaybackState): number {
  return state.started ? state.partIndex : 0;
}

export function resumeCurrentTime(state: ListeningPlaybackState): number {
  return state.started ? state.currentTime : 0;
}
