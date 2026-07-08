import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { INVENTORY_PATTERNS } from '@app/contracts/constants/patterns';
import { CreateStockDto } from './dto/create-stock.dto';
import { ReserveStockDto } from './dto/reserve-stock.dto';
import { ReleaseStockDto } from './dto/release-stock.dto';

type StockResponse = {
  id: string;
  productId: number;
  quantity: number;
  reserved: number;
  warehouseId: string;
  createdAt: Date;
  updatedAt: Date;
};

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern(INVENTORY_PATTERNS.CREATE_STOCK)
  createStock(@Payload() payload: CreateStockDto): Promise<StockResponse> {
    return this.inventoryService.createStock(payload);
  }

  @MessagePattern(INVENTORY_PATTERNS.RESERVE_STOCK)
  reserveStock(@Payload() payload: ReserveStockDto): Promise<StockResponse> {
    return this.inventoryService.reserveStock(payload);
  }

  @MessagePattern(INVENTORY_PATTERNS.RELEASE_STOCK)
  releaseStock(@Payload() payload: ReleaseStockDto): Promise<StockResponse> {
    return this.inventoryService.releaseStock(payload);
  }

  @MessagePattern(INVENTORY_PATTERNS.GET_STOCK)
  getStock(@Payload() productId: number): Promise<StockResponse | null> {
    return this.inventoryService.getStock(productId);
  }
}
