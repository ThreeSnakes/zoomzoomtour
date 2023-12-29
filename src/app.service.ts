import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome(): string {
    return 'Welcome zoomzoomtour api server!!';
  }

  getOk(): string {
    return 'ok';
  }
}
