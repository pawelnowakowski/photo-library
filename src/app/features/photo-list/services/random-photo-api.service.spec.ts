import { TestBed } from '@angular/core/testing';
import { Photo } from '../../../shared/models/photo';
import { RandomPhotoApi } from './random-photo-api.service';

describe('RandomPhotoApi', () => {
  let api: RandomPhotoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    api = TestBed.inject(RandomPhotoApi);
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('emits the requested number of uniquely seeded photos after the minimum delay', () => {
    spyOn(Math, 'random').and.returnValue(0);
    let result: Photo[] | undefined;

    api.getPhotos(3).subscribe(photos => (result = photos));

    jasmine.clock().tick(199);
    expect(result).toBeUndefined();

    jasmine.clock().tick(1);
    expect(result?.length).toBe(3);
    expect(new Set(result?.map(({ id }) => id)).size).toBe(3);
    result?.forEach(({ id, url }) => {
      expect(url).toBe(`https://picsum.photos/seed/${encodeURIComponent(id)}/600/400`);
    });
  });

  it('can delay a response for up to 300 milliseconds', () => {
    spyOn(Math, 'random').and.returnValue(0.99999);
    let emitted = false;

    api.getPhotos(1).subscribe(() => (emitted = true));

    jasmine.clock().tick(299);
    expect(emitted).toBeFalse();

    jasmine.clock().tick(1);
    expect(emitted).toBeTrue();
  });

  it('returns 15 photos when no batch size is supplied', () => {
    let result: Photo[] = [];

    api.getPhotos().subscribe(photos => (result = photos));
    jasmine.clock().tick(300);

    expect(result.length).toBe(15);
  });
});
