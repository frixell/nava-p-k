export interface HeroMetricDraft {
  id: string;
  value: string;
  label: string;
  valueHe: string;
  labelHe: string;
}

export interface HeroDraft {
  portraitUrl: string;
  portraitPublicId?: string;
  metrics: HeroMetricDraft[];
}
