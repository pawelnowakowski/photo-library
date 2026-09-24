import { AfterViewInit, Directive, ElementRef, inject, OnDestroy, output } from '@angular/core';

@Directive({ selector: '[appInfiniteScrollTrigger]' })
export class InfiniteScrollTriggerDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  readonly reached = output<void>();

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(({ isIntersecting }) => isIntersecting)) {
        this.reached.emit();
      }
    });

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
