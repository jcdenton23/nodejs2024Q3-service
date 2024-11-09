import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface Track {
  id: string;
  title: string;
  albumId: string | null;
  artist: string | null;
  duration: string;
}

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  artist: string | null;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsOptional()
  @IsString()
  albumId: string | null;
}

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  artist?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  duration?: string;

  @IsOptional()
  @IsString()
  albumId?: string | null;
}
