import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';
import '../../../../shared/testing/picsum-preconnect';
import { createPhoto } from '../../../../shared/utils/photo-factory';
import { FavoritesStore } from '../../store/favorites.store';
import { PhotoDetailsComponent } from './photo-details.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';

describe('PhotoDetailsComponent', () => {
  const photo = createPhoto('photo-1');
  let fixture: ComponentFixture<PhotoDetailsComponent>;
  let router: Router;
  let store: jasmine.SpyObj<FavoritesStore>;
  let loader: HarnessLoader;
  let matSnackBar: MatSnackBar;

  beforeEach(async () => {
    store = jasmine.createSpyObj<FavoritesStore>('FavoritesStore', ['getById', 'remove']);
    store.getById.and.returnValue(photo);
    store.remove.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [PhotoDetailsComponent],
      providers: [
        provideRouter([]),
        {
          provide: FavoritesStore,
          useValue: store,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  afterEach(() => {
    matSnackBar.dismiss();
    fixture?.destroy();
  });

  function render(id = photo.id): HTMLElement {
    fixture = TestBed.createComponent(PhotoDetailsComponent);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    return fixture.nativeElement as HTMLElement;
  }

  it('renders the favorite selected by the route identifier', () => {
    const element = render();
    const image = element.querySelector('img') as HTMLImageElement;

    expect(store.getById).toHaveBeenCalledWith(photo.id);
    expect(image.src).toBe(photo.url);
    expect(image.alt).toBe('Favorite photo');
    expect(element.querySelector('.photo-details__remove')?.textContent).toContain('Remove from favorites');
  });

  it('updates the photo when the route identifier changes', () => {
    const firstPhoto = createPhoto('photo-1');
    const secondPhoto = createPhoto('photo-2');

    store.getById.and.callFake(id => (id === firstPhoto.id ? firstPhoto : secondPhoto));

    render(firstPhoto.id);

    fixture.componentRef.setInput('id', secondPhoto.id);
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('img') as HTMLImageElement).src).toBe(secondPhoto.url);
  });

  it('renders the not-found state when the photo is not a favorite', () => {
    store.getById.and.returnValue(undefined);
    const element = render();

    expect(element.querySelector('[role="status"]')?.textContent).toContain('Photo not found');
    expect((element.querySelector('a') as HTMLAnchorElement).getAttribute('href')).toBe('/favorites');
    expect(element.querySelector('img')).toBeNull();
  });

  it('removes the favorite, shows feedback and returns to favorites', async () => {
    spyOn(router, 'navigate').and.resolveTo(true);
    const element = render();

    (element.querySelector('.photo-details__remove') as HTMLButtonElement).click();
    const snackBar = await loader.getHarness(MatSnackBarHarness);

    expect(store.remove).toHaveBeenCalledOnceWith(photo.id);
    expect(await snackBar.getMessage()).toBe('Photo removed from favorites.');
    expect(await snackBar.getActionDescription()).toBe('Dismiss');
    expect(router.navigate).toHaveBeenCalledOnceWith(['/favorites']);
  });

  it('does not show feedback or navigate when removal fails', async () => {
    store.remove.and.returnValue(false);
    spyOn(router, 'navigate').and.resolveTo(true);
    const element = render();

    (element.querySelector('.photo-details__remove') as HTMLButtonElement).click();
    const snackBars = await loader.getAllHarnesses(MatSnackBarHarness);

    expect(snackBars.length).toBe(0);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
