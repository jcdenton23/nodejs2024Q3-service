import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './favorites.interface';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites(): FavoritesResponse {
    return this.favoritesService.getAllFavorites();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrackToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.addFavorite('track', id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrackFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.removeFavorite('track', id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbumToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.addFavorite('album', id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbumFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.removeFavorite('album', id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtistToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.addFavorite('artist', id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtistFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.removeFavorite('artist', id);
  }
}
