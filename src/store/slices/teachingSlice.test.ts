import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
  addTeach,
  removeTeach,
  replaceTeachings,
  setTeachingPage,
  setTeachingSeo,
  startAddTeach,
  startDeleteTeach,
  startEditTeachingPageSeo,
  startSetTeachingPage,
  startShowTeach,
  startUpdateTeach,
  startUpdateTeachImage,
  startUpdateTeachings,
  updateTeach
} from './teachingSlice';
import { buildTeach, buildSeo, buildTeachingPageState } from '../../tests/fixtures/teaching';

jest.mock('../../firebase/firebase');
jest.mock('../../services/imageService', () => ({
  deleteImage: jest.fn(async () => undefined)
}));

type MockFirebaseState = {
  website?: {
    teachingpage?: {
      teachings?: Record<string, Record<string, unknown>>;
      seo?: Record<string, unknown>;
    };
  };
  serverSeo?: {
    teaching?: {
      seo?: Record<string, unknown>;
    };
  };
};

const firebaseModule = jest.requireMock('../../firebase/firebase') as {
  __resetMockFirebase: (initial?: Record<string, unknown>) => void;
  __getMockFirebaseState: () => MockFirebaseState;
};

const { __resetMockFirebase, __getMockFirebaseState } = firebaseModule;

const { deleteImage } = jest.requireMock('../../services/imageService') as {
  deleteImage: jest.Mock;
};

describe('teachingSlice thunks', () => {
  beforeEach(() => {
    __resetMockFirebase();
    deleteImage.mockClear();
  });

  it('loads teachings and seo from firebase on startSetTeachingPage', async () => {
    __resetMockFirebase(
      buildTeachingPageState(
        {
          'teach-1': buildTeach({
            id: 'teach-1',
            details: 'Detail',
            description: 'Description'
          })
        },
        buildSeo({ title: 'Teaching', description: 'Learning', keyWords: 'teach' })
      )
    );

    const dispatch = jest.fn();

    await startSetTeachingPage()(dispatch as any, jest.fn() as any, undefined as never);

    expect(dispatch).toHaveBeenCalledWith(
      setTeachingPage({
        teachings: [
          expect.objectContaining({ id: 'teach-1', details: 'Detail', description: 'Description' })
        ],
        seo: expect.objectContaining({ title: 'Teaching', description: 'Learning', keyWords: 'teach' })
      })
    );
  });

  it('pushes a new teach to firebase and dispatches addTeach', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({ teachingpage: { teachings: [] } }));

    await startAddTeach({ details: 'New detail', description: 'New description' }, 5)(
      dispatch as any,
      getState as any,
      undefined as never
    );

    expect(dispatch).toHaveBeenCalledWith(
      addTeach(
        expect.objectContaining({
          details: 'New detail',
          description: 'New description',
          order: 5
        })
      )
    );

    const state = __getMockFirebaseState();
    const teaches = state.website?.teachingpage?.teachings ?? {};
    const storedTeach = Object.values(teaches)[0];
    expect(storedTeach).toEqual(
      expect.objectContaining({ details: 'New detail', description: 'New description', order: 5 })
    );
  });

  it('removes a teach and triggers image deletion on startDeleteTeach', async () => {
    const existingTeach = buildTeach({
      id: 'teach-1',
      publicId: 'public-1'
    });

    __resetMockFirebase(buildTeachingPageState({ 'teach-1': existingTeach }));

    const dispatch = jest.fn();

    await startDeleteTeach(existingTeach as any)(
      dispatch as any,
      jest.fn() as any,
      undefined as never
    );

    expect(deleteImage).toHaveBeenCalledWith('public-1');
    expect(dispatch).toHaveBeenCalledWith(removeTeach('teach-1'));

    const state = __getMockFirebaseState();
    const teaches = state.website?.teachingpage?.teachings ?? {};
    expect(teaches).toEqual({});
  });

  it('updates an existing teach via startUpdateTeach', async () => {
    __resetMockFirebase(
      buildTeachingPageState({
        'teach-1': buildTeach({
          id: 'teach-1',
          details: 'Detail',
          description: 'Description'
        })
      })
    );

    const dispatch = jest.fn();

    await startUpdateTeach({ id: 'teach-1', details: 'Updated detail' })(
      dispatch as any,
      jest.fn() as any,
      undefined as never
    );

    expect(dispatch).toHaveBeenCalledWith(
      updateTeach(expect.objectContaining({ id: 'teach-1', details: 'Updated detail' }))
    );

    const state = __getMockFirebaseState();
    const teaches = state.website?.teachingpage?.teachings ?? {};
    expect(teaches['teach-1']).toEqual(
      expect.objectContaining({ details: 'Updated detail', description: '' })
    );
  });

  it('commits teach ordering with startUpdateTeachings', async () => {
    __resetMockFirebase(
      buildTeachingPageState({
        'teach-1': buildTeach({ id: 'teach-1', order: 2 }),
        'teach-2': buildTeach({ id: 'teach-2', order: 1 })
      })
    );

    const dispatch = jest.fn();

    const nextTeachings = [
      { id: 'teach-1', order: 1 },
      { id: 'teach-2', order: 2 }
    ];
    const payload = {
      'teach-1': nextTeachings[0],
      'teach-2': nextTeachings[1]
    };

    await startUpdateTeachings(payload, nextTeachings as any)(
      dispatch as any,
      jest.fn() as any,
      undefined as never
    );

    expect(dispatch).toHaveBeenCalledWith(replaceTeachings(nextTeachings as any));

    const state = __getMockFirebaseState();
    const teaches = state.website?.teachingpage?.teachings ?? {};
    expect(teaches['teach-1']).toEqual(expect.objectContaining({ order: 1 }));
    expect(teaches['teach-2']).toEqual(expect.objectContaining({ order: 2 }));
  });

  it('updates teaching SEO in both server and website locations', async () => {
    __resetMockFirebase({
      serverSeo: {
        teaching: { seo: { title: 'Old' } }
      },
      ...buildTeachingPageState({}, buildSeo({ title: 'Old' }))
    });

    const dispatch = jest.fn();

    await startEditTeachingPageSeo({ title: 'New', description: 'Desc', keyWords: 'kw' })(
      dispatch as any,
      jest.fn() as any,
      undefined as never
    );

    expect(dispatch).toHaveBeenCalledWith(
      setTeachingSeo(expect.objectContaining({ title: 'New', description: 'Desc', keyWords: 'kw' }))
    );

    const state = __getMockFirebaseState();
    expect(state.serverSeo?.teaching?.seo).toEqual(
      expect.objectContaining({ title: 'New', description: 'Desc', keyWords: 'kw' })
    );
    expect(state.website?.teachingpage?.seo).toEqual(
      expect.objectContaining({ title: 'New', description: 'Desc', keyWords: 'kw' })
    );
  });

  it('updates an image and removes the previous public id on startUpdateTeachImage', async () => {
    const existingTeach = buildTeach({
      id: 'teach-1',
      image: { publicId: 'old-public', src: 'old-src', width: 100, height: 100 }
    });

    __resetMockFirebase(buildTeachingPageState({ 'teach-1': existingTeach }));

    const dispatch = jest.fn();

    await startUpdateTeachImage(
      { id: 'teach-1', image: { publicId: 'new-public', src: 'new-src', width: 200, height: 200 } },
      'old-public'
    )(
      dispatch as any,
      jest.fn() as any,
      undefined as never
    );

    expect(deleteImage).toHaveBeenCalledWith('old-public');
    expect(dispatch).toHaveBeenCalledWith(
      updateTeach(
        expect.objectContaining({
          id: 'teach-1',
          image: expect.objectContaining({ publicId: 'new-public', src: 'new-src' })
        })
      )
    );

    const state = __getMockFirebaseState();
    const teaches = state.website?.teachingpage?.teachings ?? {};
    expect(teaches['teach-1']).toEqual(
      expect.objectContaining({
        image: expect.objectContaining({ publicId: 'new-public', src: 'new-src', width: 200, height: 200 })
      })
    );
  });

  it('toggles visibility via startShowTeach', async () => {
    const existingTeach = buildTeach({ id: 'teach-1', visible: false });

    __resetMockFirebase(buildTeachingPageState({ 'teach-1': existingTeach }));

    const dispatch = jest.fn();

    await startShowTeach({ ...existingTeach, visible: true })(
      dispatch as any,
      jest.fn() as any,
      undefined as never
    );

    expect(dispatch).toHaveBeenCalledWith(
      updateTeach(expect.objectContaining({ id: 'teach-1', visible: true }))
    );

    const state = __getMockFirebaseState();
    const teaches = state.website?.teachingpage?.teachings ?? {};
    expect(teaches['teach-1']).toEqual(expect.objectContaining({ visible: true }));
  });
});
