import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

const FAVORITES_STORAGE_KEY = 'xm-photo-library:favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesStorageService {
  private readonly document = inject(DOCUMENT);

  read(): string[] {
    const serializedFavorites = this.readFromStorage();

    if (serializedFavorites === null) {
      return [];
    }

    const favoriteIds = parseFavoriteIds(serializedFavorites);

    return favoriteIds ? [...new Set(favoriteIds)] : [];
  }

  write(favoriteIds: readonly string[]) {
    try {
      this.getStorage()?.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Favorites still work in memory when browser storage is unavailable.
    }
  }

  private readFromStorage(): string | null {
    try {
      return this.getStorage()?.getItem(FAVORITES_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private getStorage(): Storage | null {
    return this.document.defaultView?.localStorage ?? null;
  }
}

function parseFavoriteIds(value: string): string[] | null {
  try {
    const parsed: unknown = JSON.parse(value);

    return isFavoriteIdArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isFavoriteIdArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isFavoriteId);
}

function isFavoriteId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}
