import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as ejs from 'ejs';

async function bootstrap() {
  const port = process.env.PORT || 9002;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'ejs');
  await app
    .listen(port)
    .then(() => console.log(`Start on port ${port}`))
    .catch((err) => console.log(err));
}
bootstrap()
  .then(() => console.log('App successfully started'))
  .catch((err) => console.log(err));
