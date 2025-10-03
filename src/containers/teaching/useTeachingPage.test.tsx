import React, { forwardRef, useImperativeHandle } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Provider } from 'react-redux';

import createAppStore, { AppStore } from '../../store/configureStore';
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

const { __resetMockFirebase, __getMockFirebaseState } = firebaseModule;

const createI18nMock = (language = 'en') => ({
    language,
    changeLanguage: jest.fn(async () => undefined)
});

type HookHarnessProps = {
    urlLang?: string;
    i18n: { language: string; changeLanguage(lang: string): Promise<void> | void };
};

const HookHarness = forwardRef<UseTeachingPageResult | null, HookHarnessProps>(({ urlLang, i18n }, ref) => {
    const teaching = useTeachingPage({ urlLang, i18n });
    useImperativeHandle(ref, () => teaching, [teaching]);
    return null;
});

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

describe('useTeachingPage validation', () => {
    beforeEach(() => {
        __resetMockFirebase();
    });

    it('prevents saving a teach without required content', async () => {
        const store = createAppStore();
        const hookRef = renderHookHarness(store);

        await waitFor(() => expect(hookRef.current).not.toBeNull());

        await act(async () => {
            hookRef.current?.openTeachEditor();
        });

        await waitFor(() => expect(hookRef.current?.editModalOpen).toBe(true));

        await act(async () => {
            await hookRef.current?.saveDraftTeach();
        });

        await waitFor(() =>
            expect(hookRef.current?.draftError).toBe(
                'Details and description are required in at least one language.'
            )
        );

        const storedTeachings = store.getState().teachingpage.teachings;
        expect(storedTeachings).toHaveLength(0);

        const firebaseState = __getMockFirebaseState();
        expect(firebaseState.website).toBeUndefined();
    });

    it('saves a new teach when validation passes', async () => {
        const store = createAppStore();
        const hookRef = renderHookHarness(store);

        await waitFor(() => expect(hookRef.current).not.toBeNull());

        await act(async () => {
            hookRef.current?.openTeachEditor();
        });

        await waitFor(() => expect(hookRef.current?.editModalOpen).toBe(true));

        await act(async () => {
            await hookRef.current?.saveDraftTeach();
        });

        await waitFor(() =>
            expect(hookRef.current?.draftError).toBe(
                'Details and description are required in at least one language.'
            )
        );

        await act(() => {
            hookRef.current?.updateDraftTeach('details', '<p>Workshop details</p>');
        });

        await waitFor(() => expect(hookRef.current?.draftError).toBeNull());

        await act(() => {
            hookRef.current?.updateDraftTeach('description', '<p>Workshop description</p>');
        });

        await act(async () => {
            await hookRef.current?.saveDraftTeach();
        });

        await waitFor(() => expect(hookRef.current?.draftError).toBeNull());
        await waitFor(() => expect(hookRef.current?.editModalOpen).toBe(false));
        await waitFor(() => expect(hookRef.current?.teachings.length).toBe(1));

        const [firstTeach] = hookRef.current?.teachings ?? [];
        expect(firstTeach?.details).toContain('Workshop');
        expect(firstTeach?.description).toContain('Workshop');

        const firebaseState = __getMockFirebaseState();
        const teaches = firebaseState.website?.teachingpage?.teachings ?? {};
        expect(Object.keys(teaches)).toHaveLength(1);
    });

    it('allows saving when only Hebrew fields have content', async () => {
        const store = createAppStore();
        const hookRef = renderHookHarness(store, { urlLang: 'he', i18n: createI18nMock('he') });

        await waitFor(() => expect(hookRef.current).not.toBeNull());

        await act(async () => {
            hookRef.current?.openTeachEditor();
        });

        await act(() => {
            hookRef.current?.updateDraftTeach('detailsHebrew', '<p>תיאור בעברית</p>');
            hookRef.current?.updateDraftTeach('descriptionHebrew', '<p>עוד מידע</p>');
        });

        await act(async () => {
            await hookRef.current?.saveDraftTeach();
        });

        await waitFor(() => expect(hookRef.current?.draftError).toBeNull());
        await waitFor(() => expect(hookRef.current?.editModalOpen).toBe(false));
        await waitFor(() => expect(hookRef.current?.teachings.length).toBe(1));

        const [savedTeach] = hookRef.current?.teachings ?? [];
        expect(savedTeach?.detailsHebrew).toContain('תיאור');
        expect(savedTeach?.descriptionHebrew).toContain('עוד מידע');

        const firebaseState = __getMockFirebaseState();
        const teaches = firebaseState.website?.teachingpage?.teachings ?? {};
        expect(Object.keys(teaches)).toHaveLength(1);
    });

    it('blocks saving when rich text only contains whitespace', async () => {
        const store = createAppStore();
        const hookRef = renderHookHarness(store);

        await waitFor(() => expect(hookRef.current).not.toBeNull());

        await act(async () => {
            hookRef.current?.openTeachEditor();
        });

        await act(() => {
            hookRef.current?.updateDraftTeach('details', '<p>&nbsp;</p>');
            hookRef.current?.updateDraftTeach('description', '<div>\n\t</div>');
        });

        await act(async () => {
            await hookRef.current?.saveDraftTeach();
        });

        await waitFor(() =>
            expect(hookRef.current?.draftError).toBe(
                'Details and description are required in at least one language.'
            )
        );

        const firebaseState = __getMockFirebaseState();
        expect(firebaseState.website).toBeUndefined();
    });
});
