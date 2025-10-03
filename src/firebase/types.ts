export interface DatabaseSnapshot<T = unknown> {
  val(): T;
}

export interface DatabaseReference<T = unknown> {
  once(event: 'value'): Promise<DatabaseSnapshot<T>>;
  update(value: unknown): Promise<void>;
  push(value: unknown): Promise<{ key: string | null }>;
  remove(): Promise<void>;
  set(value: unknown): Promise<void>;
  child(path: string): DatabaseReference;
}

export interface Database {
  ref<T = unknown>(path?: string): DatabaseReference<T>;
}
