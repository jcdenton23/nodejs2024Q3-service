import { IsBoolean, IsOptional, IsString } from 'class-validator';

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

export class CreateArtistDto {
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

export class UpdateArtistDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  grammy?: boolean;
}
