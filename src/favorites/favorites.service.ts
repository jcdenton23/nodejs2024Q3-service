import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoriteType } from './favorites.types';

@Injectable()
export class FavoritesService {
  constructor(private prismaService: PrismaService) {}

  async getAllFavorites() {
    const [tracks, artists, albums] = await Promise.all([
      this.getFavorites('track'),
      this.getFavorites('artist'),
      this.getFavorites('album'),
    ]);

    return { tracks, artists, albums };
  }

  private async getFavorites(favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'track':
        return (
          await this.prismaService.favoriteTrack.findMany({
            include: { track: true },
          })
        ).map((v) => v.track);

      case 'artist':
        return (
          await this.prismaService.favoriteArtist.findMany({
            include: { artist: true },
          })
        ).map((v) => v.artist);

      case 'album':
        return (
          await this.prismaService.favoriteAlbum.findMany({
            include: { album: true },
          })
        ).map((v) => v.album);

      default:
        return [];
    }
  }

  async doesItemExist(id: string, favoriteType: FavoriteType) {
    return Boolean(await this.findItemById(id, favoriteType));
  }

  private async findItemById(id: string, favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'artist':
        return this.prismaService.artist.findUnique({ where: { id } });
      case 'album':
        return this.prismaService.album.findUnique({ where: { id } });
      case 'track':
        return this.prismaService.track.findUnique({ where: { id } });
      default:
        return null;
    }
  }

  async isItemInFavorites(id: string, favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'artist':
        return this.prismaService.favoriteArtist.findUnique({
          where: { artistId: id },
        });
      case 'album':
        return this.prismaService.favoriteAlbum.findUnique({
          where: { albumId: id },
        });
      case 'track':
        return this.prismaService.favoriteTrack.findUnique({
          where: { trackId: id },
        });
      default:
        return null;
    }
  }

  async addFavorite(id: string, favoriteType: FavoriteType) {
    const existingFavorite = await this.isItemInFavorites(id, favoriteType);
    if (existingFavorite) return existingFavorite;

    return this.addToFavorites(id, favoriteType);
  }

  private async addToFavorites(id: string, favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'artist':
        return this.prismaService.favoriteArtist.create({
          data: { artistId: id },
        });
      case 'album':
        return this.prismaService.favoriteAlbum.create({
          data: { albumId: id },
        });
      case 'track':
        return this.prismaService.favoriteTrack.create({
          data: { trackId: id },
        });
      default:
        throw new Error(`Unsupported favorite type: ${favoriteType}`);
    }
  }

  async removeFavorite(id: string, favoriteType: FavoriteType) {
    const deleteMethod = this.getDeleteMethod(favoriteType);
    if (!deleteMethod)
      throw new Error(`Unsupported favorite type: ${favoriteType}`);

    await deleteMethod(id);
  }

  private getDeleteMethod(favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'artist':
        return (id: string) =>
          this.prismaService.favoriteArtist.delete({ where: { artistId: id } });
      case 'album':
        return (id: string) =>
          this.prismaService.favoriteAlbum.delete({ where: { albumId: id } });
      case 'track':
        return (id: string) =>
          this.prismaService.favoriteTrack.delete({ where: { trackId: id } });
      default:
        return null;
    }
  }
}
