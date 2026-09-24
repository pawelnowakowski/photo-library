import { Component, input } from '@angular/core';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { PhotoTileComponent } from '../../shared/components/photo-tile/photo-tile.component';
import { createPhoto } from '../../shared/utils/photo-factory';
import { FavoritesComponent } from './favorites.component';
import { FavoritesStore } from './store/favorites.store';
import { Photo } from '../../shared/models/photo';

@Component({
  template: '',
  selector: 'app-photo-tile',
})
class PhotoTileStubComponent {
  readonly photo = input.required<Photo>();
  readonly priority = input(false);
}

describe('FavoritesComponent', () => {
  const favorites = signal([createPhoto('photo-1'), createPhoto('photo-2')]);

  beforeEach(async () => {
    favorites.set([createPhoto('photo-1'), createPhoto('photo-2')]);

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [provideRouter([]), { provide: FavoritesStore, useValue: { favorites } }],
    })
      .overrideComponent(FavoritesComponent, {
        remove: { imports: [PhotoTileComponent] },
        add: { imports: [PhotoTileStubComponent] },
      })
      .compileComponents();
  });

  it('renders every favorite as a link to its details page', () => {
    const fixture = TestBed.createComponent(FavoritesComponent);
    fixture.detectChanges();

    const links = [...fixture.nativeElement.querySelectorAll('a')] as HTMLAnchorElement[];

    expect(links.map(link => link.getAttribute('href'))).toEqual(['/photos/photo-1', '/photos/photo-2']);
    expect(links.every(link => link.getAttribute('aria-label') === 'Open favorite photo details'))
      .withContext('each photo link should have an accessible label')
      .toBeTrue();
  });

  it('prioritizes only the first favorite image', () => {
    const fixture = TestBed.createComponent(FavoritesComponent);
    fixture.detectChanges();

    const priorities = fixture.debugElement
      .queryAll(By.directive(PhotoTileStubComponent))
      .map(element => element.componentInstance as PhotoTileStubComponent)
      .map(tile => tile.priority());

    expect(priorities).toEqual([true, false]);
  });

  it('renders an empty state when there are no favorites', () => {
    favorites.set([]);
    const fixture = TestBed.createComponent(FavoritesComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.favorites__empty-state')?.textContent).toContain(
      'No favorite photos yet.',
    );
    expect(fixture.nativeElement.querySelector('.favorites__list')).toBeNull();
  });
});
