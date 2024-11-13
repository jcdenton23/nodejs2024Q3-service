import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './favorites.interface';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { isUUID } from 'class-validator';
import { Artist } from 'src/artists/artists.interface';
import { Album } from 'src/albums/albums.interface';
import { Track } from 'src/tracks/tracks.interface';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  getAllFavorites(): FavoritesResponse {
    const artists =
      this.favorites.artists
        .map((id) => this.artistsService.getArtistById(id))
        .filter((artist): artist is Artist => artist !== undefined) || [];

    const albums =
      this.favorites.albums
        .map((id) => this.albumsService.getAlbumByid(id))
        .filter((album): album is Album => album !== undefined) || [];

    const tracks =
      this.favorites.tracks
        .map((id) => this.tracksService.getTrackById(id))
        .filter((track): track is Track => track !== undefined) || [];

    return { artists, albums, tracks };
  }

  addFavorite(type: 'track' | 'album' | 'artist', id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    let exists = false;
    switch (type) {
      case 'track':
        exists = !!this.tracksService.getTrackById(id);
        if (!exists)
          throw new UnprocessableEntityException(
            `Track with ID ${id} does not exist`,
          );
        if (!this.favorites.tracks.includes(id)) this.favorites.tracks.push(id);
        break;
      case 'album':
        exists = !!this.albumsService.getAlbumByid(id);
        if (!exists)
          throw new UnprocessableEntityException(
            `Album with ID ${id} does not exist`,
          );
        if (!this.favorites.albums.includes(id)) this.favorites.albums.push(id);
        break;
      case 'artist':
        exists = !!this.artistsService.getArtistById(id);
        if (!exists)
          throw new UnprocessableEntityException(
            `Artist with ID ${id} does not exist`,
          );
        if (!this.favorites.artists.includes(id))
          this.favorites.artists.push(id);
        break;
    }
  }

  removeFavorite(type: 'track' | 'album' | 'artist', id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID: ${id}`);
    }

    const index = this.favorites[(type + 's') as keyof Favorites].indexOf(id);
    if (index === -1) {
      throw new NotFoundException(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } with ID ${id} is not in favorites`,
      );
    }

    this.favorites[(type + 's') as keyof Favorites].splice(index, 1);
  }

  removeFromFavorite(
    entityType: 'artist' | 'album' | 'track',
    id: string,
  ): void {
    this.favorites[entityType] = this.favorites?.[entityType]?.filter(
      (favId) => favId !== id,
    );
  }
}
