import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PhotoListStore } from './store/photo-list.store';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { InfiniteScrollTriggerDirective } from '../../shared/directives/infinite-scroll-trigger.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PhotoTileComponent } from '../../shared/components/photo-tile/photo-tile.component';
import { FavoritesStore } from '../favorites/store/favorites.store';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [MatButton, MatProgressSpinner, InfiniteScrollTriggerDirective, PhotoTileComponent, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-photo-list',
  styleUrl: './photo-list.component.scss',
  templateUrl: './photo-list.component.html',
})
export class PhotoListComponent implements OnInit {
  protected readonly store = inject(PhotoListStore);
  protected readonly favoritesStore = inject(FavoritesStore);

  private readonly destroyRef = inject(DestroyRef);
  private readonly matSnackBar = inject(MatSnackBar);

  ngOnInit() {
    if (this.store.photos().length === 0) {
      this.requestMorePhotos();
    }
  }

  protected requestMorePhotos() {
    this.store.loadMore().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected addToFavorites(id: string) {
    if (!this.favoritesStore.add(id)) {
      return;
    }

    this.matSnackBar.open('Photo added to favorites.', 'Dismiss');
  }
}
