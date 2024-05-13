import { HttpStatus } from '@nestjs/common';
import { Exclude } from 'class-transformer';

export class ApiResponseDto {
  code: number;
  message: string;
  data: any;
  @Exclude()
  key: string;
  constructor(
    code = HttpStatus.OK,
    message = 'Success',
    data = null,
    key = 'items',
  ) {
    this.code = code;
    this.message = message;
    this.data = this.wrapData(data, key);
  }

  private wrapData(data: any, key: string): any {
    return Array.isArray(data) ? { [key]: data } : data;
  }
}
