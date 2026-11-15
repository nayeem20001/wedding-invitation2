import { Check, Copy, ExternalLink, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import { WEDDING_DETAILS } from '../data/weddingData';
import {
  buildMapsDirectionsUrl,
  buildMapsEmbedUrl,
  buildMapsPlaceUrl,
} from '../utils/invitationLogic';
import { InvitationCardFrame, RoyalOrnamentDivider } from './BotanicalFlorals';

export function VenueMapCard() {
  const [copied, setCopied] = useState(false);

  const embedUrl = buildMapsEmbedUrl(WEDDING_DETAILS.venueMapQuery);
  const openMapsUrl = buildMapsPlaceUrl(WEDDING_DETAILS.venueMapQuery);
  const directionsUrl = buildMapsDirectionsUrl(WEDDING_DETAILS.venueMapQuery);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(WEDDING_DETAILS.venueAddressEnglish);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <InvitationCardFrame id="venue">
      <div className="text-center flex flex-col items-center">
        <h2 className="font-royal-engraved text-2xl sm:text-3xl font-semibold tracking-[0.14em] text-[#153024] mb-3">
          {WEDDING_DETAILS.venueHeading}
        </h2>

        <RoyalOrnamentDivider className="mb-6" />

        <div className="flex items-center justify-center gap-2 text-[#8F6B29] mb-2">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="font-serif-display text-xl sm:text-2xl font-semibold text-[#153024]">
            {WEDDING_DETAILS.venueName}
          </span>
        </div>

        <p className="font-serif-display text-base sm:text-lg text-[#2A4235] max-w-md leading-relaxed">
          {WEDDING_DETAILS.venueAddressEnglish}
        </p>
        <p className="text-xs sm:text-sm text-[#5E523D] max-w-md mt-1 mb-7">
          {WEDDING_DETAILS.venueAddressBangla}
        </p>

        {/* Embedded Google Map with royal double-gold frame */}
        <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-[#C49A45]/80 bg-[#EFECE3] mb-7 shadow-md">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          >
            <svg viewBox="0 0 600 280" className="w-full h-full opacity-80">
              <rect width="600" height="280" fill="#EFECE3" />
              <path
                d="M0 70 H600 M0 140 H600 M0 210 H600 M120 0 V280 M260 0 V280 M420 0 V280"
                stroke="#DFD8C8"
                strokeWidth="1.5"
              />
              <path
                d="M40 260 C170 200, 320 155, 560 40"
                stroke="#D1C7B1"
                strokeWidth="7"
                fill="none"
              />
              <path
                d="M90 25 Q250 110, 335 265"
                stroke="#C5D2C7"
                strokeWidth="12"
                fill="none"
              />
              <circle cx="300" cy="135" r="36" fill="#153024" fillOpacity="0.1" />
              <circle cx="300" cy="135" r="14" fill="#153024" fillOpacity="0.2" />
              <circle cx="300" cy="135" r="6" fill="#153024" />
            </svg>
            <div className="absolute bottom-3 left-3 bg-[#FCFBF8]/95 border border-[#C49A45]/60 rounded-md px-3 py-1.5 text-left">
              <p className="text-xs font-medium text-[#153024]">
                Pouro Community Center · Notun Bazar
              </p>
              <p className="text-[11px] text-[#5E523D]">
                Near Shumon Hotel Road, Madaripur
              </p>
            </div>
          </div>

          <iframe
            title="Google Map — Pouro Community Center, Madaripur"
            src={embedUrl}
            referrerPolicy="no-referrer-when-downgrade"
            className="relative z-10 w-full h-full border-0"
          />
        </div>

        {/* Map & Directions Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={openMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#153024] text-[#FAF5EB] border border-[#C49A45]/60 text-xs sm:text-sm font-medium hover:bg-[#0E2219] transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-2 focus-visible:outline-[#153024]"
          >
            <ExternalLink className="w-4 h-4 text-[#DFBE78]" />
            <span>Open in Maps</span>
          </a>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#C49A45] bg-[#FAF6EC]/90 text-[#153024] text-xs sm:text-sm font-medium hover:bg-[#F3EAD8] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#153024]"
          >
            <Navigation className="w-4 h-4 text-[#8F6B29]" />
            <span>Get directions</span>
          </a>

          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#C49A45]/65 bg-[#FAF6EC]/90 text-[#153024] text-xs sm:text-sm font-medium hover:bg-[#F3EAD8] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#153024]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#153024]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#8F6B29]" />
                <span>Copy Address</span>
              </>
            )}
          </button>
        </div>
      </div>
    </InvitationCardFrame>
  );
}
