import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, LoggingService],
  imports: [PrismaModule],
})
export class FavoritesModule {}
