import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto } from './albums.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    return this.prismaService.album.create({ data: createAlbumDto });
  }

  async findAll() {
    return this.prismaService.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prismaService.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    await this.findOne(id);
    return this.prismaService.album.update({
      where: { id },
      data: updateAlbumDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.$transaction([
      this.prismaService.favoriteAlbum.deleteMany({ where: { albumId: id } }),
      this.prismaService.album.delete({ where: { id } }),
    ]);
  }
}
