import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
import { PersonModule } from './person/person.module';

async function bootstrap() {
  const app = await NestFactory.create(PersonModule);
  app.enableCors();
  await app.listen(9000);
}
bootstrap();
