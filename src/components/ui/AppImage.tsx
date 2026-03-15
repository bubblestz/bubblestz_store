'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';

interface AppImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  onClick?: () => void;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  unoptimized?: boolean;
  [key: string]: any;
}

const AppImage = memo(function AppImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  sizes,
  onClick,
  fallbackSrc = '/assets/images/logo.png',
  loading = 'lazy',
  unoptimized = false,
  ...props
}: AppImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isExternalUrl = useMemo(
    () => typeof imageSrc === 'string' && imageSrc.startsWith('http'),
    [imageSrc]
  );
  // unoptimized and quality are Next.js specific, but we'll ignore them for simple img

  const handleError = useCallback(() => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  }, [hasError, imageSrc, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const imageClassName = useMemo(() => {
    const classes = [className];
    if (isLoading) classes.push('bg-gray-200');
    if (onClick) classes.push('cursor-pointer hover:opacity-90 transition-opacity duration-200');
    return classes.filter(Boolean).join(' ');
  }, [className, isLoading, onClick]);

  const imageProps = useMemo(() => {
    const baseProps: any = {
      src: imageSrc,
      alt,
      className: imageClassName,
      onError: handleError,
      onLoad: handleLoad,
      onClick,
    };

    if (priority) {
      baseProps.loading = 'eager';
    } else {
      baseProps.loading = loading;
    }

    return baseProps;
  }, [
    imageSrc,
    alt,
    imageClassName,
    priority,
    loading,
    handleError,
    handleLoad,
    onClick,
  ]);

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <img
          {...imageProps}
          style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          {...props}
        />
      </div>
    );
  }

  return (
    <img {...imageProps} width={width} height={height} {...props} />
  );
});

AppImage.displayName = 'AppImage';

export default AppImage;
