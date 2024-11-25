import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdatePasswordDto } from './users.dto';
import { PasswordInterceptor } from './password.interceptor';
import { LoggingService } from 'src/logging/logging.service';

@Controller('user')
@UseInterceptors(PasswordInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async findAll() {
    this.loggingService.log('Fetching all users');
    const users = await this.usersService.findAll();
    this.loggingService.log(`Fetched ${users.length} users`);
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(`Fetching user with ID: ${id}`);
    const user = await this.usersService.findOne(id);
    if (!user) {
      this.loggingService.error(`User with ID: ${id} not found`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.loggingService.log(`Fetched user with ID: ${id}`);
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.loggingService.log('Creating a new user');
    const createdUser = await this.usersService.create(createUserDto);
    this.loggingService.log(`Created user with ID: ${createdUser.id}`);
    return createdUser;
  }

  @Put(':id')
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.loggingService.log(`Updating password for user with ID: ${id}`);
    const updatedUser = await this.usersService.updatePassword(
      id,
      updatePasswordDto,
    );
    if (!updatedUser) {
      this.loggingService.error(
        `Failed to update password for user with ID: ${id}`,
      );
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.loggingService.log(`Updated password for user with ID: ${id}`);
    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.loggingService.log(`Deleting user with ID: ${id}`);
    const result = await this.usersService.remove(id);
    this.loggingService.log(`Deleted user with ID: ${id}`);
    return result;
  }
}
