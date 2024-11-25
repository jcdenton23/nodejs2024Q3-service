import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto, UpdateTrackDto } from './tracks.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    return this.prismaService.track.create({ data: createTrackDto });
  }

  async findAll() {
    return this.prismaService.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.getTrackById(id);
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    await this.getTrackById(id);
    const data = { ...updateTrackDto };
    return this.prismaService.track.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.getTrackById(id);
    await this.prismaService.favoriteTrack.deleteMany({
      where: { trackId: id },
    });
    return this.prismaService.track.delete({ where: { id } });
  }

  private async getTrackById(id: string) {
    const track = await this.prismaService.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(`Track with ID ${id} not found`);
    return track;
  }
}
