import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto, UpdateArtistDto } from './artists.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    return this.prismaService.artist.create({ data: createArtistDto });
  }

  async findAll() {
    return this.prismaService.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });
    if (!artist) throw new NotFoundException(`Artist with ID ${id} not found`);
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    await this.findOne(id);
    return this.prismaService.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.$transaction([
      this.prismaService.favoriteArtist.deleteMany({ where: { artistId: id } }),
      this.prismaService.artist.delete({ where: { id } }),
    ]);
  }
}
