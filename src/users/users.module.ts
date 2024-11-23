import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, LoggingService],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
