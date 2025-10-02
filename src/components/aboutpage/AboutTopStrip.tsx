import React from 'react';
import {
  TopStripRoot,
  ImageWrapper,
  HeroImage,
  UploadAction,
  SloganWrapper,
  SloganTextarea,
  SloganText,
  Placeholder
} from './AboutTopStrip.styles';
import type { AboutImage } from '../../containers/useAboutPageState';

interface AboutTopStripProps {
  language: string;
  isAuthenticated: boolean;
  image?: AboutImage;
  text?: string;
  onTextChange(value: string): void;
  onRequestUpload(): void;
}

const AboutTopStrip: React.FC<AboutTopStripProps> = ({
  language,
  isAuthenticated,
  image,
  text,
  onTextChange,
  onRequestUpload
}) => {
  const dir: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';
  const displayText = text ?? '';

  return (
    <TopStripRoot>
      <ImageWrapper>
        {image?.src ? <HeroImage src={image.src} alt={image.alt ?? 'About cover'} /> : <Placeholder>No image uploaded</Placeholder>}
        {isAuthenticated && (
          <UploadAction type="button" onClick={onRequestUpload} aria-label="Upload about image">
            ↑
          </UploadAction>
        )}
      </ImageWrapper>

      <SloganWrapper dir={dir}>
        {isAuthenticated ? (
          <SloganTextarea
            dir={dir}
            value={displayText}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder={language === 'he' ? 'הקלידו סיסמה' : 'Add a headline'}
          />
        ) : (
          <SloganText dir={dir}>{displayText}</SloganText>
        )}
      </SloganWrapper>
    </TopStripRoot>
  );
};

export default AboutTopStrip;
