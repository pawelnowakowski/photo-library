import { ComponentFixture, TestBed } from '@angular/core/testing';
import '../../testing/picsum-preconnect';
import { createPhoto } from '../../utils/photo-factory';
import { PhotoTileComponent } from './photo-tile.component';

describe('PhotoTileComponent', () => {
  let fixture: ComponentFixture<PhotoTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PhotoTileComponent] }).compileComponents();
  });

  function render(priority = false): HTMLImageElement {
    fixture = TestBed.createComponent(PhotoTileComponent);
    fixture.componentRef.setInput('photo', createPhoto('photo-1'));
    fixture.componentRef.setInput('priority', priority);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('img') as HTMLImageElement;
  }

  it('renders the photo with fixed dimensions', () => {
    const image = render();

    expect(image.src).toBe('https://picsum.photos/seed/photo-1/600/400');
    expect(image.alt).toBe('Random photo');
    expect(image.getAttribute('width')).toBe('600');
    expect(image.getAttribute('height')).toBe('400');
  });
});
