import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, LoggingService],
})
export class AlbumsModule {}
