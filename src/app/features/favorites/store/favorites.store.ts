import { computed, inject, Injectable, signal } from '@angular/core';
import { FavoritesStorageService } from '../services/favorites-storage.service';
import { createPhoto } from '../../../shared/utils/photo-factory';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly storage = inject(FavoritesStorageService);
  private readonly favoriteIdsState = signal<string[]>(this.storage.read());
  private readonly favoriteIdSet = computed(() => new Set(this.favoriteIdsState()));

  readonly favorites = computed(() => this.favoriteIdsState().map(createPhoto));

  add(id: string) {
    if (this.contains(id)) {
      return false;
    }

    this.updateFavoriteIds([...this.favoriteIdsState(), id]);
    return true;
  }

  contains(id: string) {
    return this.favoriteIdSet().has(id);
  }

  getById(id: string) {
    return this.contains(id) ? createPhoto(id) : undefined;
  }

  remove(id: string) {
    if (!this.contains(id)) {
      return false;
    }

    this.updateFavoriteIds(this.favoriteIdsState().filter(favoriteId => favoriteId !== id));
    return true;
  }

  private updateFavoriteIds(favoriteIds: string[]) {
    this.favoriteIdsState.set(favoriteIds);
    this.storage.write(favoriteIds);
  }
}
