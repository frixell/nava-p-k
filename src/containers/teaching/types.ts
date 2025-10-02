export interface TeachImage {
    publicId?: string;
    src?: string;
    width?: number;
    height?: number;
}

export interface TeachItem {
    id: string;
    publicId?: string;
    image?: TeachImage | string | null;
    details?: string;
    description?: string;
    detailsHebrew?: string;
    descriptionHebrew?: string;
    order?: number;
    visible?: boolean | string;
    [key: string]: unknown;
}

export interface TeachingSeo {
    title: string;
    description: string;
    keyWords: string;
}

export interface TeachingPageStore {
    teachings?: TeachItem[] | Record<string, TeachItem>;
    seo?: TeachingSeo;
}

export const EMPTY_TEACH: TeachItem = {
    id: '',
    details: '',
    description: '',
    detailsHebrew: '',
    descriptionHebrew: '',
    order: 0,
    image: null,
    visible: true
};

export const DEFAULT_SEO: TeachingSeo = {
    title: '',
    description: '',
    keyWords: ''
};
