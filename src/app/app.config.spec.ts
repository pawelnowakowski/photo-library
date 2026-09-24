import { TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { appConfig } from './app.config';

describe('appConfig', () => {
  it('places snackbars at the top and closes them automatically', () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });

    expect(TestBed.inject(MAT_SNACK_BAR_DEFAULT_OPTIONS)).toEqual(
      jasmine.objectContaining({
        duration: 3000,
        verticalPosition: 'top',
      }),
    );
  });
});
