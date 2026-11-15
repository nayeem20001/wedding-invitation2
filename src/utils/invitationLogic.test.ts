import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCalendarIcs,
  buildMapsDirectionsUrl,
  buildMapsEmbedUrl,
  buildMapsPlaceUrl,
  calculateCountdown,
  generateMonthCalendarCells,
  isEnvelopeLayerVisible,
  isMainInvitationRevealed,
  padTwoDigits,
  parseInviteParams,
  shouldStartAutoScrollForStage,
} from './invitationLogic';
import { midiToFreq, RIVER_FLOWS_PIANO_BARS } from './harmonyAudio';

test('parseInviteParams extracts guest name and autostart flag', () => {
  const parsed = parseInviteParams('?guest=Tariq%20Ahmed&autostart=1');
  assert.equal(parsed.guestName, 'Tariq Ahmed');
  assert.equal(parsed.autostart, true);

  const empty = parseInviteParams('');
  assert.equal(empty.guestName, null);
  assert.equal(empty.autostart, false);
});

test('2-stage invitation visibility keeps auto-scroll gated until envelope finishes unfolding', () => {
  assert.equal(isEnvelopeLayerVisible('sealed'), true);
  assert.equal(isMainInvitationRevealed('sealed'), false);
  assert.equal(shouldStartAutoScrollForStage('sealed'), false);

  // Envelope unfolding reveals main invitation underneath while keeping scroll paused until complete
  assert.equal(isEnvelopeLayerVisible('envelope-unfolding'), true);
  assert.equal(isMainInvitationRevealed('envelope-unfolding'), true);
  assert.equal(shouldStartAutoScrollForStage('envelope-unfolding'), false);

  // Opened enables continuous slow auto-scroll
  assert.equal(isEnvelopeLayerVisible('opened'), false);
  assert.equal(isMainInvitationRevealed('opened'), true);
  assert.equal(shouldStartAutoScrollForStage('opened'), true);
});

test('calculateCountdown calculates exact difference to 20 November 2026', () => {
  const target = '2026-11-20T14:00:00+06:00';
  const targetMs = Date.parse(target);

  const sixDaysBefore = calculateCountdown(
    target,
    targetMs - (6 * 86400 + 2 * 3600 + 15 * 60 + 9) * 1000
  );
  assert.deepEqual(sixDaysBefore, {
    days: 6,
    hours: 2,
    minutes: 15,
    seconds: 9,
    isPast: false,
  });

  const past = calculateCountdown(target, targetMs + 1000);
  assert.deepEqual(past, { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
  assert.equal(padTwoDigits(6), '06');
});

test('generateMonthCalendarCells builds November 2026 accurately with day 20 highlighted', () => {
  // November 2026: Month index 10, starts on Sunday (0), 30 days total
  const cells = generateMonthCalendarCells(2026, 10, 20);
  assert.equal(cells.length, 35); // 5 full weeks
  assert.equal(cells[0].day, 1);
  assert.equal(cells[29].day, 30);
  assert.equal(cells[30].day, null);

  const highlighted = cells.filter((c) => c.isHighlighted);
  assert.equal(highlighted.length, 1);
  assert.equal(highlighted[0].day, 20);
});

test('Google Maps URL builders encode Madaripur venue query cleanly', () => {
  const q = 'Pouro Community Center, Notun Bazar, Madaripur';
  assert.match(buildMapsPlaceUrl(q), /google\.com\/maps\/search/);
  assert.match(buildMapsDirectionsUrl(q), /google\.com\/maps\/dir/);
  assert.match(buildMapsEmbedUrl(q), /output=embed/);
});

test('buildCalendarIcs emits valid VEVENT for Madaripur reception', () => {
  const ics = buildCalendarIcs({
    id: 'mubin-moon-reception',
    title: 'Wedding Reception: Istiaque Mubin & Mushfika Jahan Moon',
    startIso: '2026-11-20T14:00:00+06:00',
    endIso: '2026-11-20T18:00:00+06:00',
    location: 'Pouro Community Center, Notun Bazar, Madaripur',
    description: 'Wedding reception celebration.',
  });
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /SUMMARY:Wedding Reception: Istiaque Mubin & Mushfika Jahan Moon/);
  assert.match(ics, /END:VEVENT/);
});

test('River Flows in You solo piano arrangement has valid 16 bars in 4/4 A major', () => {
  assert.equal(Math.round(midiToFreq(69)), 440);
  assert.ok(Math.abs(midiToFreq(54) - 185.0) < 0.05);

  assert.equal(RIVER_FLOWS_PIANO_BARS.length, 16);
  for (const bar of RIVER_FLOWS_PIANO_BARS) {
    assert.ok(bar.notes.length >= 6);
    for (const note of bar.notes) {
      assert.ok(Number.isInteger(note.step) && note.step >= 0 && note.step <= 15);
      assert.ok(note.midi >= 36 && note.midi <= 84);
      assert.ok(note.durationSec > 0);
      assert.ok(note.velocity > 0 && note.velocity <= 1);
    }
  }
});
