import { Injectable } from '@nestjs/common';
import { PointsDto } from './dto/points.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Points } from './entities/points.entities';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class PointsService {
  @InjectRepository(Points)
  private readonly pointsRepository: Repository<Points>;

  findOne(id: string): Promise<PointsDto> {
    return this.pointsRepository.findOneBy({ id });
  }

  async create(pointDto: PointsDto): Promise<Points> {
    const point: Points = new Points();
    point.name = pointDto.name;
    point.address = pointDto.address;
    point.latitude = pointDto.latitude;
    point.longitude = pointDto.longitude;
    return await this.pointsRepository.save(point);
  }

  findAll(): Promise<Points[]> {
    return this.pointsRepository.find();
  }

  async update(id: string, pointsDto: PointsDto): Promise<Points> {
    await this.pointsRepository.update(id, pointsDto);
    return this.pointsRepository.findOne({ where: { id } });
  }
  softDelete(id: string): Promise<UpdateResult> {
    return this.pointsRepository.softDelete(id);
  }

  async findNearest(
    longitude: number,
    latitude: number,
    maxDistance: number,
    limit: number,
  ): Promise<Points[]> {
    const haversineFormula = `6371 * ACOS(COS(RADIANS(:latitude)) * COS(RADIANS(m.latitude)) * COS(RADIANS(m.longitude) - RADIANS(:longitude)) + SIN(RADIANS(:latitude)) * SIN(RADIANS(m.latitude)))`;

    return await this.pointsRepository
      .createQueryBuilder('m')
      .select(`m.*, ${haversineFormula} AS distance`)
      .having(`distance < :maxDistance`)
      .setParameters({ latitude, longitude, maxDistance })
      .orderBy('distance')
      .limit(limit)
      .getRawMany();
  }
}
