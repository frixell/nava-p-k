import React from 'react';
import {
  TopStripRoot,
  ImageWrapper,
  HeroImage,
  UploadAction,
  Placeholder
} from './AboutTopStrip.styles';
import type { AboutImage } from '../../containers/useAboutPageState';

interface AboutTopStripProps {
  isAuthenticated: boolean;
  image?: AboutImage;
  onRequestUpload(): void;
}

const AboutTopStrip: React.FC<AboutTopStripProps> = ({
  isAuthenticated,
  image,
  onRequestUpload
}) => {
  return (
    <TopStripRoot>
      <ImageWrapper>
        {image?.src ? (
          <HeroImage src={image.src} alt={image.alt ?? 'About cover'} />
        ) : (
          <Placeholder>No image uploaded</Placeholder>
        )}
        {isAuthenticated && (
          <UploadAction type="button" onClick={onRequestUpload} aria-label="Upload about image">
            ↑
          </UploadAction>
        )}
      </ImageWrapper>
    </TopStripRoot>
  );
};

export default AboutTopStrip;
