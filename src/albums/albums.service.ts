import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { CreateAlbumDto, Album, UpdateAlbumDto } from './albums.interface';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuid.v4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.findOne(id);
    if (updateAlbumDto.name) album.name = updateAlbumDto.name;
    if (updateAlbumDto.year) album.year = updateAlbumDto.year;
    if (updateAlbumDto.artistId !== undefined)
      album.artistId = updateAlbumDto.artistId;
    return album;
  }

  remove(id: string): void {
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    this.albums.splice(albumIndex, 1);
    this.tracksService.updateAll({ albumId: id }, { albumId: null });
    this.favoritesService.removeFromFavorite('album', id);
  }

  updateAll(artistFilter: { artistId: string }, update: { artistId: null }) {
    this.albums.forEach((album) => {
      if (album.artistId === artistFilter.artistId) {
        album.artistId = update.artistId;
      }
    });
  }
}
