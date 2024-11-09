import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface Track {
  id: string;
  title: string;
  albumId: string | null;
  artistId: string | null;
  duration: string;
}

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  artistId: string | null;

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
  artistId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  duration?: string;

  @IsOptional()
  @IsString()
  albumId?: string | null;
}
