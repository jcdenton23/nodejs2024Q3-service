import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto, UpdateAlbumDto } from './albums.dto';
import { LoggingService } from 'src/logging/logging.service';

@Controller('album')
export class AlbumsController {
  constructor(
    private readonly albumService: AlbumsService,
    private readonly loggingService: LoggingService, // Injecting the LoggingService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    this.loggingService.log('Creating a new album');
    const album = await this.albumService.create(createAlbumDto);
    this.loggingService.log(`Created album with ID: ${album.id}`);
    return album;
  }

  @Get()
  async findAll() {
    this.loggingService.log('Fetching all albums');
    const albums = await this.albumService.findAll();
    this.loggingService.log(`Fetched ${albums.length} albums`);
    return albums;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(`Fetching album with ID: ${id}`);
    const album = await this.albumService.findOne(id);
    this.loggingService.log(`Fetched album with ID: ${id}`);
    return album;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    this.loggingService.log(`Updating album with ID: ${id}`);
    const updatedAlbum = await this.albumService.update(id, updateAlbumDto);
    this.loggingService.log(`Updated album with ID: ${id}`);
    return updatedAlbum;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(`Deleting album with ID: ${id}`);
    const result = await this.albumService.remove(id);
    this.loggingService.log(`Deleted album with ID: ${id}`);
    return result;
  }
}
