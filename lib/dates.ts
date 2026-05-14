// === NEW === date helpers — used across history views
import { getTodayDateString } from '../context/foodLog';

// === NEW === past N dates as YYYY-MM-DD strings, today first
export function getPastNDates(n: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
}

// === NEW === short label for list cards: "Today", "Yesterday", or "Mon May 12"
export function formatDateLabel(dateString: string): string {
  const today = getTodayDateString();
  if (dateString === today) return 'Today';

  // check yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yYyyy = yesterday.getFullYear();
  const yMm = String(yesterday.getMonth() + 1).padStart(2, '0');
  const yDd = String(yesterday.getDate()).padStart(2, '0');
  if (dateString === `${yYyyy}-${yMm}-${yDd}`) return 'Yesterday';

  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return `${weekday} ${month} ${d}`;
}

// === NEW === long label for the detail screen header: "Monday, May 12"
export function formatDateFull(dateString: string): string {
  const today = getTodayDateString();
  if (dateString === today) return 'Today';

  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  return `${weekday}, ${month} ${d}`;
}