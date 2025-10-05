// @ts-nocheck
import { useCallback, useEffect } from 'react';
import type { TFunction } from 'i18next';
import isEqual from 'lodash.isequal';
import useMergeState from '../../utils/useMergeState';
import { appTokens } from '../../styles/theme';
import { HERO_METRIC_DEFINITIONS } from '../../constants/homeHeroMetrics';
import { cloudinaryEnv, isCloudinaryConfigured, logMissingCloudinaryConfig } from '../../constants/cloudinary';
import type { HomepageHeroMetric, HomepageState } from '../../store/slices/homepageSlice';
import type { HeroDraft, HeroMetricDraft } from './heroTypes';

const categoryColorsHEX = appTokens.categoryPalette;
const categoryColorsRGBOpacity = 1;
const categoryColorsRGB = [
  [64, 145, 145, categoryColorsRGBOpacity],
  [193, 97, 126, categoryColorsRGBOpacity],
  [94, 174, 136, categoryColorsRGBOpacity],
  [166, 201, 141, categoryColorsRGBOpacity],
  [219, 137, 118, categoryColorsRGBOpacity],
  [232, 226, 164, categoryColorsRGBOpacity],
  [229, 182, 130, categoryColorsRGBOpacity]
];

logMissingCloudinaryConfig();

const translateMetricText = (
  t: TFunction,
  getFixedT: ((lng: string) => TFunction) | undefined,
  key: string,
  fallback: string,
  lng: 'en' | 'he'
): string => {
  if (typeof getFixedT === 'function') {
    return getFixedT(lng)(key, fallback);
  }
  return t(key, { defaultValue: fallback, lng });
};

const buildHeroDraft = (
  homepage: HomepageState | undefined,
  t: TFunction,
  getFixedT?: (lng: string) => TFunction
): HeroDraft => {
  const metricsFromStore = Array.isArray(homepage?.hero?.metrics)
    ? (homepage?.hero?.metrics as HomepageHeroMetric[])
    : [];

  return {
    portraitUrl: homepage?.hero?.portraitUrl ?? '',
    portraitPublicId: homepage?.hero?.portraitPublicId ?? '',
    metrics: HERO_METRIC_DEFINITIONS.map((definition) => {
      const stored = metricsFromStore.find((metric) => metric?.id === definition.id);

      return {
        id: definition.id,
        value:
          stored?.value ??
          translateMetricText(t, getFixedT, definition.valueKey, definition.fallbackValueEn, 'en'),
        label:
          stored?.label ??
          translateMetricText(t, getFixedT, definition.labelKey, definition.fallbackLabelEn, 'en'),
        valueHe:
          stored?.valueHe ??
          translateMetricText(t, getFixedT, definition.valueKey, definition.fallbackValueHe, 'he'),
        labelHe:
          stored?.labelHe ??
          translateMetricText(t, getFixedT, definition.labelKey, definition.fallbackLabelHe, 'he')
      };
    })
  };
};

export interface HomePageControllerProps {
  i18n: {
    language: string;
    changeLanguage: (lang: string) => void;
    getFixedT?: (lang: string) => TFunction;
  };
  t: TFunction;
  urlLang?: string;
  points: any[];
  categories: any[];
  tableTemplate: any;
  isAuthenticated: boolean;
  startAddPoint: (point: any) => Promise<any>;
  startEditProject: (payload: { project: any }) => Promise<any>;
  startToggleShowCategory: (categoryId: string, visible: boolean) => Promise<any>;
  startEditCategories: (fbCategories: Record<string, any>, categories: any[]) => Promise<any>;
  startAddCategory: (category: any, order: number) => Promise<any>;
  startLogout: () => Promise<void>;
  startEditHomePage: (payload: Partial<HomepageState>) => Promise<HomepageState>;
  startDeleteHomePageImage: (payload: Partial<HomepageState>, publicId: string) => Promise<void>;
  homepage?: HomepageState;
}

export interface HomePageState {
  seo: {
    title: string;
    titleEng: string;
  };
  navigation: any;
  points: any[];
  allowAddPoint: boolean;
  sidebarClickedItemId: string | null;
  selectedProject: any;
  showSelectedProject: boolean;
  table: any[];
  needSave: boolean;
  hideCategoriesEditPanel: boolean;
  editCategoriesModalIsOpen: boolean;
  newCategoryNameModalIsOpen: boolean;
  newCategoryName: string;
  newCategoryNameHebrew: string;
  categories: any[];
  cursor: string;
  lang: string;
  categoryColors: any[];
  openCategories: any[];
  projectOrigin?: any;
  eventId?: string | null;
  newCategoryNameModalAlert?: string;
  heroModalIsOpen: boolean;
  heroSaving: boolean;
  heroDraft: HeroDraft;
}

export const useHomePageController = (props: HomePageControllerProps) => {
  const [state, setState] = useMergeState<HomePageState>({
    seo: {
      title: 'נאוה קיינר-פרסוב',
      titleEng: 'Nava Kainer-Persov'
    },
    points: props.points,
    allowAddPoint: false,
    sidebarClickedItemId: null,
    selectedProject: null,
    showSelectedProject: false,
    table: [],
    needSave: false,
    hideCategoriesEditPanel: true,
    editCategoriesModalIsOpen: false,
    newCategoryNameModalIsOpen: false,
    newCategoryName: '',
    newCategoryNameHebrew: '',
    categories: props.categories,
    cursor: 'default',
    lang: 'en',
    categoryColors: [],
    openCategories: [],
    projectOrigin: null,
    eventId: null,
    newCategoryNameModalAlert: '',
    heroModalIsOpen: false,
    heroSaving: false,
    heroDraft: buildHeroDraft(props.homepage, props.t, props.i18n.getFixedT)
  });

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

  useEffect(() => {
    if (props.urlLang !== undefined && props.i18n.language !== props.urlLang) {
      props.i18n.changeLanguage(props.urlLang);
    }
  }, [props.urlLang, props.i18n]);

  useEffect(() => {
    if (props.categories) {
      const categoryColors = props.categories.map((category, index) => ({
        color: categoryColorsRGB[index],
        colorHex: categoryColorsHEX[index],
        id: category.id
      }));
      setState({ categoryColors });
    }
  }, [props.categories, setState]);

  useEffect(() => {
    if (!isEqual(state.categories, props.categories)) {
      setState({ categories: props.categories });
    }
  }, [props.categories, setState, state.categories]);

  useEffect(() => {
    setState((previous) => ({
      heroDraft: buildHeroDraft(props.homepage, props.t, props.i18n.getFixedT)
    }));
  }, [props.homepage, props.t, props.i18n.getFixedT, props.i18n.language, setState]);

  useEffect(() => {
    if (state.lang !== props.i18n.language) {
      setState({ lang: props.i18n.language });
    }
  }, [props.i18n.language, setState, state.lang]);

  useEffect(() => {
    if (!isEqual(state.points, props.points)) {
      setState({ points: props.points });
    }
  }, [props.points, setState, state.points]);

  useEffect(() => {
    if (
      state.selectedProject &&
      state.selectedProject.extendedContent &&
      state.selectedProject.extendedContent.table
    ) {
      const tableArray: any[] = [];
      const table = state.selectedProject.extendedContent.table;
      for (const key in table) {
        const categoryObject = table[key];
        const category = {
          color: categoryObject.color,
          name: categoryObject.name,
          subcategories: []
        };
        const subcategories = categoryObject.categories;
        for (const subKey in subcategories) {
          const subcategoryObject = subcategories[subKey];
          const subcategory = {
            name: subcategoryObject.name,
            options: []
          };
          const options = subcategoryObject.options;
          for (const optionKey in options) {
            const optionObject = options[optionKey];
            subcategory.options.push(optionObject);
          }
          category.subcategories.push(subcategory);
        }
        tableArray.push(category);
      }
      if (!isEqual(tableArray, state.table)) {
        setState({ table: tableArray });
      }
    }
  }, [setState, state.selectedProject, state.table]);

  const setData = useCallback(
    (event) => {
      if (!state.selectedProject) {
        return;
      }
      const { value, dataset } = event.target;
      const { name, action } = dataset;
      const selectedProject = JSON.parse(JSON.stringify(state.selectedProject));

      switch (action) {
        case 'setString':
          if (name === 'categories') {
            selectedProject[name] = value;
            break;
          }

          if (name === 'tableOptions') {
            selectedProject.extendedContent[name] = value;
            break;
          }

          if (name === 'image') {
            selectedProject.extendedContent[name] = value;
            selectedProject.content = `<img src='${value}' />${selectedProject.extendedContent.content}`;
            selectedProject.contentHebrew = `<img src='${value}' />${selectedProject.extendedContent.contentHebrew}`;
            break;
          }

          if (name === 'title') {
            if (props.i18n.language === 'en') {
              selectedProject[name] = value;
              selectedProject.extendedContent[name] = value;
            } else {
              selectedProject[`${name}Hebrew`] = value;
              selectedProject.extendedContent[`${name}Hebrew`] = value;
            }
            break;
          }

          if (name === 'content') {
            if (props.i18n.language === 'en') {
              selectedProject[name] =
                `<img src='${selectedProject.extendedContent.image}' />${value}`;
              selectedProject.extendedContent[name] = value;
            } else {
              selectedProject[`${name}Hebrew`] =
                `<img src='${selectedProject.extendedContent.image}' />${value}`;
              selectedProject.extendedContent[`${name}Hebrew`] = value;
            }
            break;
          }

          if (props.i18n.language === 'en') {
            selectedProject.extendedContent[name] = value;
          } else {
            selectedProject.extendedContent[`${name}Hebrew`] = value;
          }
          break;
        default:
          break;
      }

      setState({
        selectedProject,
        needSave: true
      });
    },
    [props.i18n.language, setState, state.selectedProject]
  );

  const onUpdateProject = useCallback(() => {
    if (!state.selectedProject) {
      return;
    }
    const project = JSON.parse(JSON.stringify(state.selectedProject));
    props.startEditProject({ project });
    setState({ projectOrigin: project, needSave: false });
  }, [props.startEditProject, setState, state.selectedProject]);

  const uploadWidget = useCallback(
    (event) => {
      const { dataset } = event.target;
      const { id } = dataset;
      const eventId = state.eventId;
      if (!isCloudinaryConfigured()) {
        logMissingCloudinaryConfig();
        return;
      }
      const myUploadWidget = cloudinary.openUploadWidget(
        {
          cloud_name: cloudinaryEnv.cloudName,
          upload_preset: cloudinaryEnv.uploadPreset,
          sources: ['local', 'url', 'image_search', 'facebook', 'dropbox', 'instagram', 'camera'],
          fonts: {
            default: null,
            "'Cute Font', cursive": 'https://fonts.googleapis.com/css?family=Cute+Font',
            "'Gamja Flower', cursive":
              'https://fonts.googleapis.com/css?family=Gamja+Flower|PT+Serif'
          }
        },
        (error, result) => {
          if (error) {
            console.log(error);
          }
          if (result.event === 'success') {
            const image = {
              publicId: result.info.public_id,
              src: result.info.secure_url,
              width: result.info.width,
              height: result.info.height,
              alt: ''
            };

            const syntheticEvent = {
              target: {
                value: image.src,
                dataset: {
                  action: 'setString',
                  name: 'image'
                }
              }
            } as any;

            setData(syntheticEvent);
            myUploadWidget.close();
          }
        }
      );
      myUploadWidget.open();
  }, [
    logMissingCloudinaryConfig,
    setData,
    state.eventId,
    cloudinaryEnv.cloudName,
    cloudinaryEnv.uploadPreset
  ]);

  const addPoint = useCallback(
    (point) => {
      setState({
        allowAddPoint: false,
        cursor: 'default'
      });
      return props.startAddPoint(point).then((res) => res);
    },
    [props.startAddPoint, setState]
  );

  const allowAddPoint = useCallback(() => {
    setState({
      allowAddPoint: !state.allowAddPoint,
      cursor: state.cursor === 'crosshair' ? 'default' : 'crosshair'
    });
  }, [setState, state.allowAddPoint, state.cursor]);

  const handleSideBarClick = useCallback(
    (event) => {
      setState({ sidebarClickedItemId: event.target.dataset.id });
    },
    [setState]
  );

  const handleExpandProject = useCallback(
    (selectedProject) => {
      setState({
        selectedProject,
        showSelectedProject: true
      });
    },
    [setState]
  );

  const hideProject = useCallback(() => {
    setState({
      selectedProject: null,
      showSelectedProject: false
    });
  }, [setState]);

  const setSelectedProject = useCallback(
    (selectedProject) => {
      setState({
        selectedProject,
        showSelectedProject: Boolean(selectedProject)
      });
    },
    [setState]
  );

  const startEditCategory = useCallback(() => {
    if (state.hideCategoriesEditPanel) {
      hideProject();
    }
    setState({
      editCategoriesModalIsOpen: !state.editCategoriesModalIsOpen,
      newCategoryNameModalIsOpen: false
    });
  }, [hideProject, setState, state.editCategoriesModalIsOpen, state.hideCategoriesEditPanel]);

  const toggleShowCategory = useCallback(
    (event) => {
      const categoryId = event.target.dataset.id;
      let visible = null;
      if (event.target.dataset.visible === 'true') {
        visible = false;
      } else {
        visible = true;
      }
      props.startToggleShowCategory(categoryId, visible).then(() => {
        setState({ categories: props.categories });
      });
    },
    [props.categories, props.startToggleShowCategory, setState]
  );

  const onCategoryOrderChange = useCallback(
    (event) => {
      const categories = state.categories.map((category) => ({ ...category }));
      const categoryId = event.target.dataset.id;
      const categoryIndex = categories.findIndex((category) => category.id === categoryId);
      if (categoryIndex === -1) {
        return;
      }
      let newOrder = Number(event.target.value);
      if (newOrder > categories.length) newOrder = categories.length;
      if (newOrder < 1) newOrder = 1;
      categories[categoryIndex].order = Number(newOrder);
      setState({ categories });
    },
    [setState, state.categories]
  );

  const onCategoryOrderBlur = useCallback(
    (event) => {
      const categories = state.categories.map((category) => ({ ...category }));
      let newOrder = Number(event.target.value);
      if (newOrder > categories.length) {
        newOrder = categories.length;
      }
      if (newOrder < 1) {
        newOrder = 1;
      }
      const oldOrder = Number(event.target.dataset.index) + 1;
      const id = event.target.dataset.id;
      if (newOrder > oldOrder) {
        for (let i = 0; i < categories.length; i++) {
          if (id !== categories[i].id) {
            if (categories[i].order <= newOrder && categories[i].order > oldOrder) {
              categories[i].order = categories[i].order - 1;
            }
          }
        }
      } else if (newOrder < oldOrder) {
        for (let i = 0; i < categories.length; i++) {
          if (id !== categories[i].id) {
            if (categories[i].order < oldOrder && categories[i].order >= newOrder) {
              categories[i].order = Number(categories[i].order) + 1;
            }
          }
        }
      }
      categories.sort((a, b) => (a.order > b.order ? 1 : -1));
      setState({ categories });
    },
    [setState, state.categories]
  );

  const onCategoryOrderKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onCategoryOrderBlur(event);
      }
    },
    [onCategoryOrderBlur]
  );

  const onCategoryNameChange = useCallback(
    (event) => {
      const index = Number(event.target.dataset.index);
      const lang = event.target.dataset.lang;
      const categoryNewName = event.target.value;
      const categories = state.categories.map((category) => ({ ...category }));
      if (!categories[index]) {
        return;
      }
      if (lang === 'en') {
        categories[index].name = categoryNewName;
      } else {
        categories[index].nameHebrew = categoryNewName;
      }
      setState({ categories });
    },
    [setState, state.categories]
  );

  const onCategoryNameBlur = useCallback(
    (event) => {
      let nameFlag = false;
      let oldName = '';
      const categories = state.categories.map((category) => ({ ...category }));
      const categoryNewName = event.target.value;
      const categoryId = event.target.dataset.id;
      const lang = event.target.dataset.lang;

      categories.forEach((category) => {
        if (category.id === categoryId) {
          oldName = lang === 'en' ? category.name : category.nameHebrew;
        }
      });

      categories.forEach((category) => {
        if (lang === 'en') {
          if (category.name === categoryNewName && category.id !== categoryId) {
            nameFlag = true;
          }
        } else {
          if (category.nameHebrew === categoryNewName && category.id !== categoryId) {
            nameFlag = true;
          }
        }
      });

      if (nameFlag === true) {
        alert('שם קטגוריה קיים במערכת');
        event.target.value = oldName;
        categories.forEach((category, index) => {
          if (category.id === categoryId) {
            if (lang === 'en') {
              categories[index].name = oldName;
            } else {
              categories[index].nameHebrew = oldName;
            }
          }
        });
        setState({ categories });
      }
    },
    [setState, state.categories]
  );

  const updateCategories = useCallback(() => {
    const categories = state.categories.map((category) => ({ ...category }));
    const fbCategories: Record<string, any> = {};
    categories.forEach((category) => {
      fbCategories[category.id] = category;
    });
    props.startEditCategories(fbCategories, categories);
    setState({ categoriesOrigin: categories });
  }, [props.startEditCategories, setState, state.categories]);

  const addNewCategory = useCallback(() => {
    let nameFlag = false;
    props.categories &&
      props.categories.forEach((category) => {
        if (category.name === state.newCategoryName) {
          nameFlag = true;
        }
      });

    if (nameFlag === true) {
      setState({ newCategoryNameModalAlert: 'שם קטגוריה קיים במערכת' });
    } else if (state.newCategoryName === '') {
      setState({ newCategoryNameModalAlert: 'שם קטגוריה חייב לכלול אות אחת לפחות' });
    } else {
      const name = state.newCategoryName;
      const nameHebrew = state.newCategoryName;
      const order = props.categories ? props.categories.length + 1 : 1;
      const category = {
        name,
        nameHebrew,
        order,
        isVisible: false,
        type: 'category'
      };
      props.startAddCategory(category, order).then(() => {
        setState({
          newCategoryNameModalIsOpen: false,
          newCategoryName: '',
          newCategoryNameHebrew: '',
          newCategoryNameModalAlert: ''
        });
      });
    }
  }, [props.categories, props.startAddCategory, setState, state.newCategoryName]);

  const onNewCategoryNameChange = useCallback(
    (event) => {
      const newCategoryName = event.target.value;
      setState({ newCategoryName });
    },
    [setState]
  );

  const onToggleNewCategoryName = useCallback(() => {
    if (state.hideCategoriesEditPanel) {
      hideProject();
    }
    setState({
      newCategoryNameModalIsOpen: !state.newCategoryNameModalIsOpen,
      editCategoriesModalIsOpen: false
    });
  }, [hideProject, setState, state.hideCategoriesEditPanel, state.newCategoryNameModalIsOpen]);

  const onToggleEditCategories = useCallback(() => {
    if (state.hideCategoriesEditPanel) {
      hideProject();
    }
    setState({
      editCategoriesModalIsOpen: !state.editCategoriesModalIsOpen,
      newCategoryNameModalIsOpen: false
    });
  }, [hideProject, setState, state.editCategoriesModalIsOpen, state.hideCategoriesEditPanel]);

  const setOpenCategories = useCallback(
    (openCategories) => {
      setState({ openCategories });
    },
    [setState]
  );

  const openHeroModal = useCallback(() => {
    setState((previous) => ({
      heroModalIsOpen: true,
      heroSaving: false,
      heroDraft: buildHeroDraft(props.homepage, props.t, props.i18n.getFixedT)
    }));
  }, [props.homepage, props.i18n.getFixedT, props.t, setState]);

  const closeHeroModal = useCallback(() => {
    setState({ heroModalIsOpen: false });
  }, [setState]);

  const onHeroMetricChange = useCallback(
    (metricId: string, field: keyof HeroMetricDraft, nextValue: string) => {
      setState((previous) => ({
        heroDraft: {
          ...previous.heroDraft,
          metrics: previous.heroDraft.metrics.map((metric) =>
            metric.id === metricId ? { ...metric, [field]: nextValue } : metric
          )
        }
      }));
    },
    [setState]
  );

  const uploadHeroPortrait = useCallback(() => {
    if (!isCloudinaryConfigured()) {
      logMissingCloudinaryConfig();
      return;
    }
    const widget = cloudinary.openUploadWidget(
      {
        cloud_name: cloudinaryEnv.cloudName,
        upload_preset: cloudinaryEnv.uploadPreset,
        sources: ['local', 'url', 'image_search', 'facebook', 'dropbox', 'instagram', 'camera']
      },
      (error: unknown, result: any) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Hero upload failed', error);
        }
        if (result?.event === 'success') {
          const url = result.info?.secure_url as string | undefined;
          const publicId = result.info?.public_id as string | undefined;
          if (url) {
            setState((previous) => ({
              heroDraft: {
                ...previous.heroDraft,
                portraitUrl: url,
                portraitPublicId: publicId
              }
            }));
          }
        }
      }
    );
    widget.open();
  }, [
    logMissingCloudinaryConfig,
    setState,
    cloudinaryEnv.cloudName,
    cloudinaryEnv.uploadPreset
  ]);

  const clearHeroPortrait = useCallback(() => {
    setState((previous) => ({
      heroDraft: {
        ...previous.heroDraft,
        portraitUrl: '',
        portraitPublicId: ''
      }
    }));
  }, [setState]);

  const saveHeroSettings = useCallback(async () => {
    const heroPayload = {
      portraitUrl: state.heroDraft.portraitUrl,
      portraitPublicId: state.heroDraft.portraitPublicId,
      metrics: state.heroDraft.metrics.map((metric) => ({
        id: metric.id,
        value: metric.value,
        label: metric.label,
        valueHe: metric.valueHe,
        labelHe: metric.labelHe
      }))
    };

    setState({ heroSaving: true });
    try {
      const previousPublicId =
        typeof props.homepage?.hero?.portraitPublicId === 'string'
          ? props.homepage?.hero?.portraitPublicId
          : '';

      if (previousPublicId && previousPublicId !== heroPayload.portraitPublicId) {
        await props.startDeleteHomePageImage({ hero: heroPayload }, previousPublicId);
      } else {
        await props.startEditHomePage({ hero: heroPayload });
      }
      setState({ heroSaving: false, heroModalIsOpen: false });
    } catch (error) {
      setState({ heroSaving: false });
      throw error;
    }
  }, [
    props.homepage,
    props.startDeleteHomePageImage,
    props.startEditHomePage,
    setState,
    state.heroDraft
  ]);

  return {
    state,
    viewportWidth,
    setData,
    onUpdateProject,
    uploadWidget,
    addPoint,
    allowAddPoint,
    handleSideBarClick,
    handleExpandProject,
    hideProject,
    setSelectedProject,
    startEditCategory,
    toggleShowCategory,
    onCategoryOrderChange,
    onCategoryOrderBlur,
    onCategoryOrderKeyPress,
    onCategoryNameChange,
    onCategoryNameBlur,
    updateCategories,
    addNewCategory,
    onNewCategoryNameChange,
    onToggleNewCategoryName,
    onToggleEditCategories,
    setOpenCategories,
    heroModalIsOpen: state.heroModalIsOpen,
    heroSaving: state.heroSaving,
    heroDraft: state.heroDraft,
    openHeroModal,
    closeHeroModal,
    uploadHeroPortrait,
    clearHeroPortrait,
    saveHeroSettings,
    onHeroMetricChange
  };
};

export type HomePageController = ReturnType<typeof useHomePageController>;
