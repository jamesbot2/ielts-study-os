"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getProfile, saveProfile } from "@/lib/storage/repository";
import type { StudyProfile } from "@/lib/storage/types";
import { DEFAULT_PROFILE } from "@/lib/storage/types";

interface StudyProfileContextValue {
  profile: StudyProfile;
  loading: boolean;
  testType: "academic" | "general";
  updateProfile: (patch: Partial<StudyProfile>) => Promise<void>;
}

const StudyProfileContext = createContext<StudyProfileContextValue | null>(null);

export function StudyProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudyProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<StudyProfile>(DEFAULT_PROFILE);

  // Load once on mount.
  useEffect(() => {
    let cancelled = false;
    getProfile().then((p) => {
      if (cancelled) return;
      setProfile(p);
      profileRef.current = p;
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<StudyProfile>) => {
      const prev = profileRef.current;
      const next = { ...prev, ...patch };
      setProfile(next);
      profileRef.current = next;
      try {
        await saveProfile(next);
      } catch (err) {
        // Revert on failure so the UI does not silently diverge from storage.
        setProfile(prev);
        profileRef.current = prev;
        throw err;
      }
    },
    [],
  );

  const value = useMemo<StudyProfileContextValue>(
    () => ({
      profile,
      loading,
      testType: profile.testType,
      updateProfile,
    }),
    [profile, loading, updateProfile],
  );

  return <StudyProfileContext.Provider value={value}>{children}</StudyProfileContext.Provider>;
}

export function useStudyProfile(): StudyProfileContextValue {
  const ctx = useContext(StudyProfileContext);
  if (!ctx) throw new Error("useStudyProfile must be used within StudyProfileProvider");
  return ctx;
}
