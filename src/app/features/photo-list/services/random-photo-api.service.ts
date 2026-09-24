import { Injectable } from '@angular/core';
import { defer, delay, Observable, of } from 'rxjs';
import { Photo } from '../../../shared/models/photo';
import { createPhoto } from '../../../shared/utils/photo-factory';

const DEFAULT_BATCH_SIZE = 15;
const MIN_DELAY_MS = 200;
const MAX_DELAY_MS = 300;

@Injectable({ providedIn: 'root' })
export class RandomPhotoApi {
  getPhotos(count = DEFAULT_BATCH_SIZE): Observable<Photo[]> {
    return defer(() => {
      const delayMs = Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
      const photos = Array.from({ length: count }, () => createPhoto(crypto.randomUUID()));

      return of(photos).pipe(delay(delayMs));
    });
  }
}
