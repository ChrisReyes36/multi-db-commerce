import { Controller } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CATALOG_PATTERNS } from '@app/contracts/constants/patterns';
import { ProductResponse } from '@app/contracts/types/catalog.types';
import { CreateProductDto } from './dto/create-product.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern(CATALOG_PATTERNS.CREATE_PRODUCT)
  create(@Payload() payload: CreateProductDto): Promise<ProductResponse> {
    return this.catalogService.create(payload);
  }

  @MessagePattern(CATALOG_PATTERNS.FIND_PRODUCTS)
  findAll(): Promise<ProductResponse[]> {
    return this.catalogService.findAll();
  }

  @MessagePattern(CATALOG_PATTERNS.FIND_PRODUCT_BY_ID)
  findById(@Payload() id: number): Promise<ProductResponse> {
    return this.catalogService.findById(id);
  }
}
