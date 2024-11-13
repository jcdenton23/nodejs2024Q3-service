import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
} from 'class-validator';

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID or null' })
  artistId: string | null;
}

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  year?: number;

  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID or null' })
  artistId?: string | null;
}
