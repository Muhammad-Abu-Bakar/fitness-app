// === NEW === Types for weekly weight check-ins.
// One CheckIn = "on this date, I weighed this much."

export interface CheckIn {
  id: string;           // e.g. "checkin_1737..."
  date: string;         // YYYY-MM-DD — the day the weigh-in is FOR
  weightLbs: number;    // body weight in pounds
  notes?: string;       // optional — e.g. "morning weigh-in", "after vacation"
  timestamp: number;    // Date.now() when the entry was created (audit + tiebreaker)
}
