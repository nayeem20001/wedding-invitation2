export type InvitationStage = 'sealed' | 'envelope-unfolding' | 'opened';

export function isEnvelopeLayerVisible(stage: InvitationStage): boolean {
  return stage === 'sealed' || stage === 'envelope-unfolding';
}

export function isMainInvitationRevealed(stage: InvitationStage): boolean {
  return stage === 'envelope-unfolding' || stage === 'opened';
}

export function shouldStartAutoScrollForStage(stage: InvitationStage): boolean {
  return stage === 'opened';
}

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export interface CalendarCell {
  day: number | null;
  isHighlighted: boolean;
}

export interface CalendarEventSpec {
  id: string;
  title: string;
  startIso: string;
  endIso: string;
  location: string;
  description: string;
}

export function parseInviteParams(search: string): {
  guestName: string | null;
  autostart: boolean;
} {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const rawGuest = params.get('guest') ?? params.get('to') ?? '';
  const cleaned = rawGuest.replace(/\s+/g, ' ').trim().slice(0, 64);
  const autostart = params.get('autostart') === '1' || params.get('open') === '1';

  return {
    guestName: cleaned.length > 0 ? cleaned : null,
    autostart,
  };
}

export function calculateCountdown(targetIso: string, nowMs: number): CountdownState {
  const targetMs = Date.parse(targetIso);
  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const diffMs = targetMs - nowMs;
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

export function padTwoDigits(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, '0');
}

export function generateMonthCalendarCells(
  year: number,
  monthIndexZeroBased: number,
  highlightDay: number
): CalendarCell[] {
  const firstWeekday = new Date(Date.UTC(year, monthIndexZeroBased, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndexZeroBased + 1, 0)).getUTCDate();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ day: null, isHighlighted: false });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ day: d, isHighlighted: d === highlightDay });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, isHighlighted: false });
  }
  return cells;
}

export function buildMapsPlaceUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildMapsDirectionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function buildMapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

function formatIcsTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '20261120T080000Z';
  }
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildCalendarIcs(event: CalendarEventSpec): string {
  const dtStart = formatIcsTimestamp(event.startIso);
  const dtEnd = formatIcsTimestamp(event.endIso);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mubin & Moon//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@mubin-moon-wedding`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
