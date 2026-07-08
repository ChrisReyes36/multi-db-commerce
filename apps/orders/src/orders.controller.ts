import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ORDER_PATTERNS } from '@app/contracts/constants/patterns';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponse } from '@app/contracts/types/order.types';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(ORDER_PATTERNS.CREATE_ORDER)
  createOrder(@Payload() payload: CreateOrderDto): Promise<OrderResponse> {
    return this.ordersService.createOrder(payload);
  }

  @MessagePattern(ORDER_PATTERNS.FIND_MY_ORDERS)
  findMyOrders(@Payload() userId: string): Promise<OrderResponse[]> {
    return this.ordersService.findMyOrders(userId);
  }
}
