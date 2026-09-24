import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FavoritesStore } from './store/favorites.store';
import { PhotoTileComponent } from '../../shared/components/photo-tile/photo-tile.component';
import { RouterLink } from '@angular/router';

@Component({
  imports: [PhotoTileComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-favorites',
  styleUrl: './favorites.component.scss',
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent {
  protected readonly store = inject(FavoritesStore);
}
