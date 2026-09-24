import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { createPhoto } from '../../../shared/utils/photo-factory';
import { RandomPhotoApi } from '../services/random-photo-api.service';
import { PhotoListStore } from './photo-list.store';
import { Photo } from '../../../shared/models/photo';

describe('PhotoListStore', () => {
  let api: jasmine.SpyObj<RandomPhotoApi>;
  let store: PhotoListStore;

  beforeEach(() => {
    api = jasmine.createSpyObj<RandomPhotoApi>('RandomPhotoApi', ['getPhotos']);

    TestBed.configureTestingModule({
      providers: [PhotoListStore, { provide: RandomPhotoApi, useValue: api }],
    });

    store = TestBed.inject(PhotoListStore);
  });

  it('sets loading state while a request is pending and clears once completed', () => {
    const response = new Subject<Photo[]>();
    api.getPhotos.and.returnValue(response);

    store.loadMore().subscribe();
    expect(store.loading()).toBeTrue();

    response.complete();
    expect(store.loading()).toBeFalse();
  });

  it('ignores additional requests while a load is in progress', () => {
    const request = new Subject<Photo[]>();
    api.getPhotos.and.returnValue(request);

    store.loadMore().subscribe();
    store.loadMore().subscribe();

    expect(api.getPhotos).toHaveBeenCalledTimes(1);

    request.complete();

    store.loadMore().subscribe();

    expect(api.getPhotos).toHaveBeenCalledTimes(2);
  });

  it('appends subsequent batches to the current photos', () => {
    api.getPhotos.and.returnValues(of([createPhoto('photo-1')]), of([createPhoto('photo-2'), createPhoto('photo-3')]));

    store.loadMore().subscribe();
    store.loadMore().subscribe();

    expect(store.photos()).toEqual([createPhoto('photo-1'), createPhoto('photo-2'), createPhoto('photo-3')]);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('exposes an error message and keeps existing photos when loading fails', () => {
    api.getPhotos.and.returnValues(
      of([createPhoto('photo-1')]),
      throwError(() => new Error('Network failure')),
    );

    store.loadMore().subscribe();
    store.loadMore().subscribe();

    expect(store.photos()).toEqual([createPhoto('photo-1')]);
    expect(store.error()).toBe('Unable to load photos. Please try again.');
    expect(store.loading()).toBeFalse();
  });

  it('clears an earlier error when a retry starts', () => {
    const retry = new Subject<ReturnType<typeof createPhoto>[]>();
    api.getPhotos.and.returnValues(
      throwError(() => new Error('Failure')),
      retry,
    );

    store.loadMore().subscribe();
    expect(store.error()).not.toBeNull();

    store.loadMore().subscribe();
    expect(store.error()).toBeNull();
    expect(store.loading()).toBeTrue();

    retry.complete();
  });

  it('clears loading when a pending request is canceled', () => {
    api.getPhotos.and.returnValue(new Subject());

    const subscription = store.loadMore().subscribe();
    expect(store.loading()).toBeTrue();

    subscription.unsubscribe();
    expect(store.loading()).toBeFalse();
  });
});
