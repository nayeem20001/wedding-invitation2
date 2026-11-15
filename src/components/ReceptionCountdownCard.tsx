import { CalendarPlus, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WEDDING_DETAILS } from '../data/weddingData';
import {
  buildCalendarIcs,
  calculateCountdown,
  generateMonthCalendarCells,
  padTwoDigits,
} from '../utils/invitationLogic';
import { InvitationCardFrame, RoyalOrnamentDivider } from './BotanicalFlorals';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function ReceptionCountdownCard() {
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(WEDDING_DETAILS.receptionIso, Date.now())
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(calculateCountdown(WEDDING_DETAILS.receptionIso, Date.now()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const calendarCells = generateMonthCalendarCells(
    WEDDING_DETAILS.calendarYear,
    WEDDING_DETAILS.calendarMonthIndex,
    WEDDING_DETAILS.calendarHighlightDay
  );

  const countdownUnits = [
    { label: 'Days', value: padTwoDigits(countdown.days) },
    { label: 'Hours', value: padTwoDigits(countdown.hours) },
    { label: 'Minutes', value: padTwoDigits(countdown.minutes) },
    { label: 'Seconds', value: padTwoDigits(countdown.seconds) },
  ];

  const handleDownloadIcs = () => {
    const ics = buildCalendarIcs({
      id: 'mubin-moon-reception-2026',
      title: 'Wedding Reception: Istiaque Mubin & Mushfika Jahan Moon',
      startIso: WEDDING_DETAILS.receptionIso,
      endIso: WEDDING_DETAILS.receptionEndIso,
      location: WEDDING_DETAILS.venueAddressEnglish,
      description: 'Join us for the wedding reception of Istiaque Mubin & Mushfika Jahan Moon.',
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mubin-moon-reception-nov-20-2026.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <InvitationCardFrame id="reception">
      <div className="text-center flex flex-col items-center">
        <h2 className="font-royal-engraved text-2xl sm:text-3xl font-semibold tracking-[0.14em] text-[#153024] mb-3">
          {WEDDING_DETAILS.receptionHeading}
        </h2>

        <RoyalOrnamentDivider className="mb-6" />

        <p className="font-serif-display text-xl sm:text-2xl font-semibold text-[#8F6B29] mb-1">
          {WEDDING_DETAILS.receptionDateEnglish}
        </p>
        <p className="text-sm text-[#2A4235] font-medium mb-8">
          {WEDDING_DETAILS.receptionDateBangla}
        </p>

        {/* Royal Engraved Countdown Timer */}
        <div
          aria-label="Reception countdown timer"
          className="w-full max-w-lg grid grid-cols-4 gap-1.5 sm:gap-3 mb-9"
        >
          {countdownUnits.map((unit) => (
            <div
              key={unit.label}
              className="rounded-xl border border-[#C49A45]/80 bg-[#FAF6EC]/90 py-3 px-1 sm:py-3.5 sm:px-2 text-center shadow-xs overflow-hidden"
            >
              <div className="font-royal-engraved text-xl sm:text-3xl font-semibold text-[#153024] tabular-nums">
                {unit.value}
              </div>
              <div className="font-royal-engraved text-[8.5px] sm:text-[10px] tracking-[0.06em] sm:tracking-[0.16em] uppercase text-[#8F6B29] font-semibold mt-1">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        {/* Royal Deep Emerald Velvet November 2026 Mini Calendar */}
        <div
          data-testid="november-mini-calendar"
          className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#173628] to-[#0F241B] text-[#FAF5EB] p-4 sm:p-6 shadow-xl border-2 border-[#C49A45]/80 mb-7"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#C49A45]/35">
            <span className="font-royal-engraved text-sm sm:text-base tracking-[0.2em] font-semibold text-[#F5E1B5]">
              {WEDDING_DETAILS.calendarMonthLabel}
            </span>
            <span className="font-serif-display italic text-sm text-[#E5C98B]">
              Save the Date
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-[10px] tracking-wider text-[#DFC48C] font-semibold mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1 text-center">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm tabular-nums">
            {calendarCells.map((cell, idx) => {
              if (cell.day === null) {
                return <div key={`empty-${idx}`} className="h-9" />;
              }

              if (cell.isHighlighted) {
                return (
                  <div
                    key={cell.day}
                    aria-label="November 20, 2026 — Wedding Reception Date"
                    className="relative h-9 flex items-center justify-center"
                  >
                    <Heart
                      aria-hidden="true"
                      className="w-8 h-8 text-[#FAF5EB] fill-[#FAF5EB] drop-shadow-[0_2px_6px_rgba(255,255,255,0.35)]"
                    />
                    <span className="absolute text-[11px] font-bold text-[#132C21]">
                      {cell.day}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={cell.day}
                  className="h-9 flex items-center justify-center text-[#FAF5EB]/85"
                >
                  {cell.day}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadIcs}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md border border-[#C49A45] bg-[#FAF6EC]/90 text-xs sm:text-sm font-medium text-[#153024] hover:bg-[#F3EAD8] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#153024]"
        >
          <CalendarPlus className="w-4 h-4 text-[#8F6B29]" />
          <span>Add to Calendar</span>
        </button>
      </div>
    </InvitationCardFrame>
  );
}
