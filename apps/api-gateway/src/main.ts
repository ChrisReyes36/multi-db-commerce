import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { ApiGatewayModule } from './api-gateway.module';
import { appValidationPipe } from '@app/common/pipes/app-validation.pipe';
import { HttpGlobalExceptionFilter } from '@app/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(appValidationPipe);
  app.useGlobalFilters(new HttpGlobalExceptionFilter());

  await app.listen(config.get<number>('API_GATEWAY_PORT') ?? 3000);
}
bootstrap();
