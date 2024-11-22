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
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './artists.dto';
import { LoggingService } from 'src/logging/logging.service';

@Controller('artist')
export class ArtistsController {
  constructor(
    private readonly artistService: ArtistsService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArtistDto: CreateArtistDto) {
    this.loggingService.log('Creating a new artist');
    const artist = await this.artistService.create(createArtistDto);
    this.loggingService.log(`Created artist with ID: ${artist.id}`);
    return artist;
  }

  @Get()
  async findAll() {
    this.loggingService.log('Fetching all artists');
    const artists = await this.artistService.findAll();
    this.loggingService.log(`Fetched ${artists.length} artists`);
    return artists;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(`Fetching artist with ID: ${id}`);
    const artist = await this.artistService.findOne(id);
    this.loggingService.log(`Fetched artist with ID: ${id}`);
    return artist;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    this.loggingService.log(`Updating artist with ID: ${id}`);
    const updatedArtist = await this.artistService.update(id, updateArtistDto);
    this.loggingService.log(`Updated artist with ID: ${id}`);
    return updatedArtist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(`Deleting artist with ID: ${id}`);
    const result = await this.artistService.remove(id);
    this.loggingService.log(`Deleted artist with ID: ${id}`);
    return result;
  }
}
