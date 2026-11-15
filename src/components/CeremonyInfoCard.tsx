import { WEDDING_DETAILS } from '../data/weddingData';
import { InvitationCardFrame, RoyalOrnamentDivider } from './BotanicalFlorals';

export function CeremonyInfoCard() {
  const { groom, bride } = WEDDING_DETAILS;

  return (
    <InvitationCardFrame id="ceremony">
      <div className="text-center flex flex-col items-center">
        <h2 className="font-royal-engraved text-2xl sm:text-3xl font-semibold tracking-[0.14em] text-[#153024] mb-3">
          {WEDDING_DETAILS.ceremonyHeading}
        </h2>

        <RoyalOrnamentDivider className="mb-8" />

        {/* Parents 2-column grid with vertical antique-gold divider */}
        <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-6 mb-10">
          <div className="space-y-1">
            <p className="font-serif-display italic text-sm sm:text-base text-[#8F6B29] font-medium">
              {groom.parentsPrefix}
            </p>
            <p className="font-serif-display text-base sm:text-lg font-semibold text-[#153024]">
              {groom.father}
            </p>
            <p className="font-serif-display text-base sm:text-lg font-semibold text-[#153024]">
              {groom.mother}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-[#C49A45] to-transparent mx-auto"
          />

          <div className="space-y-1">
            <p className="font-serif-display italic text-sm sm:text-base text-[#8F6B29] font-medium">
              {bride.parentsPrefix}
            </p>
            <p className="font-serif-display text-base sm:text-lg font-semibold text-[#153024]">
              {bride.father}
            </p>
            <p className="font-serif-display text-base sm:text-lg font-semibold text-[#153024]">
              {bride.mother}
            </p>
          </div>
        </div>

        {/* Royal Announcement */}
        <p className="font-royal-engraved text-xs sm:text-sm tracking-[0.18em] text-[#8F6B29] font-semibold max-w-md leading-relaxed mb-9 [text-wrap:balance]">
          {WEDDING_DETAILS.ceremonyAnnouncement}
        </p>

        {/* Groom & Bride Calligraphy Names */}
        <div className="space-y-3">
          <div>
            <p className="font-script-calligraphy text-[clamp(2.1rem,8.5vw,3.75rem)] text-[#153024] leading-tight">
              {groom.name}
            </p>
            <p className="font-royal-engraved text-[11px] tracking-[0.32em] text-[#8F6B29] font-semibold mt-2">
              {groom.label}
            </p>
          </div>

          <p className="font-script-calligraphy text-4xl text-[#8F6B29] py-1">
            &amp;
          </p>

          <div>
            <p className="font-script-calligraphy text-[clamp(2.1rem,8.5vw,3.75rem)] text-[#153024] leading-tight">
              {bride.name}
            </p>
            <p className="font-royal-engraved text-[11px] tracking-[0.32em] text-[#8F6B29] font-semibold mt-2">
              {bride.label}
            </p>
          </div>
        </div>
      </div>
    </InvitationCardFrame>
  );
}
