import { Photo } from '../models/photo';

export function createPhoto(id: string): Photo {
  return {
    id,
    url: `https://picsum.photos/seed/${encodeURIComponent(id)}/600/400`,
  };
}
