import React from 'react';

interface PageUpStripProps {
  pageupImageClassName: string;
  pageupImageStyle?: React.CSSProperties;
}

const pageToTop = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

const PageUpStrip: React.FC<PageUpStripProps> = ({ pageupImageClassName, pageupImageStyle }) => (
  <div className="pageup__box desktop">
    <div className="pageup__image__hover" />
    <div id="pageup__image" className={pageupImageClassName} style={pageupImageStyle} onClick={pageToTop} />
  </div>
);

export default PageUpStrip;
