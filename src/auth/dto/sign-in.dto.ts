import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'yazan.aakel@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  readonly email: string;
  @ApiProperty({
    example: '12Qwaszx@',
    required: true,
  })
  @IsNotEmpty()
  readonly password: string;
}
