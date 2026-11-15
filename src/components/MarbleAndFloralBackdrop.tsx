import { useEffect, useId, useRef } from 'react';
import ROYAL_FLORAL_CANVAS_SRC from '../assets/images/royal_parchment_floral_1794658610087.jpg';
import { ResilientImage } from './ResilientImage';

const FLORAL_BANDS = [
  { top: '0%', height: '25%', flipY: false },
  { top: '25%', height: '25%', flipY: true },
  { top: '50%', height: '25%', flipY: false },
  { top: '75%', height: '25%', flipY: true },
];

// Foreground 3D sculpted gold-rimmed petals & gilded botanical sprigs positioned along left/right edges
const FLOATING_PETALS_LEFT = [
  { top: '7%', left: '5%', size: 54, rot: 22, kind: 'petal' as const },
  { top: '22%', left: '9%', size: 78, rot: -14, kind: 'sprig' as const },
  { top: '39%', left: '4%', size: 48, rot: 38, kind: 'petal' as const },
  { top: '56%', left: '8%', size: 74, rot: 12, kind: 'sprig' as const },
  { top: '72%', left: '5%', size: 52, rot: -26, kind: 'petal' as const },
  { top: '87%', left: '8%', size: 70, rot: 18, kind: 'sprig' as const },
];

const FLOATING_PETALS_RIGHT = [
  { top: '11%', right: '6%', size: 74, rot: 16, kind: 'sprig' as const },
  { top: '27%', right: '5%', size: 50, rot: -32, kind: 'petal' as const },
  { top: '44%', right: '8%', size: 78, rot: -12, kind: 'sprig' as const },
  { top: '61%', right: '5%', size: 54, rot: 28, kind: 'petal' as const },
  { top: '76%', right: '9%', size: 72, rot: -18, kind: 'sprig' as const },
  { top: '90%', right: '5%', size: 46, rot: 20, kind: 'petal' as const },
];

function Sculpted3DPetal({ size, rot }: { size: number; rot: number }) {
  const gradId = `petal-${useId().replace(/:/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{
        transform: `rotate(${rot}deg)`,
        filter: 'drop-shadow(4px 10px 10px rgba(21, 48, 36, 0.24))',
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F5EFE2" />
          <stop offset="100%" stopColor="#DFD2B8" />
        </linearGradient>
      </defs>
      <path
        d="M32 6 C46 14, 52 32, 42 50 C37 58, 27 58, 22 50 C12 32, 18 14, 32 6 Z"
        fill={`url(#${gradId})`}
        stroke="#C49A45"
        strokeWidth="0.9"
        strokeOpacity="0.6"
      />
      <path
        d="M32 10 C35 24, 34 38, 30 52"
        fill="none"
        stroke="#C49A45"
        strokeWidth="0.7"
        strokeOpacity="0.45"
      />
    </svg>
  );
}

function Sculpted3DGoldSprig({ size, rot, mirror = false }: { size: number; rot: number; mirror?: boolean }) {
  const gradId = `gold-${useId().replace(/:/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      style={{
        transform: `rotate(${rot}deg) scaleX(${mirror ? -1 : 1})`,
        filter: 'drop-shadow(5px 12px 12px rgba(21, 48, 36, 0.26))',
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4DEAA" />
          <stop offset="50%" stopColor="#C9A048" />
          <stop offset="100%" stopColor="#8E6922" />
        </linearGradient>
      </defs>
      <path
        d="M14 82 Q38 46 80 14"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M32 58 C24 44, 34 32, 46 42 C44 52, 38 56, 32 58 Z"
        fill={`url(#${gradId})`}
        fillOpacity="0.88"
      />
      <path
        d="M52 38 C44 24, 54 14, 66 24 C64 34, 58 38, 52 38 Z"
        fill={`url(#${gradId})`}
        fillOpacity="0.85"
      />
      <path
        d="M44 56 C58 50, 68 60, 56 70 C48 68, 44 62, 44 56 Z"
        fill={`url(#${gradId})`}
        fillOpacity="0.82"
      />
      <circle cx="80" cy="14" r="2.6" fill="#F4DEAA" stroke="#9A7228" strokeWidth="0.7" />
      <circle cx="68" cy="34" r="2.2" fill="#F4DEAA" stroke="#9A7228" strokeWidth="0.6" />
    </svg>
  );
}

export function MarbleAndFloralBackdrop() {
  const leftShadowRef = useRef<HTMLDivElement | null>(null);
  const rightShadowRef = useRef<HTMLDivElement | null>(null);
  const leftMainRef = useRef<HTMLDivElement | null>(null);
  const rightMainRef = useRef<HTMLDivElement | null>(null);
  const leftFrontRef = useRef<HTMLDivElement | null>(null);
  const rightFrontRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frameId: number | null = null;

    const applyParallax = () => {
      frameId = null;
      const y = prefersReduced ? 0 : window.scrollY;

      const shadowY = y * 0.04;
      const midY = -y * 0.05;
      const frontY = -y * 0.095;

      const swayX = prefersReduced ? 0 : Math.sin(y * 0.0045) * 7;
      const swayRot = prefersReduced ? 0 : Math.sin(y * 0.004) * 1.5;
      const frontSwayX = prefersReduced ? 0 : Math.cos(y * 0.0055) * 10;
      const frontRot = prefersReduced ? 0 : Math.sin(y * 0.006) * 3.2;

      if (leftShadowRef.current) {
        leftShadowRef.current.style.transform = `translate3d(${(12 + swayX * 0.4).toFixed(2)}px, ${shadowY.toFixed(2)}px, 0)`;
      }
      if (rightShadowRef.current) {
        rightShadowRef.current.style.transform = `translate3d(${(-12 - swayX * 0.4).toFixed(2)}px, ${shadowY.toFixed(2)}px, 0)`;
      }

      if (leftMainRef.current) {
        leftMainRef.current.style.transform = `perspective(1000px) rotateY(9deg) translate3d(${swayX.toFixed(2)}px, ${midY.toFixed(2)}px, 0) rotateZ(${swayRot.toFixed(2)}deg)`;
      }
      if (rightMainRef.current) {
        rightMainRef.current.style.transform = `perspective(1000px) rotateY(-9deg) translate3d(${(-swayX).toFixed(2)}px, ${midY.toFixed(2)}px, 0) rotateZ(${(-swayRot).toFixed(2)}deg)`;
      }

      if (leftFrontRef.current) {
        leftFrontRef.current.style.transform = `perspective(900px) rotateY(12deg) translate3d(${frontSwayX.toFixed(2)}px, ${frontY.toFixed(2)}px, 0) rotateZ(${frontRot.toFixed(2)}deg)`;
      }
      if (rightFrontRef.current) {
        rightFrontRef.current.style.transform = `perspective(900px) rotateY(-12deg) translate3d(${(-frontSwayX).toFixed(2)}px, ${frontY.toFixed(2)}px, 0) rotateZ(${(-frontRot).toFixed(2)}deg)`;
      }
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(applyParallax);
      }
    };

    applyParallax();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const leftEdgeMask =
    'linear-gradient(to right, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.9) 46%, rgba(0,0,0,0.35) 76%, transparent 98%)';
  const rightEdgeMask =
    'linear-gradient(to left, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.9) 46%, rgba(0,0,0,0.35) 76%, transparent 98%)';
  const verticalBandMask =
    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 10%, black 24%, black 76%, rgba(0,0,0,0.6) 90%, transparent 100%)';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* 1. Center & Full-Page Royal Calacatta Marble Shade */}
      <div
        data-testid="royal-marble-backdrop"
        className="absolute inset-0"
        style={{
          backgroundColor: '#F8F2E6',
          backgroundImage: `
            radial-gradient(ellipse 62% 34% at 50% 13%, rgba(255, 255, 255, 0.84) 0%, rgba(232, 220, 198, 0.44) 56%, transparent 100%),
            radial-gradient(ellipse 56% 18% at 38% 26%, rgba(203, 187, 162, 0.30) 0%, transparent 72%),
            radial-gradient(ellipse 58% 36% at 42% 38%, rgba(208, 194, 172, 0.42) 0%, rgba(235, 225, 206, 0.20) 58%, transparent 100%),
            radial-gradient(ellipse 62% 20% at 62% 52%, rgba(205, 190, 166, 0.28) 0%, transparent 72%),
            radial-gradient(ellipse 66% 38% at 58% 64%, rgba(255, 255, 255, 0.76) 0%, rgba(212, 198, 176, 0.36) 54%, transparent 100%),
            radial-gradient(ellipse 60% 18% at 44% 78%, rgba(202, 186, 162, 0.28) 0%, transparent 72%),
            radial-gradient(ellipse 56% 32% at 48% 88%, rgba(21, 48, 36, 0.055) 0%, rgba(196, 154, 69, 0.12) 46%, transparent 100%)
          `,
        }}
      />

      {/* Seamless Full-Slab Calacatta Stone & Antique-Gold Hairline Marble Veins */}
      <svg
        viewBox="0 0 1200 2800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-[0.88]"
        xmlns="http://www.w3.org/2000/svg"
      >

        {/* Crisp natural mineral veins & delicate branching hairline fissures */}
        <g fill="none" strokeLinecap="round">
          <path
            d="M-20 210 C 210 278, 395 162, 590 215 C 745 256, 890 342, 1060 295 C 1140 272, 1190 255, 1240 242"
            stroke="#948570"
            strokeWidth="1.5"
            strokeOpacity="0.24"
          />
          <path
            d="M590 215 C 655 155, 725 110, 810 42"
            stroke="#948570"
            strokeWidth="0.95"
            strokeOpacity="0.19"
          />
          <path
            d="M1220 755 C 940 705, 735 845, 515 832 C 335 821, 185 885, -20 965"
            stroke="#8D7E6A"
            strokeWidth="1.4"
            strokeOpacity="0.23"
          />
          <path
            d="M515 832 C 440 895, 365 955, 290 1045"
            stroke="#8D7E6A"
            strokeWidth="0.9"
            strokeOpacity="0.18"
          />
          <path
            d="M-20 1315 C 245 1412, 465 1235, 685 1295 C 865 1344, 1020 1425, 1230 1310"
            stroke="#968772"
            strokeWidth="1.45"
            strokeOpacity="0.22"
          />
          <path
            d="M685 1295 C 740 1218, 795 1165, 875 1110"
            stroke="#968772"
            strokeWidth="0.85"
            strokeOpacity="0.17"
          />
          <path
            d="M1220 1975 C 915 1895, 685 2048, 435 2012 C 255 1986, 120 2045, -20 2120"
            stroke="#91826D"
            strokeWidth="1.35"
            strokeOpacity="0.22"
          />
          <path
            d="M-20 2455 C 265 2535, 520 2365, 760 2425 C 945 2472, 1085 2515, 1230 2435"
            stroke="#948570"
            strokeWidth="1.35"
            strokeOpacity="0.21"
          />

          {/* Fine antique-gold quartz shimmer threads */}
          <path
            d="M120 430 C 340 390, 520 488, 740 442 C 920 404, 1060 475, 1180 438"
            stroke="#C49A45"
            strokeWidth="1.1"
            strokeOpacity="0.22"
          />
          <path
            d="M1110 1055 C 880 1020, 690 1125, 455 1080 C 280 1046, 145 1115, 25 1095"
            stroke="#C49A45"
            strokeWidth="1.05"
            strokeOpacity="0.20"
          />
          <path
            d="M60 1650 C 315 1615, 545 1710, 785 1660 C 960 1624, 1090 1695, 1190 1665"
            stroke="#C49A45"
            strokeWidth="1.05"
            strokeOpacity="0.21"
          />
          <path
            d="M1150 2235 C 885 2190, 650 2295, 390 2255 C 215 2228, 95 2285, -10 2265"
            stroke="#C49A45"
            strokeWidth="1"
            strokeOpacity="0.19"
          />
        </g>
      </svg>

      {/* Seamless full-width center luminous satin-marble sheen (no box boundaries) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 48% 92% at 50% 50%, rgba(252,249,242,0.52) 15%, rgba(252,249,242,0.18) 56%, transparent 86%)',
        }}
      />

      {/* 2. Depth Plane 1: Recessed 3D Botanical Cast Shadow on the Marble Slab */}
      <div
        ref={leftShadowRef}
        className="absolute -top-[6%] bottom-[-6%] left-0 w-20 sm:w-56 lg:w-76 will-change-transform"
        style={{ WebkitMaskImage: leftEdgeMask, maskImage: leftEdgeMask }}
      >
        {FLORAL_BANDS.map((band, idx) => (
          <div
            key={`shadow-left-${idx}`}
            style={{
              top: band.top,
              height: band.height,
              WebkitMaskImage: verticalBandMask,
              maskImage: verticalBandMask,
            }}
            className="absolute inset-x-0 overflow-hidden"
          >
            <ResilientImage
              src={ROYAL_FLORAL_CANVAS_SRC}
              alt=""
              priority={idx === 0}
              className={`absolute top-[-12%] left-[-36%] sm:left-[-48%] w-[390%] sm:w-[445%] max-w-none h-[124%] object-cover brightness-[0.3] contrast-[1.25] saturate-[0.25] blur-[6px] opacity-[0.18] ${
                band.flipY ? 'scale-y-[-1]' : ''
              }`}
            />
          </div>
        ))}
      </div>

      <div
        ref={rightShadowRef}
        className="absolute -top-[6%] bottom-[-6%] right-0 w-20 sm:w-56 lg:w-76 will-change-transform"
        style={{ WebkitMaskImage: rightEdgeMask, maskImage: rightEdgeMask }}
      >
        {FLORAL_BANDS.map((band, idx) => (
          <div
            key={`shadow-right-${idx}`}
            style={{
              top: band.top,
              height: band.height,
              WebkitMaskImage: verticalBandMask,
              maskImage: verticalBandMask,
            }}
            className="absolute inset-x-0 overflow-hidden"
          >
            <ResilientImage
              src={ROYAL_FLORAL_CANVAS_SRC}
              alt=""
              priority={idx === 0}
              className={`absolute top-[-12%] right-[-36%] sm:right-[-48%] w-[390%] sm:w-[445%] max-w-none h-[124%] object-cover brightness-[0.3] contrast-[1.25] saturate-[0.25] blur-[6px] opacity-[0.18] ${
                band.flipY ? 'scale-y-[-1]' : ''
              }`}
            />
          </div>
        ))}
      </div>

      {/* 3. Depth Plane 2: Sculpted 3D Left & Right Magnolia Garlands (transparent background over marble + scroll sway) */}
      <div
        ref={leftMainRef}
        className="absolute -top-[6%] bottom-[-6%] left-0 w-20 sm:w-56 lg:w-76 will-change-transform origin-left"
        style={{ WebkitMaskImage: leftEdgeMask, maskImage: leftEdgeMask }}
      >
        {FLORAL_BANDS.map((band, idx) => (
          <div
            key={`floral-left-${idx}`}
            style={{
              top: band.top,
              height: band.height,
              WebkitMaskImage: verticalBandMask,
              maskImage: verticalBandMask,
            }}
            className="absolute inset-x-0 overflow-hidden"
          >
            <ResilientImage
              src={ROYAL_FLORAL_CANVAS_SRC}
              alt=""
              priority={idx === 0}
              className={`absolute top-[-12%] left-[-36%] sm:left-[-48%] w-[390%] sm:w-[445%] max-w-none h-[124%] object-cover mix-blend-multiply contrast-[1.1] saturate-[1.16] brightness-[1.03] ${
                band.flipY ? 'scale-y-[-1]' : ''
              }`}
            />
          </div>
        ))}
      </div>

      <div
        ref={rightMainRef}
        className="absolute -top-[6%] bottom-[-6%] right-0 w-20 sm:w-56 lg:w-76 will-change-transform origin-right"
        style={{ WebkitMaskImage: rightEdgeMask, maskImage: rightEdgeMask }}
      >
        {FLORAL_BANDS.map((band, idx) => (
          <div
            key={`floral-right-${idx}`}
            style={{
              top: band.top,
              height: band.height,
              WebkitMaskImage: verticalBandMask,
              maskImage: verticalBandMask,
            }}
            className="absolute inset-x-0 overflow-hidden"
          >
            <ResilientImage
              src={ROYAL_FLORAL_CANVAS_SRC}
              alt=""
              priority={idx === 0}
              className={`absolute top-[-12%] right-[-36%] sm:right-[-48%] w-[390%] sm:w-[445%] max-w-none h-[124%] object-cover mix-blend-multiply contrast-[1.1] saturate-[1.16] brightness-[1.03] ${
                band.flipY ? 'scale-y-[-1]' : ''
              }`}
            />
          </div>
        ))}
      </div>

      {/* 4. Depth Plane 3: Foreground Sculpted 3D Petals & Gold-Foil Botanical Sprigs Floating Over Edges */}
      <div
        ref={leftFrontRef}
        className="hidden sm:block absolute -top-[4%] bottom-[-4%] left-0 w-44 lg:w-56 will-change-transform origin-left"
      >
        {FLOATING_PETALS_LEFT.map((item, idx) => (
          <div
            key={`front-left-${idx}`}
            style={{ top: item.top, left: item.left }}
            className="absolute"
          >
            {item.kind === 'petal' ? (
              <Sculpted3DPetal size={item.size} rot={item.rot} />
            ) : (
              <Sculpted3DGoldSprig size={item.size} rot={item.rot} />
            )}
          </div>
        ))}
      </div>

      <div
        ref={rightFrontRef}
        className="hidden sm:block absolute -top-[4%] bottom-[-4%] right-0 w-44 lg:w-56 will-change-transform origin-right"
      >
        {FLOATING_PETALS_RIGHT.map((item, idx) => (
          <div
            key={`front-right-${idx}`}
            style={{ top: item.top, right: item.right }}
            className="absolute"
          >
            {item.kind === 'petal' ? (
              <Sculpted3DPetal size={item.size} rot={item.rot} />
            ) : (
              <Sculpted3DGoldSprig size={item.size} rot={item.rot} mirror />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
