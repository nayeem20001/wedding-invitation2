import { WEDDING_DETAILS } from '../data/weddingData';
import { InvitationCardFrame, RoyalOrnamentDivider } from './BotanicalFlorals';

interface WelcomeCoverCardProps {
  guestName: string | null;
}

export function WelcomeCoverCard({ guestName }: WelcomeCoverCardProps) {
  return (
    <InvitationCardFrame id="welcome" isArchCover>
      <div className="text-center pt-9 sm:pt-12 pb-2 sm:pb-3 flex flex-col items-center">
        <RoyalOrnamentDivider className="mb-6" />

        {guestName && (
          <p
            data-testid="personalized-guest-greeting"
            className="font-script-calligraphy text-3xl sm:text-4xl text-[#8F6B29] mb-3"
          >
            Dear {guestName},
          </p>
        )}

        <p className="font-royal-engraved text-[11px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] text-[#8F6B29] font-semibold mb-5">
          {WEDDING_DETAILS.welcomeHeading}
        </p>

        <h1
          aria-label="Mubin & Moon"
          className="flex flex-col items-center text-center mb-5 select-none"
        >
          <span className="font-royal-decorative text-[clamp(2.25rem,10.5vw,4.25rem)] font-bold tracking-[0.12em] sm:tracking-[0.14em] text-[#153024] leading-[1.06] drop-shadow-[0_1px_0_rgba(196,154,69,0.28)]">
            Mubin
          </span>
          <span
            aria-hidden="true"
            className="my-1.5 sm:my-2 flex items-center justify-center gap-4 w-40 sm:w-60"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C49A45]/85" />
            <span className="font-script-calligraphy text-3xl sm:text-5xl text-[#A37B2E] leading-none pt-1">
              &amp;
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C49A45]/85" />
          </span>
          <span className="font-royal-decorative text-[clamp(2.25rem,10.5vw,4.25rem)] font-bold tracking-[0.12em] sm:tracking-[0.14em] text-[#153024] leading-[1.06] drop-shadow-[0_1px_0_rgba(196,154,69,0.28)]">
            Moon
          </span>
        </h1>

        <RoyalOrnamentDivider className="mb-5" />

        <p className="font-serif-display text-lg sm:text-xl text-[#153024] font-semibold tracking-wide">
          {WEDDING_DETAILS.receptionDateEnglish}
        </p>
        <p className="font-serif-display text-sm sm:text-base text-[#5E523D] mt-1.5">
          Pouro Community Center · Madaripur
        </p>
      </div>
    </InvitationCardFrame>
  );
}
