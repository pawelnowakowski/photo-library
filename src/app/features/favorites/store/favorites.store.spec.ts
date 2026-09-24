import { TestBed } from '@angular/core/testing';
import { createPhoto } from '../../../shared/utils/photo-factory';
import { FavoritesStorageService } from '../services/favorites-storage.service';
import { FavoritesStore } from './favorites.store';

describe('FavoritesStore', () => {
  let store: FavoritesStore;
  let storage: jasmine.SpyObj<FavoritesStorageService>;

  function configure(initialIds: string[] = []) {
    storage = jasmine.createSpyObj<FavoritesStorageService>('FavoritesStorageService', ['read', 'write']);
    storage.read.and.returnValue(initialIds);

    TestBed.configureTestingModule({
      providers: [FavoritesStore, { provide: FavoritesStorageService, useValue: storage }],
    });

    store = TestBed.inject(FavoritesStore);
  }

  it('loads saved favorites from storage', () => {
    configure(['photo-1', 'photo-2']);

    expect(store.favorites()).toEqual([createPhoto('photo-1'), createPhoto('photo-2')]);
    expect(store.contains('photo-1')).toBeTrue();
  });

  it('adds a new favorite and persists the updated identifiers', () => {
    configure(['photo-1']);

    expect(store.add('photo-2')).toBeTrue();
    expect(store.favorites()).toEqual([createPhoto('photo-1'), createPhoto('photo-2')]);
    expect(storage.write).toHaveBeenCalledOnceWith(['photo-1', 'photo-2']);
  });

  it('does not add or persist a duplicate favorite', () => {
    configure(['photo-1']);

    expect(store.add('photo-1')).toBeFalse();
    expect(store.favorites()).toEqual([createPhoto('photo-1')]);
    expect(storage.write).not.toHaveBeenCalled();
  });

  it('returns a photo only when its identifier is a favorite', () => {
    configure(['photo-1']);

    expect(store.getById('photo-1')).toEqual(createPhoto('photo-1'));
    expect(store.getById('missing')).toBeUndefined();
  });

  it('removes a favorite and persists the remaining identifiers', () => {
    configure(['photo-1', 'photo-2']);

    expect(store.remove('photo-1')).toBeTrue();
    expect(store.favorites()).toEqual([createPhoto('photo-2')]);
    expect(store.contains('photo-1')).toBeFalse();
    expect(storage.write).toHaveBeenCalledOnceWith(['photo-2']);
  });

  it('does not persist anything when removing a missing favorite', () => {
    configure(['photo-1']);

    expect(store.remove('missing')).toBeFalse();
    expect(storage.write).not.toHaveBeenCalled();
  });
});
