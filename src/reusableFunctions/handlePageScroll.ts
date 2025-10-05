export type PageScrollResult = {
  pageupImageClassName: 'pageup__image__absolute' | 'pageup__image__fixed' | 'pageup__image';
};

const PAGE_UP_ELEMENT_ID = 'pageup__image';
const PAGE_UP_ANCHOR_ID = 'fake_pageupstrip';
const FOOTER_OFFSET = 12;
const HEIGHT_PADDING = 10;

const toPageScrollResult = (
  pageupImageClassName: PageScrollResult['pageupImageClassName']
): PageScrollResult => ({
  pageupImageClassName
});

export const handlePageScroll = (
  currentClassName: string,
  navigation?: unknown,
  stateNavigationHomepageCarouselDone?: unknown
): PageScrollResult | void => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const anchorElement = document.getElementById(PAGE_UP_ANCHOR_ID);
  const pageUpElement = document.getElementById(PAGE_UP_ELEMENT_ID);

  if (!anchorElement || !pageUpElement) {
    return undefined;
  }

  const footerTop = anchorElement.getBoundingClientRect().top;
  const pageUpHeight = pageUpElement.offsetHeight || 0;
  const threshold = (pageUpHeight + HEIGHT_PADDING) * 2 - FOOTER_OFFSET;
  const windowHeight = window.innerHeight;
  const windowScrollTop = window.scrollY || window.pageYOffset;

  if (
    windowScrollTop >= threshold &&
    currentClassName !== 'pageup__image__fixed' &&
    currentClassName !== 'pageup__image'
  ) {
    return toPageScrollResult('pageup__image__fixed');
  }

  if (windowScrollTop < threshold && currentClassName === 'pageup__image__fixed') {
    return toPageScrollResult('pageup__image__absolute');
  }

  if (footerTop < windowHeight - FOOTER_OFFSET && currentClassName === 'pageup__image__fixed') {
    return toPageScrollResult('pageup__image');
  }

  if (footerTop > windowHeight - FOOTER_OFFSET && currentClassName === 'pageup__image') {
    return toPageScrollResult('pageup__image__fixed');
  }

  // Navigation arguments were previously used in the legacy implementation to
  // synchronise with a homepage carousel. We keep the signature for backwards
  // compatibility even though the modern hooks no longer depend on it.
  void navigation;
  void stateNavigationHomepageCarouselDone;

  return undefined;
};

export default handlePageScroll;
