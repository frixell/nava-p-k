export interface ImageAsset {
  id?: string;
  publicId?: string;
  src?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  order?: number;
  [key: string]: unknown;
}
