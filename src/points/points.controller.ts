import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param, ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { PointsService } from './points.service';
import { PointsDto } from './dto/points.dto';
import { ApiResponseDto } from '../utils/api-response.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Points')
@Controller('points')
/*@ApiBearerAuth()
@UseGuards(AuthGuard)*/
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  async create(@I18n() i18n: I18nContext, @Body() pointsDto: PointsDto) {
    const point = await this.pointsService.create(pointsDto);
    return new ApiResponseDto(
      HttpStatus.OK,
      i18n.t('translations.success'),
      point,
    );
  }

  @Get()
  async findAll(@I18n() i18n: I18nContext) {
    const points = await this.pointsService.findAll();
    return new ApiResponseDto(
      HttpStatus.OK,
      i18n.t('translations.success'),
      points,
      'points',
    );
  }
  @Get('nearest')
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'maxDistance', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findNearest(
    @I18n() i18n: I18nContext,
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('maxDistance', new DefaultValuePipe(10), ParseIntPipe)
    maxDistance?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const points = await this.pointsService.findNearest(
      longitude,
      latitude,
      maxDistance,
      limit,
    );
    return new ApiResponseDto(
      HttpStatus.OK,
      i18n.t('translations.success'),
      points,
      'points',
    );
  }

  @Get(':id')
  async findOne(@I18n() i18n: I18nContext, @Param('id') id: string) {
    const point = await this.pointsService.findOne(id);
    if (!point) {
      throw new NotFoundException(
        new ApiResponseDto(
          HttpStatus.NOT_FOUND,
          i18n.t('translations.entity_not_found', {
            args: { entity: i18n.t('translations.point') },
          }),
        ),
      );
    }
    return new ApiResponseDto(
      HttpStatus.OK,
      i18n.t('translations.success'),
      point,
    );
  }

  @Patch(':id')
  async update(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Body() pointsDto: PointsDto,
  ) {
    const point = await this.pointsService.update(id, pointsDto);
    if (!point) {
      throw new NotFoundException(
        new ApiResponseDto(
          HttpStatus.NOT_FOUND,
          i18n.t('translations.entity_not_found', {
            args: { entity: i18n.t('translations.point') },
          }),
        ),
      );
    }
    return new ApiResponseDto(
      HttpStatus.OK,
      i18n.t('translations.success'),
      point,
    );
  }

  @Delete(':id')
  async delete(@I18n() i18n: I18nContext, @Param('id') id: string) {
    const existingRecord = await this.pointsService.findOne(id);
    if (!existingRecord) {
      throw new NotFoundException(
        new ApiResponseDto(
          HttpStatus.NOT_FOUND,
          i18n.t('translations.entity_not_found', {
            args: { entity: i18n.t('translations.point') },
          }),
        ),
      );
    }
    const result = await this.pointsService.softDelete(id);
    if (result.affected > 0)
      return new ApiResponseDto(HttpStatus.OK, i18n.t('translations.success'));
    throw new BadRequestException({
      status: HttpStatus.BAD_REQUEST,
      message: i18n.t('translations.failure'),
    });
  }
}
