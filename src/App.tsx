/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { CeremonyInfoCard } from './components/CeremonyInfoCard';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { MarbleAndFloralBackdrop } from './components/MarbleAndFloralBackdrop';
import { ReceptionCountdownCard } from './components/ReceptionCountdownCard';
import { VenueMapCard } from './components/VenueMapCard';
import { WelcomeCoverCard } from './components/WelcomeCoverCard';
import { WEDDING_DETAILS } from './data/weddingData';
import { startHarmonyAudio, stopHarmonyAudio } from './utils/harmonyAudio';
import {
  type InvitationStage,
  isEnvelopeLayerVisible,
  isMainInvitationRevealed,
  parseInviteParams,
} from './utils/invitationLogic';

const AUTO_SCROLL_PX_PER_SEC = 34;

export default function App() {
  const initialParams =
    typeof window !== 'undefined'
      ? parseInviteParams(window.location.search)
      : { guestName: null, autostart: false };

  const [guestName] = useState<string | null>(initialParams.guestName);
  const [stage, setStage] = useState<InvitationStage>(
    initialParams.autostart ? 'opened' : 'sealed'
  );
  const [isAutoScrolling, setIsAutoScrolling] = useState(
    initialParams.autostart
  );
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const scrollRemainderRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const didTouchDragRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${window.location.pathname}`;
    const absoluteOgImage = `${origin}/og-image.jpg`;

    const upsertMeta = (attr: 'property' | 'name', key: string, content: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', absoluteOgImage);
    upsertMeta('property', 'og:image:secure_url', absoluteOgImage);
    upsertMeta('name', 'twitter:image', absoluteOgImage);
  }, []);

  const stopAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;
    scrollRemainderRef.current = 0;
  }, []);

  // Stage 1 -> Main Invitation: Unfold damask envelope flaps directly into the full-page invitation with music & slow auto-scroll
  const handleUnsealEnvelope = useCallback(() => {
    if (stage !== 'sealed') return;
    setStage('envelope-unfolding');

    if (!isMusicPlaying) {
      const started = startHarmonyAudio();
      if (started) setIsMusicPlaying(true);
    }

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const unfoldDuration = prefersReduced ? 50 : 1550;

    transitionTimerRef.current = window.setTimeout(() => {
      setStage('opened');
      window.scrollTo({ top: 0, behavior: 'auto' });

      if (!prefersReduced) {
        window.setTimeout(() => {
          setIsAutoScrolling(true);
        }, 450);
      }
    }, unfoldDuration);
  }, [stage, isMusicPlaying]);

  // Tap anywhere on the display (excluding links/buttons/maps) to pause or resume slow auto-scroll
  const handleDisplayTap = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (stage !== 'opened') return;
      if (didTouchDragRef.current) {
        didTouchDragRef.current = false;
        return;
      }

      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          'a, button, input, select, textarea, iframe, [role="button"]'
        )
      ) {
        return;
      }

      if (isAutoScrolling) {
        stopAutoScroll();
      } else {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll > 0 && window.scrollY >= maxScroll - 4) {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
        setIsAutoScrolling(true);
      }
    },
    [stage, isAutoScrolling, stopAutoScroll]
  );

  // Pause slow auto-scroll on manual wheel or touch swipe (without blocking simple taps)
  useEffect(() => {
    const cancelOnWheel = () => {
      stopAutoScroll();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
      didTouchDragRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const currentY = e.touches[0]?.clientY ?? touchStartYRef.current;
      if (Math.abs(currentY - touchStartYRef.current) > 4) {
        didTouchDragRef.current = true;
        stopAutoScroll();
      }
    };

    window.addEventListener('wheel', cancelOnWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', cancelOnWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [stopAutoScroll]);

  // Smooth slow scroll animation loop
  useEffect(() => {
    if (!isAutoScrolling || stage !== 'opened') {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
      scrollRemainderRef.current = 0;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const elapsedSec = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const delta = elapsedSec * AUTO_SCROLL_PX_PER_SEC + scrollRemainderRef.current;
      const wholePx = Math.floor(delta);
      scrollRemainderRef.current = delta - wholePx;

      if (wholePx > 0) {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 2) {
          stopAutoScroll();
          return;
        }
        window.scrollBy({ top: wholePx, behavior: 'auto' });
      }

      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isAutoScrolling, stage, stopAutoScroll]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      stopHarmonyAudio();
    };
  }, []);

  const showEnvelope = isEnvelopeLayerVisible(stage);
  const revealMain = isMainInvitationRevealed(stage);

  return (
    <div
      data-envelope-state={stage}
      data-music-playing={isMusicPlaying ? 'true' : 'false'}
      className="relative min-h-screen flex flex-col bg-[#FBF7EE] text-[#153024]"
    >
      {showEnvelope && (
        <EnvelopeIntro
          phase={stage === 'envelope-unfolding' ? 'envelope-unfolding' : 'sealed'}
          guestName={guestName}
          onUnseal={handleUnsealEnvelope}
        />
      )}

      <div
        onClick={handleDisplayTap}
        aria-hidden={!revealMain}
        className={`relative flex-1 flex flex-col overflow-x-clip touch-pan-y ${
          stage === 'opened'
            ? 'opacity-100'
            : revealMain
              ? 'opacity-100 scale-100 transition-all duration-1000 ease-out'
              : 'max-h-dvh overflow-hidden opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <MarbleAndFloralBackdrop />

        {/* Continuous full-page antique-gold outer double frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 sm:inset-4 z-20 border-2 border-[#C49A45]/75 rounded-[18px] sm:rounded-[24px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3.5 sm:inset-6 z-20 border border-[#C49A45]/40 rounded-[12px] sm:rounded-[18px]"
        />

        <main
          data-autoscroll={isAutoScrolling ? 'playing' : 'paused'}
          className="relative z-10 flex-1 py-0"
        >
          <WelcomeCoverCard guestName={guestName} />

          <CeremonyInfoCard />

          <ReceptionCountdownCard />

          <VenueMapCard />
        </main>

        <footer className="relative z-10 border-t border-[#C49A45]/35 py-12 text-center px-8">
          <p className="font-serif-display italic text-xl sm:text-2xl text-[#153024] tracking-wide max-w-xl mx-auto leading-relaxed">
            {WEDDING_DETAILS.footerBlessing}
          </p>
        </footer>
      </div>
    </div>
  );
}
