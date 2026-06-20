import { useSyncExternalStore } from "react";
import { EMPTY_PROFILE, HistoryEntry, UserProfile } from "./types";

const KEYS = {
  profile: "mm_profile",
  pantry: "mm_pantry",
  history: "mm_history",
  customPhotos: "mm_custom_photos",
} as const;

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

function getRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  notify();
}

export function getProfile(): UserProfile {
  return readJson(KEYS.profile, EMPTY_PROFILE);
}

export function setProfile(profile: UserProfile) {
  writeJson(KEYS.profile, profile);
}

export function getPantry(): string[] {
  return readJson(KEYS.pantry, []);
}

export function setPantry(items: string[]) {
  writeJson(KEYS.pantry, items);
}

export function getHistory(): HistoryEntry[] {
  return readJson(KEYS.history, []);
}

export function addHistoryEntry(entry: HistoryEntry) {
  const history = getHistory();
  history.unshift(entry);
  writeJson(KEYS.history, history.slice(0, 100));
}

export function getCustomPhotos(): Record<string, string> {
  return readJson(KEYS.customPhotos, {});
}

export function setCustomPhoto(recipeId: string, url: string | null) {
  const photos = getCustomPhotos();
  if (url && url.trim()) {
    photos[recipeId] = url.trim();
  } else {
    delete photos[recipeId];
  }
  writeJson(KEYS.customPhotos, photos);
}

/**
 * Reactive read of a localStorage-backed key via useSyncExternalStore, so
 * components stay in sync without setState-in-effect (banned by
 * react-hooks/set-state-in-effect).
 */
function useStoredRaw(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => getRaw(key),
    () => null,
  );
}

export function usePantry(): [string[], (items: string[]) => void] {
  const raw = useStoredRaw(KEYS.pantry);
  const pantry: string[] = raw ? JSON.parse(raw) : [];
  return [pantry, setPantry];
}

export function useProfile(): [UserProfile, (profile: UserProfile) => void] {
  const raw = useStoredRaw(KEYS.profile);
  const profile: UserProfile = raw ? JSON.parse(raw) : EMPTY_PROFILE;
  return [profile, setProfile];
}

export function useHistory(): HistoryEntry[] {
  const raw = useStoredRaw(KEYS.history);
  return raw ? JSON.parse(raw) : [];
}

export function useCustomPhoto(
  recipeId: string,
): [string | null, (url: string | null) => void] {
  const raw = useStoredRaw(KEYS.customPhotos);
  const photos: Record<string, string> = raw ? JSON.parse(raw) : {};
  return [
    photos[recipeId] ?? null,
    (url: string | null) => setCustomPhoto(recipeId, url),
  ];
}
