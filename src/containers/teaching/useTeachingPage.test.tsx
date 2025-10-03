import React, { forwardRef, useImperativeHandle } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Provider } from 'react-redux';

import { createAppStore, type AppStore } from '../../store/configureStore';
import { useTeachingPage, type UseTeachingPageResult } from './useTeachingPage';

jest.mock('../../firebase/firebase');

type MockFirebaseState = {
  website?: {
    teachingpage?: {
      teachings?: Record<string, unknown>;
    };
  };
};

const firebaseModule = jest.requireMock('../../firebase/firebase') as {
  __resetMockFirebase: (initial?: Record<string, unknown>) => void;
  __getMockFirebaseState: () => MockFirebaseState;
};

const { __resetMockFirebase: resetMockFirebase, __getMockFirebaseState: getMockFirebaseState } =
  firebaseModule;

const createI18nMock = (language = 'en') => ({
  language,
  changeLanguage: jest.fn(async () => undefined)
});

type HookHarnessProps = {
  urlLang?: string;
  i18n: { language: string; changeLanguage(lang: string): Promise<void> | void };
};

const HookHarness = forwardRef<UseTeachingPageResult | null, HookHarnessProps>(
  ({ urlLang, i18n }, ref) => {
    const teaching = useTeachingPage({ urlLang, i18n });
    useImperativeHandle(ref, () => teaching, [teaching]);
    return null;
  }
);

HookHarness.displayName = 'HookHarness';

const renderHookHarness = (store: AppStore, props?: Partial<HookHarnessProps>) => {
  const ref = React.createRef<UseTeachingPageResult | null>();
  render(
    <Provider store={store}>
      <HookHarness ref={ref} urlLang={props?.urlLang} i18n={props?.i18n ?? createI18nMock()} />
    </Provider>
  );
  return ref;
};

const waitForView = async (
  ref: React.RefObject<UseTeachingPageResult | null>
): Promise<() => UseTeachingPageResult> => {
  await waitFor(() => expect(ref.current).not.toBeNull());
  return () => {
    const { current } = ref;
    if (!current) {
      throw new Error('Teaching hook not ready');
    }
    return current;
  };
};

describe('useTeachingPage validation', () => {
  beforeEach(() => {
    resetMockFirebase();
  });

  it('prevents saving a teach without required content', async () => {
    const store = createAppStore();
    const utils = renderHookHarness(store);
    const getView = await waitForView(utils);

    act(() => {
      getView().openTeachEditor();
    });

    await waitFor(() => expect(getView().editModalOpen).toBe(true));

    await act(() => getView().saveDraftTeach());

    await waitFor(() =>
      expect(getView().draftError).toBe(
        'Details and description are required in at least one language.'
      )
    );

    const storedTeachings = store.getState().teachingpage.teachings;
    expect(storedTeachings).toHaveLength(0);

    const firebaseState = getMockFirebaseState();
    expect(firebaseState.website).toBeUndefined();
  });

  it('saves a new teach when validation passes', async () => {
    const store = createAppStore();
    const utils = renderHookHarness(store);
    const getView = await waitForView(utils);

    act(() => {
      getView().openTeachEditor();
    });

    await waitFor(() => expect(getView().editModalOpen).toBe(true));

    await act(() => getView().saveDraftTeach());

    await waitFor(() =>
      expect(getView().draftError).toBe(
        'Details and description are required in at least one language.'
      )
    );

    act(() => {
      getView().updateDraftTeach('details', '<p>Workshop details</p>');
    });

    await waitFor(() => expect(getView().draftError).toBeNull());

    act(() => {
      getView().updateDraftTeach('description', '<p>Workshop description</p>');
    });

    await act(() => getView().saveDraftTeach());

    await waitFor(() => expect(getView().draftError).toBeNull());
    await waitFor(() => expect(getView().editModalOpen).toBe(false));
    await waitFor(() => expect(getView().teachings.length).toBe(1));

    const [firstTeach] = getView().teachings;
    expect(firstTeach?.details).toContain('Workshop');
    expect(firstTeach?.description).toContain('Workshop');

    const firebaseState = getMockFirebaseState();
    const teaches = firebaseState.website?.teachingpage?.teachings ?? {};
    expect(Object.keys(teaches)).toHaveLength(1);
  });

  it('allows saving when only Hebrew fields have content', async () => {
    const store = createAppStore();
    const utils = renderHookHarness(store, { urlLang: 'he', i18n: createI18nMock('he') });
    const getView = await waitForView(utils);

    act(() => {
      getView().openTeachEditor();
    });

    act(() => {
      getView().updateDraftTeach('detailsHebrew', '<p>תיאור בעברית</p>');
      getView().updateDraftTeach('descriptionHebrew', '<p>עוד מידע</p>');
    });

    await act(() => getView().saveDraftTeach());

    await waitFor(() => expect(getView().draftError).toBeNull());
    await waitFor(() => expect(getView().editModalOpen).toBe(false));
    await waitFor(() => expect(getView().teachings.length).toBe(1));

    const [savedTeach] = getView().teachings;
    expect(savedTeach?.detailsHebrew).toContain('תיאור');
    expect(savedTeach?.descriptionHebrew).toContain('עוד מידע');

    const firebaseState = getMockFirebaseState();
    const teaches = firebaseState.website?.teachingpage?.teachings ?? {};
    expect(Object.keys(teaches)).toHaveLength(1);
  });

  it('blocks saving when rich text only contains whitespace', async () => {
    const store = createAppStore();
    const utils = renderHookHarness(store);
    const getView = await waitForView(utils);

    act(() => {
      getView().openTeachEditor();
    });

    act(() => {
      getView().updateDraftTeach('details', '<p>&nbsp;</p>');
      getView().updateDraftTeach('description', '<div>\n\t</div>');
    });

    await act(() => getView().saveDraftTeach());

    await waitFor(() =>
      expect(getView().draftError).toBe(
        'Details and description are required in at least one language.'
      )
    );

    const firebaseState = getMockFirebaseState();
    expect(firebaseState.website).toBeUndefined();
  });
});
