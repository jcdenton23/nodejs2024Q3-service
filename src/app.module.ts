import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggingService } from './logging/logging.service';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    FavoritesModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggingService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
