import type { TeachItem, TeachingSeo } from '../../containers/teaching/types';

export const buildTeach = (overrides: Partial<TeachItem> = {}): TeachItem => ({
  id: 'teach-1',
  details: '<p>Detail</p>',
  description: '<p>Description</p>',
  detailsHebrew: '<p>פרטים</p>',
  descriptionHebrew: '<p>תיאור</p>',
  order: 1,
  visible: true,
  publicId: 'public-1',
  image: null,
  ...overrides
});

export const buildSeo = (overrides: Partial<TeachingSeo> = {}): TeachingSeo => ({
  title: 'Teaching',
  description: 'Teaching description',
  keyWords: 'teaching',
  ...overrides
});

export const buildTeachingPageState = (teachings: Record<string, TeachItem>, seo?: TeachingSeo) => ({
  website: {
    teachingpage: {
      teachings,
      seo: seo ?? buildSeo()
    }
  }
});

