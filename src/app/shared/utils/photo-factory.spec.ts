import { createPhoto } from './photo-factory';

describe('createPhoto', () => {
  it('creates a Picsum URL seeded with the photo identifier', () => {
    expect(createPhoto('photo-1')).toEqual({
      id: 'photo-1',
      url: 'https://picsum.photos/seed/photo-1/600/400',
    });
  });

  it('encodes identifiers before inserting them into the URL', () => {
    expect(createPhoto('folder/photo & 1').url).toBe('https://picsum.photos/seed/folder%2Fphoto%20%26%201/600/400');
  });
});
