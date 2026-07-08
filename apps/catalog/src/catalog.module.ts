import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.getOrThrow<string>('CATALOG_DB_HOST'),
        port: config.getOrThrow<number>('CATALOG_DB_PORT'),
        database: config.getOrThrow<string>('CATALOG_DB_NAME'),
        username: config.getOrThrow<string>('CATALOG_DB_USER'),
        password: config.getOrThrow<string>('CATALOG_DB_PASSWORD'),
        entities: [Product],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
