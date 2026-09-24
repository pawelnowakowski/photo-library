import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Photo } from '../../../../shared/models/photo';
import { FavoritesStore } from '../../store/favorites.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, NgOptimizedImage, RouterLink],
  selector: 'app-photo-details',
  styleUrl: './photo-details.component.scss',
  templateUrl: './photo-details.component.html',
})
export class PhotoDetailsComponent {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(FavoritesStore);

  readonly id = input.required<string>();

  protected readonly photo = computed(() => this.store.getById(this.id()));

  protected removeFromFavorites(photo: Photo) {
    if (!this.store.remove(photo.id)) {
      return;
    }

    this.snackBar.open('Photo removed from favorites.', 'Dismiss');
    this.router.navigate(['/favorites']);
  }
}
