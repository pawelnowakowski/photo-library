import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FavoritesStorageService } from './favorites-storage.service';

describe('FavoritesStorageService', () => {
  const storageKey = 'xm-photo-library:favorites';
  let service: FavoritesStorageService;
  let storage: jasmine.SpyObj<Storage>;
  let documentStub: { defaultView: { localStorage: Storage } | null };

  beforeEach(() => {
    storage = jasmine.createSpyObj<Storage>('Storage', ['getItem', 'setItem']);
    documentStub = { defaultView: { localStorage: storage } };

    TestBed.configureTestingModule({
      providers: [FavoritesStorageService, { provide: DOCUMENT, useValue: documentStub }],
    });

    service = TestBed.inject(FavoritesStorageService);
  });

  it('returns an empty list when nothing has been stored', () => {
    storage.getItem.and.returnValue(null);

    expect(service.read()).toEqual([]);
    expect(storage.getItem).toHaveBeenCalledWith(storageKey);
  });

  it('reads valid identifiers and removes duplicates without changing their order', () => {
    storage.getItem.and.returnValue(JSON.stringify(['photo-2', 'photo-1', 'photo-2']));

    expect(service.read()).toEqual(['photo-2', 'photo-1']);
  });

  it('returns an empty array for malformed JSON', () => {
    storage.getItem.and.returnValue('{not json');

    expect(service.read()).toEqual([]);
  });

  it('returns an empty array when stored value contains invalid favorite IDs', () => {
    const invalidValues = [['photo-1', 2], ['photo-1', ''], { id: 'photo-1' }];

    for (const value of invalidValues) {
      storage.getItem.and.returnValue(JSON.stringify(value));
      expect(service.read())
        .withContext(`stored value: ${JSON.stringify(value)}`)
        .toEqual([]);
    }
  });

  it('returns an empty list when localStorage cannot be read', () => {
    storage.getItem.and.throwError('Storage unavailable');

    expect(service.read()).toEqual([]);
  });

  it('serializes identifiers under the application storage key', () => {
    service.write(['photo-1', 'photo-2']);

    expect(storage.setItem).toHaveBeenCalledOnceWith(storageKey, '["photo-1","photo-2"]');
  });

  it('does not throw when localStorage cannot be written', () => {
    storage.setItem.and.throwError('Quota exceeded');

    expect(() => service.write(['photo-1'])).not.toThrow();
  });

  it('works without browser storage', () => {
    documentStub.defaultView = null;

    expect(service.read()).toEqual([]);
    expect(() => service.write(['photo-1'])).not.toThrow();
    expect(storage.getItem).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});
