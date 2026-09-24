import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Photo } from '../../models/photo';
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-photo-tile',
  styleUrl: './photo-tile.component.scss',
  templateUrl: './photo-tile.component.html',
})
export class PhotoTileComponent {
  readonly photo = input.required<Photo>();
  readonly priority = input(false);
}
