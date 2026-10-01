/**
 * Local Data Service for Honey Chain
 * Centralized, robust local storage provider replacing external database dependencies.
 * Provides getData, saveData, updateData, and deleteData with error handling and typing.
 */

export type StorageKey =
  | 'users'
  | 'honeyBatches'
  | 'blockchainRecords'
  | 'qualityRecords'
  | 'processingRecords'
  | 'packagingRecords'
  | 'shipments'
  | 'apiaries'
  | 'hives'
  | 'alerts'
  | 'auditLogs'
  | 'currentUser'
  | 'sensorThresholds';

const PREFIX = 'honeychain_';

export const localDataService = {
  /**
   * Retrieves data from localStorage with fallback (supports both direct and prefixed keys)
   */
  getData<T>(key: StorageKey, defaultValue: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return defaultValue;
      }
      const raw = localStorage.getItem(key) ?? localStorage.getItem(`${PREFIX}${key}`);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[localDataService] Failed to parse key "${key}" from localStorage:`, err);
      return defaultValue;
    }
  },

  /**
   * Writes data to localStorage (saves to both direct and prefixed keys for compatibility)
   */
  saveData<T>(key: StorageKey, data: T): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      localStorage.setItem(`${PREFIX}${key}`, serialized);
    } catch (err) {
      console.warn(`[localDataService] Failed to save key "${key}" to localStorage:`, err);
    }
  },

  /**
   * Updates an item in a stored array or updates via mutator function
   */
  updateData<T extends { id?: string | number }>(
    key: StorageKey,
    itemOrMutator: (Partial<T> & { id: string | number }) | ((items: T[]) => T[])
  ): T[] {
    const current = this.getData<T[]>(key, []);
    let updated: T[];

    if (typeof itemOrMutator === 'function') {
      updated = itemOrMutator(current);
    } else {
      const targetId = itemOrMutator.id;
      let found = false;
      updated = current.map((item) => {
        if (item.id === targetId) {
          found = true;
          return { ...item, ...itemOrMutator };
        }
        return item;
      });
      if (!found) {
        updated.push(itemOrMutator as unknown as T);
      }
    }

    this.saveData(key, updated);
    return updated;
  },

  /**
   * Deletes an item from a stored array by id or predicate
   */
  deleteData<T extends { id?: string | number }>(
    key: StorageKey,
    idOrPredicate: string | number | ((item: T) => boolean)
  ): T[] {
    const current = this.getData<T[]>(key, []);
    let filtered: T[];

    if (typeof idOrPredicate === 'function') {
      filtered = current.filter((item) => !idOrPredicate(item));
    } else {
      filtered = current.filter((item) => item.id !== idOrPredicate);
    }

    this.saveData(key, filtered);
    return filtered;
  },

  /**
   * Removes all Honey Chain keys from localStorage to reset demo data
   */
  clearAll(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      const keys: StorageKey[] = [
        'users',
        'honeyBatches',
        'blockchainRecords',
        'qualityRecords',
        'processingRecords',
        'packagingRecords',
        'shipments',
        'apiaries',
        'hives',
        'alerts',
        'auditLogs',
        'currentUser',
        'sensorThresholds',
      ];
      keys.forEach((k) => {
        localStorage.removeItem(k);
        localStorage.removeItem(`${PREFIX}${k}`);
      });
    } catch (err) {
      console.warn('[localDataService] Failed to clear Honey Chain storage:', err);
    }
  },

  /**
   * Checks whether honey batches are already stored in localStorage
   */
  hasStoredData(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      return !!(localStorage.getItem('honeyBatches') || localStorage.getItem(`${PREFIX}honeyBatches`));
    } catch {
      return false;
    }
  },
};

/**
 * Centralized helper functions for components and modules
 */
export const getData = <T>(key: StorageKey, defaultValue: T): T => localDataService.getData(key, defaultValue);
export const saveData = <T>(key: StorageKey, data: T): void => localDataService.saveData(key, data);
export const updateData = <T extends { id?: string | number }>(
  key: StorageKey,
  itemOrMutator: (Partial<T> & { id: string | number }) | ((items: T[]) => T[])
): T[] => localDataService.updateData(key, itemOrMutator);
export const deleteData = <T extends { id?: string | number }>(
  key: StorageKey,
  idOrPredicate: string | number | ((item: T) => boolean)
): T[] => localDataService.deleteData(key, idOrPredicate);
