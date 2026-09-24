import { inject, Injectable, signal } from '@angular/core';
import { catchError, defer, EMPTY, finalize, Observable, tap } from 'rxjs';
import { Photo } from '../../../shared/models/photo';
import { RandomPhotoApi } from '../services/random-photo-api.service';

@Injectable({ providedIn: 'root' })
export class PhotoListStore {
  private readonly api = inject(RandomPhotoApi);

  private readonly photosState = signal<Photo[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly photos = this.photosState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadMore(): Observable<Photo[]> {
    return defer(() => {
      if (this.loadingState()) {
        return EMPTY;
      }

      this.loadingState.set(true);
      this.errorState.set(null);

      return this.api.getPhotos().pipe(
        tap(photos => {
          this.photosState.update(current => [...current, ...photos]);
        }),
        catchError(() => {
          this.errorState.set('Unable to load photos. Please try again.');
          return EMPTY;
        }),
        finalize(() => {
          this.loadingState.set(false);
        }),
      );
    });
  }
}
