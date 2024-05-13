import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
@ApiTags('Check Server Status')
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck('google', 'https://google.com', { timeout: 800 }),
    ]);
  }
}
