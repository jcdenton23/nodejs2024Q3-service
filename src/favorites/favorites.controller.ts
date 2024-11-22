import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteType } from './favorites.types';
import { LoggingService } from 'src/logging/logging.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async getAllFavorites() {
    this.loggingService.log('Fetching all favorites');
    const favorites = await this.favoritesService.getAllFavorites();
    this.loggingService.log(`Fetched favorite items`);
    return favorites;
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(
      `Attempting to add album with ID: ${id} to favorites`,
    );
    await this.ensureItemExists(id, 'album');
    const result = await this.favoritesService.addFavorite(id, 'album');
    this.loggingService.log(`Album with ID: ${id} added to favorites`);
    return result;
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(
      `Attempting to remove album with ID: ${id} from favorites`,
    );
    await this.ensureItemInFavorites(id, 'album');
    const result = await this.favoritesService.removeFavorite(id, 'album');
    this.loggingService.log(`Album with ID: ${id} removed from favorites`);
    return result;
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(
      `Attempting to add track with ID: ${id} to favorites`,
    );
    await this.ensureItemExists(id, 'track');
    const result = await this.favoritesService.addFavorite(id, 'track');
    this.loggingService.log(`Track with ID: ${id} added to favorites`);
    return result;
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(
      `Attempting to remove track with ID: ${id} from favorites`,
    );
    await this.ensureItemInFavorites(id, 'track');
    const result = await this.favoritesService.removeFavorite(id, 'track');
    this.loggingService.log(`Track with ID: ${id} removed from favorites`);
    return result;
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(
      `Attempting to add artist with ID: ${id} to favorites`,
    );
    await this.ensureItemExists(id, 'artist');
    const result = await this.favoritesService.addFavorite(id, 'artist');
    this.loggingService.log(`Artist with ID: ${id} added to favorites`);
    return result;
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(
      `Attempting to remove artist with ID: ${id} from favorites`,
    );
    await this.ensureItemInFavorites(id, 'artist');
    const result = await this.favoritesService.removeFavorite(id, 'artist');
    this.loggingService.log(`Artist with ID: ${id} removed from favorites`);
    return result;
  }

  private async ensureItemExists(id: string, favoriteType: FavoriteType) {
    this.loggingService.log(
      `Checking existence of ${favoriteType} with ID: ${id}`,
    );
    const exists = await this.favoritesService.doesItemExist(id, favoriteType);
    if (!exists) {
      this.loggingService.error(
        `${favoriteType} with ID: "${id}" does not exist`,
      );
      throw new UnprocessableEntityException(
        `${favoriteType} with ID "${id}" does not exist.`,
      );
    }
  }

  private async ensureItemInFavorites(id: string, favoriteType: FavoriteType) {
    this.loggingService.log(
      `Checking if ${favoriteType} with ID: ${id} is in favorites`,
    );
    const inFavorites = await this.favoritesService.isItemInFavorites(
      id,
      favoriteType,
    );
    if (!inFavorites) {
      this.loggingService.error(
        `${favoriteType} with ID: "${id}" is not in your favorites`,
      );
      throw new NotFoundException(
        `${favoriteType} with ID "${id}" is not in your favorites.`,
      );
    }
  }
}
