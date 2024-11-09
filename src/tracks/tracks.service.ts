import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as uuid from 'uuid';
import { CreateTrackDto, Track, UpdateTrackDto } from './tracks.interface';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuid.v4(),
      title: createTrackDto.title,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  getTrackById(id: string): Track {
    return this.tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.findOne(id);
    if (updateTrackDto.title) track.title = updateTrackDto.title;
    if (updateTrackDto.artistId) track.artistId = updateTrackDto.artistId;
    if (updateTrackDto.duration) track.duration = updateTrackDto.duration;
    if (updateTrackDto.albumId) track.albumId = updateTrackDto.albumId;
    return track;
  }

  remove(id: string): void {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    this.tracks.splice(trackIndex, 1);
    this.favoritesService.removeFromFavorite('track', id);
  }

  updateAll(
    filter: { artistId?: string; albumId?: string },
    update: { artistId?: null; albumId?: null },
  ) {
    this.tracks.forEach((track) => {
      if (filter.artistId && track.artistId === filter.artistId) {
        track.artistId = update.artistId;
      }
      if (filter.albumId && track.albumId === filter.albumId) {
        track.albumId = update.albumId;
      }
    });
  }
}
