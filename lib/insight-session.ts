import type { InsightProfile } from '../src/core/insight/types';
import type { Recommendation } from '../src/core/recommendation/types';
import type { SessionBrief } from '../src/core/session-brief/buildSessionBrief';

export const CONCERN_STORAGE_KEY = 'astrolive.concern';
export const INSIGHT_PROFILE_STORAGE_KEY = 'astrolive.insightProfile';
export const RECOMMENDATIONS_STORAGE_KEY = 'astrolive.recommendations';
export const BOOKING_STORAGE_KEY = 'astrolive.booking';
export const SESSION_BRIEF_STORAGE_KEY = 'astrolive.sessionBrief';

export type Booking = { bookingId: string; astrologerId: string; scheduledAt: string; status: 'confirmed' };

type SessionStorageLike = Pick<Storage, 'getItem' | 'setItem'>;
type AnalyzeConcern = (concern: string) => Readonly<InsightProfile> | Promise<Readonly<InsightProfile>>;

export type AnalysisSessionResult =
  | { ok: true; profile: Readonly<InsightProfile>; serializedProfile: string }
  | { ok: false; message: string };

export type StoredInsightProfileResult =
  | { ok: true; profile: Readonly<InsightProfile> }
  | { ok: false };

export function isInsightProfile(value: unknown): value is Readonly<InsightProfile> {
  if (!value || typeof value !== 'object') return false;

  const profile = value as Partial<InsightProfile>;
  return (
    typeof profile.id === 'string' &&
    typeof profile.engineVersion === 'string' &&
    typeof profile.concernCategory === 'string' &&
    typeof profile.subcategory === 'string' &&
    typeof profile.primaryNeed === 'string' &&
    typeof profile.urgency === 'string' &&
    typeof profile.suggestedConsultation === 'string' &&
    typeof profile.confidence === 'number' &&
    Array.isArray(profile.explanation) &&
    profile.explanation.every(
      (entry) =>
        typeof entry?.ruleId === 'string' &&
        typeof entry.type === 'string' &&
        typeof entry.weight === 'number' &&
        typeof entry.message === 'string',
    ) &&
    typeof profile.quickInsightText === 'string' &&
    typeof profile.created_at === 'string'
  );
}

export function loadStoredInsightProfile(storage: Pick<Storage, 'getItem'>): StoredInsightProfileResult {
  try {
    const serializedProfile = storage.getItem(INSIGHT_PROFILE_STORAGE_KEY);
    if (!serializedProfile) return { ok: false };

    const profile: unknown = JSON.parse(serializedProfile);
    return isInsightProfile(profile) ? { ok: true, profile } : { ok: false };
  } catch {
    return { ok: false };
  }
}

export function storeRecommendations(storage: Pick<Storage, 'setItem'>, recommendations: Recommendation[]) {
  storage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recommendations));
}

export function loadStoredRecommendations(storage: Pick<Storage, 'getItem'>): Recommendation[] | null {
  try {
    const serialized = storage.getItem(RECOMMENDATIONS_STORAGE_KEY);
    const recommendations: unknown = serialized ? JSON.parse(serialized) : null;
    if (!Array.isArray(recommendations) || !recommendations.every((item) => typeof item?.astrologer?.id === 'string')) return null;
    return recommendations as Recommendation[];
  } catch {
    return null;
  }
}

export function createBooking(astrologerId: string, scheduledAt: string): Booking {
  return { bookingId: `booking_${astrologerId}_${scheduledAt.replace(/[^a-zA-Z0-9]/g, '')}`, astrologerId, scheduledAt, status: 'confirmed' };
}

export function formatPrototypeSlot(slot: string): string {
  const date = new Date(slot);
  if (Number.isNaN(date.getTime())) return slot;

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata',
  }).format(date);
}

export function storeBooking(storage: Pick<Storage, 'setItem'>, booking: Booking) {
  storage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
}

export function loadStoredBooking(storage: Pick<Storage, 'getItem'>): Booking | null {
  try {
    const value: unknown = JSON.parse(storage.getItem(BOOKING_STORAGE_KEY) ?? 'null');
    return value && typeof value === 'object' && typeof (value as Booking).bookingId === 'string' && typeof (value as Booking).astrologerId === 'string' && typeof (value as Booking).scheduledAt === 'string' && (value as Booking).status === 'confirmed' ? value as Booking : null;
  } catch { return null; }
}
export function storeSessionBrief(storage: Pick<Storage, 'setItem'>, brief: SessionBrief) { storage.setItem(SESSION_BRIEF_STORAGE_KEY, JSON.stringify(brief)); }
export function loadStoredSessionBrief(storage: Pick<Storage, 'getItem'>): SessionBrief | null { try { const value: unknown=JSON.parse(storage.getItem(SESSION_BRIEF_STORAGE_KEY)??'null'); return value&&typeof value==='object'&&typeof (value as SessionBrief).bookingId==='string'&&Array.isArray((value as SessionBrief).suggested_questions)?value as SessionBrief:null; } catch{return null;} }

/**
 * Connects the browser session to the canonical analysis engine without
 * interpreting or deriving any insight fields in the UI.
 */
export async function analyzeStoredConcern(
  storage: SessionStorageLike,
  analyzeConcern: AnalyzeConcern,
): Promise<AnalysisSessionResult> {
  try {
    const concern = storage.getItem(CONCERN_STORAGE_KEY)?.trim();

    if (!concern) {
      return { ok: false, message: 'We could not find a concern to analyze. Please start again.' };
    }

    const profile = await analyzeConcern(concern);

    if (!isInsightProfile(profile)) {
      return { ok: false, message: 'We could not prepare your insight. Please try again.' };
    }

    const serializedProfile = JSON.stringify(profile);
    if (!serializedProfile) {
      return { ok: false, message: 'We could not prepare your insight. Please try again.' };
    }

    storage.setItem(INSIGHT_PROFILE_STORAGE_KEY, serializedProfile);
    return { ok: true, profile, serializedProfile };
  } catch {
    return { ok: false, message: 'We could not analyze your concern. Please try again.' };
  }
}
