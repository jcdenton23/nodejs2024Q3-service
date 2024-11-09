import { Injectable, NotFoundException } from '@nestjs/common';

import * as uuid from 'uuid';
import { CreateTrackDto, Track, UpdateTrackDto } from './tracks.interface';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuid.v4(),
      title: createTrackDto.title,
      artist: createTrackDto.artist ?? null,
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
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.findOne(id);
    if (updateTrackDto.title) track.title = updateTrackDto.title;
    if (updateTrackDto.artist) track.artist = updateTrackDto.artist;
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
  }
}
