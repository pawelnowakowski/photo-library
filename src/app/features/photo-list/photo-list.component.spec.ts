import { Component, Directive, input, output, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { EMPTY, Subject } from 'rxjs';
import { FavoritesStore } from '../favorites/store/favorites.store';
import { PhotoTileComponent } from '../../shared/components/photo-tile/photo-tile.component';
import { InfiniteScrollTriggerDirective } from '../../shared/directives/infinite-scroll-trigger.directive';
import { Photo } from '../../shared/models/photo';
import { createPhoto } from '../../shared/utils/photo-factory';
import { PhotoListComponent } from './photo-list.component';
import { PhotoListStore } from './store/photo-list.store';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';

@Directive({
  selector: '[appInfiniteScrollTrigger]',
})
class InfiniteScrollTriggerStubDirective {
  readonly reached = output<void>();
}

@Component({
  template: '',
  selector: 'app-photo-tile:not(p)',
})
class PhotoTileStubComponent {
  readonly photo = input.required<Photo>();
  readonly priority = input(false);
}

describe('PhotoListComponent', () => {
  let fixture: ComponentFixture<PhotoListComponent>;
  let listStore: {
    photos: ReturnType<typeof signal<Photo[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadMore: jasmine.Spy;
  };
  let favoritesStore: jasmine.SpyObj<Pick<FavoritesStore, 'add' | 'contains'>>;
  let loader: HarnessLoader;
  let matSnackBar: MatSnackBar;

  beforeEach(async () => {
    listStore = {
      photos: signal<Photo[]>([]),
      loading: signal(false),
      error: signal<string | null>(null),
      loadMore: jasmine.createSpy('loadMore').and.returnValue(EMPTY),
    };
    favoritesStore = jasmine.createSpyObj('FavoritesStore', ['add', 'contains']);
    favoritesStore.add.and.returnValue(true);
    favoritesStore.contains.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [PhotoListComponent],
      providers: [
        { provide: PhotoListStore, useValue: listStore },
        { provide: FavoritesStore, useValue: favoritesStore },
      ],
    })
      .overrideComponent(PhotoListComponent, {
        remove: { imports: [PhotoTileComponent, InfiniteScrollTriggerDirective] },
        add: { imports: [PhotoTileStubComponent, InfiniteScrollTriggerStubDirective] },
      })
      .compileComponents();

    matSnackBar = TestBed.inject(MatSnackBar);
  });

  afterEach(() => {
    matSnackBar.dismiss();
    fixture?.destroy();
  });

  function render(): HTMLElement {
    fixture = TestBed.createComponent(PhotoListComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    return fixture.nativeElement as HTMLElement;
  }

  it('requests the first batch when the store is empty', () => {
    render();

    expect(listStore.loadMore).toHaveBeenCalledTimes(1);
  });

  it('does not request an initial batch when photos already exist', () => {
    listStore.photos.set([createPhoto('photo-1')]);

    render();

    expect(listStore.loadMore).not.toHaveBeenCalled();
  });

  it('renders store photos and prioritizes only the first tile', () => {
    listStore.photos.set([createPhoto('photo-1'), createPhoto('photo-2')]);
    render();

    const tiles = fixture!.debugElement
      .queryAll(By.directive(PhotoTileStubComponent))
      .map(element => element.componentInstance as PhotoTileStubComponent);

    expect(tiles.map(tile => tile.photo())).toEqual([createPhoto('photo-1'), createPhoto('photo-2')]);
    expect(tiles.map(tile => tile.priority())).toEqual([true, false]);
  });

  it('marks an existing favorite and disables its action', () => {
    listStore.photos.set([createPhoto('photo-1'), createPhoto('photo-2')]);
    favoritesStore.contains.and.callFake(id => id === 'photo-1');
    const element = render();
    const buttons = [...element.querySelectorAll('.photo-list__action')] as HTMLButtonElement[];

    expect(buttons[0].disabled).toBeTrue();
    expect(buttons[0].querySelector('.photo-list__favorite-badge')).not.toBeNull();
    expect(buttons[1].disabled).toBeFalse();
    expect(buttons[1].getAttribute('aria-label')).toBe('Add photo to favorites');
  });

  it('adds a photo and displays confirmation', async () => {
    const photo = createPhoto('photo-1');
    listStore.photos.set([photo]);
    const element = render();

    (element.querySelector('.photo-list__action') as HTMLButtonElement).click();
    const snackBar = await loader.getHarness(MatSnackBarHarness);

    expect(favoritesStore.add).toHaveBeenCalledOnceWith(photo.id);
    expect(await snackBar.getMessage()).toBe('Photo added to favorites.');
    expect(await snackBar.getActionDescription()).toBe('Dismiss');
  });

  it('does not display confirmation when adding is rejected by the store', async () => {
    listStore.photos.set([createPhoto('photo-1')]);
    favoritesStore.add.and.returnValue(false);
    const element = render();

    (element.querySelector('.photo-list__action') as HTMLButtonElement).click();

    expect(await loader.getAllHarnesses(MatSnackBarHarness)).toHaveSize(0);
  });

  it('renders a loading state', () => {
    listStore.photos.set([createPhoto('photo-1')]);
    listStore.loading.set(true);
    const element = render();

    expect(element.querySelector('[role="status"]')?.textContent).toContain('Loading photos');
  });

  it('renders an error and retries on demand', () => {
    listStore.photos.set([createPhoto('photo-1')]);
    listStore.error.set('Unable to load photos. Please try again.');

    const element = render();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Unable to load photos. Please try again.');

    (element.querySelector('[role="alert"] button') as HTMLButtonElement).click();

    expect(listStore.loadMore).toHaveBeenCalledTimes(1);
  });

  it('requests more photos when the infinite-scroll trigger is reached', () => {
    listStore.photos.set([createPhoto('photo-1')]);
    render();

    const infiniteScroll = fixture.debugElement
      .query(By.directive(InfiniteScrollTriggerStubDirective))
      .injector.get(InfiniteScrollTriggerStubDirective);

    infiniteScroll.reached.emit();

    expect(listStore.loadMore).toHaveBeenCalledTimes(1);
  });
});
