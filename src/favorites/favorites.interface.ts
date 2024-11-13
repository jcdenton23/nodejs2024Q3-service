import { Artist } from '../artists/artists.interface';
import { Album } from '../albums/albums.interface';
import { Track } from '../tracks/tracks.interface';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}
