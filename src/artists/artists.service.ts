import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Artist, CreateArtistDto, UpdateArtistDto } from './artists.interface';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  constructor(
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  getArtistById(id: string): Artist {
    return this.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.findOne(id);
    if (updateArtistDto.name !== undefined) {
      artist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }
    return artist;
  }

  remove(id: string): void {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    this.artists.splice(artistIndex, 1);
    this.albumsService.updateAll({ artistId: id }, { artistId: null });
    this.tracksService.updateAll({ artistId: id }, { artistId: null });
    this.favoritesService.removeFromFavorite('artist', id);
  }
}
