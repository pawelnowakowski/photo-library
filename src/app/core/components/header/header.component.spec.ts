import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({ template: '' })
class RouteStub {}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([
          { path: '', component: RouteStub, data: { section: 'photos' } },
          { path: 'favorites', component: RouteStub, data: { section: 'favorites' } },
          { path: 'photos/:id', component: RouteStub, data: { section: 'favorites' } },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  async function redirectTo(url: string) {
    await router.navigateByUrl(url);
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function links(): HTMLAnchorElement[] {
    return [...fixture.nativeElement.querySelectorAll('a')] as HTMLAnchorElement[];
  }

  it('renders links to the photo list and favorites', async () => {
    await redirectTo('/');

    expect(links().map(link => link.textContent?.trim())).toEqual(['Photos', 'Favorites']);
    expect(links().map(link => link.getAttribute('href'))).toEqual(['/', '/favorites']);
  });

  it('highlights Photos as current on the root page', async () => {
    await redirectTo('/');

    expect(links()[0].getAttribute('aria-current')).toBe('page');
    expect(links()[1].hasAttribute('aria-current')).toBeFalse();
  });

  it('highlights Favorites when navigates to the favorites page', async () => {
    await redirectTo('/favorites');

    expect(links()[0].hasAttribute('aria-current')).toBeFalse();
    expect(links()[1].getAttribute('aria-current')).toBe('page');
  });

  it('keeps Favorites highlighted when navigated to the photo details page', async () => {
    await redirectTo('/photos/photo-1');

    expect(links()[0].hasAttribute('aria-current')).toBeFalse();
    expect(links()[1].getAttribute('aria-current')).toBe('page');
  });

  it('navigates when a header link is clicked', async () => {
    await redirectTo('/');

    links()[1].click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/favorites');
    expect(links()[1].getAttribute('aria-current')).toBe('page');
  });
});
