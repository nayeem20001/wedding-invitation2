import DAMASK_TEXTURE_SRC from '../assets/images/royal_damask_texture_1794658608584.jpg';
import WAX_SEAL_SRC from '../assets/images/royal_gold_wax_seal_1794658586575.jpg';
import { ResilientImage } from './ResilientImage';

export type EnvelopePhase = 'sealed' | 'envelope-unfolding';

interface EnvelopeIntroProps {
  phase: EnvelopePhase;
  guestName: string | null;
  onUnseal: () => void;
}

export function EnvelopeIntro({ phase, guestName, onUnseal }: EnvelopeIntroProps) {
  const isUnfolding = phase === 'envelope-unfolding';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation Envelope"
      className={`fixed inset-0 h-dvh z-50 flex items-center justify-center overflow-hidden transition-colors duration-700 ${
        isUnfolding ? 'envelope-unfolding bg-transparent pointer-events-none' : 'bg-[#EFE6D7]'
      }`}
    >

      {/* 3D 4-Flap Folded Photorealistic Damask Envelope */}
      <div className="envelope-stage relative w-full h-full flex items-center justify-center">
        {/* Left Flap */}
        <div
          aria-hidden="true"
          className="envelope-flap envelope-flap-left absolute inset-0 pointer-events-none"
          style={{
            filter: 'drop-shadow(12px 0px 20px rgba(42, 28, 12, 0.28))',
          }}
        >
          <div
            className="w-full h-full relative"
            style={{ clipPath: 'polygon(0 0, 52% 50%, 0 100%)' }}
          >
            <ResilientImage
              src={DAMASK_TEXTURE_SRC}
              alt=""
              priority
              className="w-full h-full object-cover opacity-95"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, rgba(250,244,234,0.36) 0%, rgba(235,221,197,0.28) 76%, rgba(145,112,58,0.26) 100%)',
              }}
            />
          </div>
        </div>

        {/* Right Flap */}
        <div
          aria-hidden="true"
          className="envelope-flap envelope-flap-right absolute inset-0 pointer-events-none"
          style={{
            filter: 'drop-shadow(-12px 0px 20px rgba(42, 28, 12, 0.28))',
          }}
        >
          <div
            className="w-full h-full relative"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 48% 50%)' }}
          >
            <ResilientImage
              src={DAMASK_TEXTURE_SRC}
              alt=""
              priority
              className="w-full h-full object-cover opacity-95"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(255deg, rgba(250,244,234,0.36) 0%, rgba(235,221,197,0.28) 76%, rgba(145,112,58,0.26) 100%)',
              }}
            />
          </div>
        </div>

        {/* Bottom Flap */}
        <div
          aria-hidden="true"
          className="envelope-flap envelope-flap-bottom absolute inset-0 pointer-events-none"
          style={{
            filter: 'drop-shadow(0px -10px 22px rgba(42, 28, 12, 0.30))',
          }}
        >
          <div
            className="w-full h-full relative"
            style={{ clipPath: 'polygon(0 100%, 50% 48%, 100% 100%)' }}
          >
            <ResilientImage
              src={DAMASK_TEXTURE_SRC}
              alt=""
              priority
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(0deg, rgba(252,247,238,0.28) 0%, rgba(238,224,200,0.20) 78%, rgba(145,112,58,0.22) 100%)',
              }}
            />
          </div>
        </div>

        {/* Top Flap */}
        <div
          aria-hidden="true"
          className="envelope-flap envelope-flap-top absolute inset-0 pointer-events-none"
          style={{
            filter: 'drop-shadow(0px 14px 26px rgba(38, 24, 10, 0.36))',
          }}
        >
          <div
            className="w-full h-full relative"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 54%)' }}
          >
            <ResilientImage
              src={DAMASK_TEXTURE_SRC}
              alt=""
              priority
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-start pt-8 sm:pt-12"
              style={{
                background:
                  'linear-gradient(180deg, rgba(252,247,238,0.34) 0%, rgba(239,225,202,0.20) 80%, rgba(140,106,52,0.26) 100%)',
              }}
            >
              {guestName && (
                <p className="font-script-calligraphy text-3xl sm:text-4xl text-[#5F451A] drop-shadow-xs">
                  For {guestName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Crisp diagonal antique-gold fold crease hairline overlay */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 w-full h-full z-20 transition-opacity duration-300 ${
            isUnfolding ? 'opacity-0' : 'opacity-65'
          }`}
        >
          <line x1="0" y1="0" x2="50" y2="54" stroke="#B68E45" strokeWidth="0.16" />
          <line x1="100" y1="0" x2="50" y2="54" stroke="#B68E45" strokeWidth="0.16" />
          <line x1="0" y1="100" x2="50" y2="48" stroke="#B68E45" strokeWidth="0.14" />
          <line x1="100" y1="100" x2="50" y2="48" stroke="#B68E45" strokeWidth="0.14" />
        </svg>

        {/* Center Photorealistic Antique Gold Wax Seal Button */}
        <div
          className={`relative z-30 flex flex-col items-center transition-all duration-500 ${
            isUnfolding ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <button
            type="button"
            onClick={onUnseal}
            aria-label="Tap wax seal to open wedding invitation"
            className="group relative w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7E591B] transition-transform duration-300 hover:scale-105 active:scale-95"
            style={{
              filter: 'drop-shadow(0 16px 26px rgba(42, 26, 8, 0.52))',
            }}
          >
            <ResilientImage
              src={WAX_SEAL_SRC}
              alt="Royal antique gold wax seal"
              priority
              fallbackLabel="Open"
              className="w-full h-full object-cover scale-[1.74] pointer-events-none select-none"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3B260A]/25 via-transparent to-white/15"
            />
          </button>

          <p className="mt-4 sm:mt-5 px-3 py-1 rounded-sm bg-[#FAF5EB]/70 font-royal-engraved text-xs sm:text-sm tracking-[0.34em] text-[#5F4214] font-semibold select-none">
            TAP TO OPEN
          </p>
        </div>
      </div>
    </div>
  );
}
