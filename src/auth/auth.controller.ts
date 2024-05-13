import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiResponseDto } from '../utils/api-response.dto';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@I18n() i18n: I18nContext, @Body() signInDto: SignInDto) {
    try {
      const res = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );
      const payload = { sub: res.id, username: res.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
        user: res,
      };
    } catch (error) {
      let code = HttpStatus.BAD_REQUEST;
      let message = i18n.t('translations.failure');
      if (error instanceof NotFoundException) {
        code = HttpStatus.NOT_FOUND;
        message = i18n.t('translations.user_not_found', {
          args: { email: signInDto.email },
        });
      } else if (error instanceof UnauthorizedException) {
        code = HttpStatus.UNAUTHORIZED;
        message = i18n.t('translations.email_or_password_might_be_wrong', {
          args: { email: signInDto.email },
        });
      }

      throw new HttpException(message, code);
    }
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Post('signup')
  async signUp(
    @I18n() i18n: I18nContext,
    @Body() createUserDto: CreateUserDto,
  ) {
    await this.authService.signUp(createUserDto);
    /*if (user == null) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Something went wrong, please try again later',
      });
    }*/
    return new ApiResponseDto(
      HttpStatus.OK,
      i18n.t('translations.success'),
      null,
    );
    // return new ApiResponseDto(HttpStatus.OK, i18n.t('success'));
  }
}
