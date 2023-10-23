import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(req.url, req?.query, req?.body, res?.status);
    if (req?.query?.name) {
      next();
    }
  }
}
