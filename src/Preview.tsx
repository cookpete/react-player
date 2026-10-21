import React, { useState, useEffect, useRef } from 'react';

import type { PreviewProps } from './types';

const ICON_SIZE = '64px';

const cache: Record<string, string> = {};

const Preview = ({
  src,
  light,
  oEmbedUrl,
  onClickPreview,
  onPreviewError,
  playIcon,
  previewTabIndex,
  previewAriaLabel,
}: PreviewProps) => {
  const [image, setImage] = useState<string | null>(null);
  const onPreviewErrorRef = useRef(onPreviewError);
  onPreviewErrorRef.current = onPreviewError;

  useEffect(() => {
    if (!src || !light || !oEmbedUrl) return;
    if (React.isValidElement(light)) return;
    if (typeof light === 'string') {
      setImage(light);
      return;
    }
    if (cache[src]) {
      setImage(cache[src]);
      return;
    }
    setImage(null);

    let cancelled = false;
    const fetchImage = async () => {
      try {
        const response = await fetch(oEmbedUrl.replace('{url}', src));
        if (!response.ok) {
          throw new Error(`Preview image request failed with status ${response.status}`);
        }
        const data = await response.json();

        if (typeof data.thumbnail_url === 'string' && !cancelled) {
          const fetchedImage = data.thumbnail_url
            .replace('height=100', 'height=480')
            .replace('-d_295x166', '-d_640');
          setImage(fetchedImage);
          cache[src] = fetchedImage;
        }
      } catch (error) {
        if (!cancelled) {
          onPreviewErrorRef.current?.(error instanceof Error ? error : new Error(String(error)));
        }
      }
    };
    void fetchImage();

    return () => {
      cancelled = true;
    };
  }, [src, light, oEmbedUrl]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClickPreview?.(e);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClickPreview?.(e);
  };

  const isElement = React.isValidElement(light);

  const flexCenter = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const styles = {
    preview: {
      width: '100%',
      height: '100%',
      backgroundImage: image && !isElement ? `url(${image})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      cursor: 'pointer',
      ...flexCenter,
    },
    shadow: {
      background: 'radial-gradient(rgb(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)',
      borderRadius: ICON_SIZE,
      width: ICON_SIZE,
      height: ICON_SIZE,
      position: isElement ? 'absolute' as const : undefined,
      ...flexCenter,
    },
    playIcon: {
      borderStyle: 'solid',
      borderWidth: '16px 0 16px 26px',
      borderColor: 'transparent transparent transparent white',
      marginLeft: '7px',
    },
  };

  const defaultPlayIcon = (
    <div style={styles.shadow} className="react-player__shadow">
      <div style={styles.playIcon} className="react-player__play-icon" />
    </div>
  );

  return (
    <div
      style={styles.preview}
      className="react-player__preview"
      tabIndex={previewTabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      {...(previewAriaLabel ? { 'aria-label': previewAriaLabel } : {})}
    >
      {isElement ? light : null}
      {playIcon || defaultPlayIcon}
    </div>
  );
};

export default Preview;
