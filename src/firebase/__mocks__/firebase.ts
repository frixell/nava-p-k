import { jest } from '@jest/globals';

import type { Database, DatabaseReference, DatabaseSnapshot } from '../types';

type Primitive = string | number | boolean | null | undefined;

type JsonValue = Primitive | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

let dbState: JsonObject = {};
let keyCounter = 0;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const clone = <T>(value: T): T => {
  if (value === undefined) {
    return value;
  }
  return JSON.parse(JSON.stringify(value)) as T;
};

const normalizePath = (path: string): string[] => path.split('/').filter(Boolean);

const getValueAtPath = (path: string): JsonValue => {
  const segments = normalizePath(path);
  let current: JsonValue = dbState;
  for (const segment of segments) {
    if (!isObject(current) || !(segment in current)) {
      return null;
    }
    current = (current as JsonObject)[segment];
  }
  return clone(current);
};

const ensureParent = (path: string, create = false): { parent: JsonObject; key: string | null } => {
  const segments = normalizePath(path);
  if (segments.length === 0) {
    return { parent: dbState, key: null };
  }

  let parent: JsonObject = dbState;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (!isObject(parent[segment])) {
      if (!create) {
        parent[segment] = {};
      } else {
        parent[segment] = {};
      }
    }
    parent = parent[segment] as JsonObject;
  }

  return { parent, key: segments[segments.length - 1] ?? null };
};

const setValueAtPath = (path: string, value: unknown): void => {
  const { parent, key } = ensureParent(path, true);
  if (key === null) {
    dbState = isObject(value) ? (clone(value) as JsonObject) : {};
    return;
  }

  if (value === null || value === undefined) {
    delete parent[key];
  } else {
    parent[key] = clone(value) as JsonValue;
  }
};

const mergeValueAtPath = (path: string, value: unknown): void => {
  if (!isObject(value)) {
    setValueAtPath(path, value);
    return;
  }

  const { parent, key } = ensureParent(path, true);

  if (key === null) {
    dbState = {
      ...dbState,
      ...clone(value)
    } as JsonObject;
    return;
  }

  const existing = isObject(parent[key]) ? (parent[key] as JsonObject) : {};
  parent[key] = {
    ...existing,
    ...clone(value)
  } as JsonValue;
};

const createSnapshot = (path: string): DatabaseSnapshot => ({
  val: () => getValueAtPath(path)
});

const createRef = <T = JsonValue>(path: string): DatabaseReference<T> =>
  ({
    once: jest.fn(async () => createSnapshot(path) as DatabaseSnapshot<T>),
    update: jest.fn(async (value: unknown) => {
      mergeValueAtPath(path, value);
    }),
    push: jest.fn(async (value: unknown) => {
      const key = `mock-${++keyCounter}`;
      mergeValueAtPath(path, { [key]: value });
      return { key };
    }),
    remove: jest.fn(async () => {
      setValueAtPath(path, null);
    }),
    set: jest.fn(async (value: unknown) => {
      setValueAtPath(path, value);
    }),
    child: jest.fn((segment: string) => createRef(`${path}/${segment}`))
  }) as unknown as DatabaseReference<T>;

const database: Database = {
  ref: (path) => createRef(path ?? '')
};

const firebaseInstance = {
  apps: [] as unknown[],
  initializeApp: jest.fn(() => firebaseInstance),
  app: jest.fn(() => firebaseInstance),
  auth: () => ({
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn()
  }),
  database: () => database
};

export const googleAuthProvider = {};

export const __resetMockFirebase = (initial: JsonObject = {}) => {
  dbState = clone(initial) as JsonObject;
  keyCounter = 0;
};

export const __getMockFirebaseState = (): JsonObject => clone(dbState) as JsonObject;

export const firebase = firebaseInstance;

export default database;
