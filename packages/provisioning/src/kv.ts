export type KVValue = string | null;

export interface KVStore {
  get(key: string): Promise<KVValue>;
  set(key: string, value: string, ttlSeconds?: number | null): Promise<void>;
  setNX(key: string, value: string, ttlSeconds?: number | null): Promise<boolean>;
  delete(key: string): Promise<void>;
}
