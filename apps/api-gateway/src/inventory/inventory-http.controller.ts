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
import { INVENTORY_PATTERNS } from '@app/contracts/constants/patterns';
import { Role } from '@app/contracts/enums/roles';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { UpdateStockReservationRequestDto } from './dto/update-stock-reservation-request.dto';

type StockResponse = {
  id: string;
  productId: number;
  quantity: number;
  reserved: number;
  warehouseId: string;
  createdAt: Date;
  updatedAt: Date;
};

@Controller('inventory/stock')
export class InventoryHttpController {
  constructor(
    @Inject('INVENTORY_SERVICE')
    private readonly inventoryClient: ClientProxy,
  ) {}

  @Get(':productId')
  getStock(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<StockResponse | null> {
    return firstValueFrom(
      this.inventoryClient
        .send<StockResponse | null, number>(
          INVENTORY_PATTERNS.GET_STOCK,
          productId,
        )
        .pipe(timeout(5000)),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
  createStock(@Body() body: CreateStockRequestDto): Promise<StockResponse> {
    return firstValueFrom(
      this.inventoryClient
        .send<StockResponse, CreateStockRequestDto>(
          INVENTORY_PATTERNS.CREATE_STOCK,
          body,
        )
        .pipe(timeout(5000)),
    );
  }

  @Post('reserve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
  reserveStock(
    @Body() body: UpdateStockReservationRequestDto,
  ): Promise<StockResponse> {
    return firstValueFrom(
      this.inventoryClient
        .send<StockResponse, UpdateStockReservationRequestDto>(
          INVENTORY_PATTERNS.RESERVE_STOCK,
          body,
        )
        .pipe(timeout(5000)),
    );
  }

  @Post('release')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
  releaseStock(
    @Body() body: UpdateStockReservationRequestDto,
  ): Promise<StockResponse> {
    return firstValueFrom(
      this.inventoryClient
        .send<StockResponse, UpdateStockReservationRequestDto>(
          INVENTORY_PATTERNS.RELEASE_STOCK,
          body,
        )
        .pipe(timeout(5000)),
    );
  }
}
