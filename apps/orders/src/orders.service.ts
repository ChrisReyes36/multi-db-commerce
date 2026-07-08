import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom, timeout } from 'rxjs';
import { Order } from './schemas/order.schema';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderItemResponse,
  OrderResponse,
} from '@app/contracts/types/order.types';
import { ProductResponse } from '@app/contracts/types/catalog.types';
import {
  CATALOG_PATTERNS,
  INVENTORY_PATTERNS,
  NOTIFICATION_PATTERNS,
} from '@app/contracts/constants/patterns';

type ReserveStockResponse = {
  id: string;
  productId: number;
  quantity: number;
  reserved: number;
  warehouseId: string;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,

    @Inject('CATALOG_SERVICE')
    private readonly catalogClient: ClientProxy,

    @Inject('INVENTORY_SERVICE')
    private readonly inventoryClient: ClientProxy,

    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const orderItems: OrderItemResponse[] = [];

    for (const item of dto.items) {
      const product = await firstValueFrom(
        this.catalogClient
          .send<ProductResponse, number>(
            CATALOG_PATTERNS.FIND_PRODUCT_BY_ID,
            item.productId,
          )
          .pipe(timeout(5000)),
      );

      await firstValueFrom(
        this.inventoryClient
          .send<ReserveStockResponse, { productId: number; quantity: number }>(
            INVENTORY_PATTERNS.RESERVE_STOCK,
            {
              productId: item.productId,
              quantity: item.quantity,
            },
          )
          .pipe(timeout(5000)),
      );

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * item.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });
    }

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    if (total <= 0) {
      throw new BadRequestException('La orden no tiene productos válidos');
    }

    const order = await this.orderModel.create({
      userId: dto.userId,
      items: orderItems,
      total,
      status: 'PENDING',
    });

    this.notificationsClient.emit(NOTIFICATION_PATTERNS.SEND_EMAIL, {
      to: dto.email,
      subject: 'Orden creada',
      body: `Tu orden ${order._id.toString()} fue creada correctamente.`,
    });

    return {
      id: order._id.toString(),
      userId: order.userId,
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async findMyOrders(userId: string): Promise<OrderResponse[]> {
    const orders = await this.orderModel.find({ userId }).sort({
      createdAt: -1,
    });

    return orders.map((order) => ({
      id: order._id.toString(),
      userId: order.userId,
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }
}
