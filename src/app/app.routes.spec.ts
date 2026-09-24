import { routes } from './app.routes';

describe('application routes', () => {
  it('assigns every page to the section highlighted in the header', () => {
    expect(routes.map(({ path, data }) => ({ path, section: data?.['section'] }))).toEqual([
      { path: '', section: 'photos' },
      { path: 'favorites', section: 'favorites' },
      { path: 'photos/:id', section: 'favorites' },
      { path: '**', section: undefined },
    ]);
  });

  it('redirects unknown URLs to the photo list', () => {
    expect(routes.at(-1)).toEqual(jasmine.objectContaining({ path: '**', redirectTo: '' }));
  });
});
