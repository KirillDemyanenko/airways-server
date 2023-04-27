import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  await app
    .listen(port)
    .then(() => console.log(`Start on port ${port}`))
    .catch((err) => console.log(err));
}
bootstrap()
  .then(() => console.log('App successfully started'))
  .catch((err) => console.log(err));
