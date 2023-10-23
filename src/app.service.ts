import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(name: string, status: 0 | 1): string {
    return `${name}!${status}`;
  }
}
