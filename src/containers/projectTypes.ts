export interface ProjectOption {
  id: string | number;
  name: string;
  nameHebrew?: string;
}

export interface ProjectSubcategory {
  id?: string | number;
  name: string;
  nameHebrew?: string;
  options: ProjectOption[];
}

export interface ProjectCategory {
  id?: string | number;
  name: string;
  nameHebrew?: string;
  color?: string;
  categories: ProjectSubcategory[];
}

export interface ProjectExtendedContent {
  title?: string;
  titleHebrew?: string;
  content?: string;
  contentHebrew?: string;
  tableOptions?: string;
  image?: string;
}

export interface ProjectEntity {
  id?: string;
  categoryId?: string;
  categories?: string;
  extendedContent?: ProjectExtendedContent;
  [key: string]: unknown;
}

export interface I18nLike {
  language: string;
  [key: string]: unknown;
}

export interface ChangeEventPayload {
  target: {
    value: string;
    dataset: {
      action: string;
      name: string;
    };
  };
}
