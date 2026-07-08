import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryPrismaService } from '@app/common/prisma/inventory-prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { ReserveStockDto } from './dto/reserve-stock.dto';
import { ReleaseStockDto } from './dto/release-stock.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: InventoryPrismaService) {}

  createStock(dto: CreateStockDto) {
    return this.prisma.stock.create({
      data: dto,
    });
  }

  async reserveStock(dto: ReserveStockDto) {
    return this.prisma.$transaction(async (tx) => {
      const stock = await tx.stock.findUnique({
        where: { productId: dto.productId },
      });

      if (!stock) {
        throw new NotFoundException('Stock no encontrado');
      }

      const available = stock.quantity - stock.reserved;

      if (available < dto.quantity) {
        throw new BadRequestException('Stock insuficiente');
      }

      return tx.stock.update({
        where: { productId: dto.productId },
        data: {
          reserved: {
            increment: dto.quantity,
          },
        },
      });
    });
  }

  async releaseStock(dto: ReleaseStockDto) {
    const stock = await this.prisma.stock.findUnique({
      where: { productId: dto.productId },
    });

    if (!stock) {
      throw new NotFoundException('Stock no encontrado');
    }

    if (stock.reserved < dto.quantity) {
      throw new BadRequestException(
        'No puedes liberar más stock del reservado',
      );
    }

    return this.prisma.stock.update({
      where: { productId: dto.productId },
      data: {
        reserved: {
          decrement: dto.quantity,
        },
      },
    });
  }

  getStock(productId: number) {
    return this.prisma.stock.findUnique({
      where: { productId },
    });
  }
}
