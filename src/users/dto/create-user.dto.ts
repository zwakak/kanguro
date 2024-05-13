import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const passwordRegEx =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export class CreateUserDto {
  @ApiProperty({
    example: 'Yazan Aakel',
    required: true,
  })
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'yazan.aakel@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail(
    {
      require_display_name: false,
    },
    { message: 'Please provide valid Email.' },
  )
  email: string;

  @ApiProperty({
    example: '34',
    required: false,
  })
  @IsInt()
  age: number;

  @ApiProperty({
    example: 'm',
    required: true,
  })
  @IsString()
  @IsEnum(['f', 'm', 'u'])
  gender: string;

  @ApiProperty({
    example: '12Qwaszx@',
    required: true,
  })
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
  })
  password: string;
}
