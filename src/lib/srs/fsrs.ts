import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  type Card,
  type Grade,
} from "ts-fsrs";

export type ReviewRating = "again" | "hard" | "good" | "easy";

const scheduler = fsrs(
  generatorParameters({
    enable_fuzz: false,
    maximum_interval: 365,
    request_retention: 0.9,
  }),
);

const RATING_TO_GRADE: Record<ReviewRating, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

export function emptyCard(): Card {
  return createEmptyCard();
}

export function parseCard(state: string | null | undefined): Card | null {
  if (!state) return null;
  try {
    return JSON.parse(state) as Card;
  } catch {
    return null;
  }
}

export interface ScheduleResult {
  card: Card;
  due: Date;
}

export function scheduleReview(
  card: Card | null,
  rating: ReviewRating,
  now = new Date(),
): ScheduleResult {
  const base: Card = card ?? createEmptyCard();
  const record = scheduler.next(base, now, RATING_TO_GRADE[rating]);
  return { card: record.card, due: record.card.due };
}

export function getRetention(card: Card | null): number {
  if (!card) return 0;
  return Math.round(card.stability * 10) / 10;
}
