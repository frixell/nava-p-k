import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
  startAddTeach,
  startDeleteTeach,
  startSetTeachingPage,
  setTeachingPage,
  removeTeach,
  addTeach
} from './teachingSlice';

jest.mock('../../firebase/firebase');
jest.mock('../../services/imageService', () => ({
  deleteImage: jest.fn(async () => undefined)
}));

const firebaseModule = jest.requireMock('../../firebase/firebase') as {
  __resetMockFirebase: (initial?: Record<string, unknown>) => void;
  __getMockFirebaseState: () => Record<string, unknown>;
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
    __resetMockFirebase({
      website: {
        teachingpage: {
          teachings: {
            'teach-1': {
              id: 'teach-1',
              details: 'Detail',
              description: 'Description'
            }
          },
          seo: {
            title: 'Teaching',
            description: 'Learning',
            keyWords: 'teach'
          }
        }
      }
    });

    const dispatch = jest.fn();

    await startSetTeachingPage()(dispatch as any);

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
      getState as any
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

    const state = __getMockFirebaseState() as {
      website?: { teachingpage?: { teachings?: Record<string, any> } };
    };
    const teaches = state.website?.teachingpage?.teachings;
    expect(teaches).toBeTruthy();
    const storedTeach = teaches ? Object.values(teaches)[0] : undefined;
    expect(storedTeach).toEqual(
      expect.objectContaining({ details: 'New detail', description: 'New description', order: 5 })
    );
  });

  it('removes a teach and triggers image deletion on startDeleteTeach', async () => {
    const existingTeach = {
      id: 'teach-1',
      details: 'Detail',
      description: 'Description',
      publicId: 'public-1'
    };

    __resetMockFirebase({
      website: {
        teachingpage: {
          teachings: {
            'teach-1': existingTeach
          }
        }
      }
    });

    const dispatch = jest.fn();

    await startDeleteTeach(existingTeach as any)(dispatch as any);

    expect(deleteImage).toHaveBeenCalledWith('public-1');
    expect(dispatch).toHaveBeenCalledWith(removeTeach('teach-1'));

    const state = __getMockFirebaseState() as {
      website?: { teachingpage?: { teachings?: Record<string, any> } };
    };
    const teaches = state.website?.teachingpage?.teachings;
    expect(teaches).toEqual({});
  });
});
