import { type ImgHTMLAttributes, useEffect, useRef, useState } from 'react';

interface ResilientImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt = '',
  className = '',
  priority = false,
  fallbackLabel,
  onLoad,
  onError,
  ...rest
}: ResilientImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    setStatus('loading');
    const el = imgRef.current;
    if (el && el.complete) {
      if (el.naturalWidth > 0) {
        setStatus('loaded');
      } else if (src) {
        setStatus('error');
      }
    }
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {status !== 'loaded' && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center bg-[#EFE6D7]/80 ${
            status === 'loading' ? 'animate-pulse' : ''
          }`}
        >
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center gap-1.5 px-3 text-center text-[#8F6B29]/75">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14 3 C16.5 9.5, 19.5 11.5, 25 14 C19.5 16.5, 16.5 18.5, 14 25 C11.5 18.5, 8.5 16.5, 3 14 C8.5 11.5, 11.5 9.5, 14 3 Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  fill="currentColor"
                  fillOpacity="0.16"
                />
              </svg>
              {fallbackLabel && (
                <span className="font-serif-display text-xs tracking-wide">
                  {fallbackLabel}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={(e) => {
          setStatus('loaded');
          onLoad?.(e);
        }}
        onError={(e) => {
          setStatus('error');
          onError?.(e);
        }}
        className={`${className} transition-opacity duration-500 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
}
