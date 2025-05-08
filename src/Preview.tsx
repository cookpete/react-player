import React, { useState, useEffect } from 'react';

import type { PreviewProps } from './types';

const ICON_SIZE = '64px';

const cache: Record<string, string> = {};

const Preview = ({
  src,
  light,
  oEmbedUrl,
  onClickPreview,
  playIcon,
  previewTabIndex,
  previewAriaLabel,
}: PreviewProps) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!src || !light || !oEmbedUrl) return;
    fetchImage({ src, light, oEmbedUrl });
  }, [src, light, oEmbedUrl]);

  const fetchImage = async ({
    src,
    light,
    oEmbedUrl,
  }: {
    src: string;
    light: boolean | string | React.ReactElement;
    oEmbedUrl: string;
  }) => {
    if (React.isValidElement(light)) {
      return;
    }
    if (typeof light === 'string') {
      setImage(light);
      return;
    }
    if (cache[src]) {
      setImage(cache[src]);
      return;
    }
    setImage(null);

    const response = await fetch(oEmbedUrl.replace('{url}', src));
    const data = await response.json();

    if (data.thumbnail_url) {
      const fetchedImage = data.thumbnail_url
        .replace('height=100', 'height=480')
        .replace('-d_295x166', '-d_640');
      setImage(fetchedImage);
      cache[src] = fetchedImage;
    }
  };

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
      onKeyPress={handleKeyPress}
      {...(previewAriaLabel ? { 'aria-label': previewAriaLabel } : {})}
    >
      {isElement ? light : null}
      {playIcon || defaultPlayIcon}
    </div>
  );
};

export default Preview;
