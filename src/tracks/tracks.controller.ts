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
import { TracksService } from './tracks.service';
import { CreateTrackDto, UpdateTrackDto } from './tracks.dto';
import { LoggingService } from 'src/logging/logging.service';

@Controller('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTrackDto: CreateTrackDto) {
    this.loggingService.log('Creating a new track');
    const track = await this.tracksService.create(createTrackDto);
    this.loggingService.log(`Created track with ID: ${track.id}`);
    return track;
  }

  @Get()
  async findAll() {
    this.loggingService.log('Fetching all tracks');
    const tracks = await this.tracksService.findAll();
    this.loggingService.log(`Fetched ${tracks.length} tracks`);
    return tracks;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(`Fetching track with ID: ${id}`);
    const track = await this.tracksService.findOne(id);
    this.loggingService.log(`Fetched track with ID: ${id}`);
    return track;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    this.loggingService.log(`Updating track with ID: ${id}`);
    const updatedTrack = await this.tracksService.update(id, updateTrackDto);
    this.loggingService.log(`Updated track with ID: ${id}`);
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(`Deleting track with ID: ${id}`);
    const result = await this.tracksService.remove(id);
    this.loggingService.log(`Deleted track with ID: ${id}`);
    return result;
  }
}
