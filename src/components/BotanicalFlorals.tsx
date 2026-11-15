import type { ReactNode } from 'react';

export function RoyalOrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <svg
      width="160"
      height="24"
      viewBox="0 0 160 24"
      aria-hidden="true"
      className={`text-[#B58938] ${className}`}
    >
      <path
        d="M8 12 H58 M102 12 H152"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeOpacity="0.7"
      />
      <path
        d="M80 2 C83 8, 88 10, 96 12 C88 14, 83 16, 80 22 C77 16, 72 14, 64 12 C72 10, 77 8, 80 2 Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="60" cy="12" r="1.8" fill="currentColor" />
      <circle cx="100" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

function RoyalCornerFinial({ className = '' }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      aria-hidden="true"
      className={`pointer-events-none text-[#B98D3B] ${className}`}
    >
      <path
        d="M4 40 V12 C4 7.5, 7.5 4, 12 4 H40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.75"
      />
      <path
        d="M10 34 V14 C10 11.8, 11.8 10, 14 10 H34"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.55"
      />
      <circle cx="10" cy="10" r="2.2" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

interface InvitationCardFrameProps {
  id: string;
  children: ReactNode;
  isArchCover?: boolean;
  floralPosition?: 'top-sides' | 'bottom-sides' | 'alternating';
}

export function InvitationCardFrame({
  id,
  children,
  isArchCover = false,
}: InvitationCardFrameProps) {
  return (
    <section
      id={id}
      className={`relative w-full ${
        isArchCover ? 'pt-10 pb-12 sm:pt-14 sm:pb-16' : 'py-12 sm:py-16'
      }`}
    >
      {/* Graceful Golden Arch Halo framing the Welcome section seamlessly on the full page */}
      {isArchCover && (
        <div className="relative z-10 mx-auto max-w-[680px] px-5 sm:px-8">
          <div className="relative rounded-t-[170px] sm:rounded-t-[320px] border-t-2 border-x-2 border-[#C49A45]/80 pt-10 pb-8 sm:pt-14 sm:pb-10 px-5 sm:px-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 sm:inset-3.5 rounded-t-[162px] sm:rounded-t-[308px] border-t border-x border-[#C49A45]/45"
            />
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      )}

      {!isArchCover && (
        <div className="relative z-10 mx-auto max-w-[740px] px-6 sm:px-14">
          <div className="flex justify-center mb-10" aria-hidden="true">
            <RoyalOrnamentDivider className="opacity-70" />
          </div>
          {children}
        </div>
      )}
    </section>
  );
}

export { RoyalCornerFinial };
