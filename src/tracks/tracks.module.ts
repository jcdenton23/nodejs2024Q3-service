import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [TracksController],
  providers: [TracksService, LoggingService],
})
export class TracksModule {}
