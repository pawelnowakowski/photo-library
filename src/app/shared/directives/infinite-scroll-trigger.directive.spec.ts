import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfiniteScrollTriggerDirective } from './infinite-scroll-trigger.directive';

@Component({
  imports: [InfiniteScrollTriggerDirective],
  template: '<div appInfiniteScrollTrigger></div>',
})
class HostComponent {}

class IntersectionObserverFake {
  readonly observe = jasmine.createSpy('observe');
  readonly disconnect = jasmine.createSpy('disconnect');

  constructor(private readonly callback: IntersectionObserverCallback) {}

  trigger(...isIntersecting: boolean[]) {
    const entries = isIntersecting.map(value => ({ isIntersecting: value }) as IntersectionObserverEntry);

    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

describe('InfiniteScrollTriggerDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let observer: IntersectionObserverFake;
  let nativeIntersectionObserver: typeof IntersectionObserver;

  beforeEach(async () => {
    nativeIntersectionObserver = window.IntersectionObserver;

    window.IntersectionObserver = class extends IntersectionObserverFake {
      constructor(callback: IntersectionObserverCallback) {
        super(callback);
        observer = this;
      }
    } as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    window.IntersectionObserver = nativeIntersectionObserver;
  });

  function directive(): InfiniteScrollTriggerDirective {
    return fixture.debugElement
      .query(By.directive(InfiniteScrollTriggerDirective))
      .injector.get(InfiniteScrollTriggerDirective);
  }

  it('observes the host element', () => {
    expect(observer.observe).toHaveBeenCalledOnceWith(fixture.nativeElement.querySelector('div'));
  });

  it('emits when at least one observed entry intersects', () => {
    const reached = jasmine.createSpy('reached');
    directive().reached.subscribe(reached);

    observer.trigger(false, false);

    expect(reached).not.toHaveBeenCalled();

    observer.trigger(false, true);

    expect(reached).toHaveBeenCalledTimes(1);
  });

  it('disconnects the observer when the directive is destroyed', () => {
    fixture.destroy();

    expect(observer.disconnect).toHaveBeenCalledOnceWith();
  });
});
