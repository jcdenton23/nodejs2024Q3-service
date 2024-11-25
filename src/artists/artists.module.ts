import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, LoggingService],
})
export class ArtistsModule {}
