export interface HeroMetricDefinition {
  id: string;
  valueKey: string;
  labelKey: string;
  fallbackValueEn: string;
  fallbackLabelEn: string;
  fallbackValueHe: string;
  fallbackLabelHe: string;
}

export const HERO_METRIC_DEFINITIONS: HeroMetricDefinition[] = [
  {
    id: 'cities',
    valueKey: 'homepage.hero.metrics.cities.value',
    labelKey: 'homepage.hero.metrics.cities.label',
    fallbackValueEn: '10+',
    fallbackLabelEn: 'Global Cities',
    fallbackValueHe: '10+',
    fallbackLabelHe: 'ערים גלובליות'
  },
  {
    id: 'themes',
    valueKey: 'homepage.hero.metrics.themes.value',
    labelKey: 'homepage.hero.metrics.themes.label',
    fallbackValueEn: '5',
    fallbackLabelEn: 'Themes',
    fallbackValueHe: '5',
    fallbackLabelHe: 'תמות'
  },
  {
    id: 'insights',
    valueKey: 'homepage.hero.metrics.insights.value',
    labelKey: 'homepage.hero.metrics.insights.label',
    fallbackValueEn: '50+',
    fallbackLabelEn: 'Comparative Insights',
    fallbackValueHe: '50+',
    fallbackLabelHe: 'תובנות השוואתיות'
  }
];
