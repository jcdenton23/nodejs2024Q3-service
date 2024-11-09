import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface Track {
  id: string;
  name: string;
  albumId: string | null;
  artistId: string | null;
  duration: number;
}

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  artistId: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsOptional()
  @IsString()
  albumId: string | null;
}

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  artistId?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  duration?: number;

  @IsOptional()
  @IsString()
  albumId?: string | null;
}
