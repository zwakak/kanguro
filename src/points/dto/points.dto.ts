import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PointsDto {
  @ApiProperty({
    example: 'Torino Stilla Moris Tabaccheria',
    required: true,
  })
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty({
    example: 'Corso Giuseppe Siccardi 11',
    required: true,
  })
  @IsNotEmpty()
  readonly address: string;
  @ApiProperty({
    example: '45.22563',
    required: true,
  })
  @IsNotEmpty()
  readonly longitude: number;
  @ApiProperty({
    example: '45.22563',
    required: true,
  })
  @IsNotEmpty()
  readonly latitude: number;
}
