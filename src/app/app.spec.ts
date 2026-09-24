import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { Component } from '@angular/core';
import { HeaderComponent } from './core/components/header/header.component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    })
      .overrideComponent(App, {
        remove: {
          imports: [HeaderComponent],
        },
        add: {
          imports: [HeaderStubComponent],
        },
      })
      .compileComponents();
  });

  it('renders the application shell', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('mat-card')).not.toBeNull();
    expect(element.querySelector('main.app')).not.toBeNull();
    expect(element.querySelector('app-header')).not.toBeNull();
    expect(element.querySelector('router-outlet')).not.toBeNull();
  });
});

@Component({
  selector: 'app-header',
  template: '',
})
class HeaderStubComponent {}
