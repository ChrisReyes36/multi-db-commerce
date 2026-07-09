import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CATALOG_PATTERNS } from '@app/contracts/constants/patterns';
import { ProductResponse } from '@app/contracts/types/catalog.types';
import { Role } from '@app/contracts/enums/roles';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProductRequestDto } from './dto/create-product-request.dto';

@Controller('catalog/products')
export class CatalogHttpController {
  constructor(
    @Inject('CATALOG_SERVICE')
    private readonly catalogClient: ClientProxy,
  ) {}

  @Get()
  findAll(): Promise<ProductResponse[]> {
    return firstValueFrom(
      this.catalogClient
        .send<ProductResponse[], Record<string, never>>(
          CATALOG_PATTERNS.FIND_PRODUCTS,
          {},
        )
        .pipe(timeout(5000)),
    );
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponse> {
    return firstValueFrom(
      this.catalogClient
        .send<ProductResponse, number>(CATALOG_PATTERNS.FIND_PRODUCT_BY_ID, id)
        .pipe(timeout(5000)),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
  create(@Body() body: CreateProductRequestDto): Promise<ProductResponse> {
    return firstValueFrom(
      this.catalogClient
        .send<ProductResponse, CreateProductRequestDto>(
          CATALOG_PATTERNS.CREATE_PRODUCT,
          body,
        )
        .pipe(timeout(5000)),
    );
  }
}
