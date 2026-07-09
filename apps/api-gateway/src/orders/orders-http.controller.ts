import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { ORDER_PATTERNS } from '@app/contracts/constants/patterns';
import type { JwtUser } from '@app/contracts/types/auth.types';
import { OrderResponse } from '@app/contracts/types/order.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';

type CreateOrderPayload = {
  userId: string;
  email: string;
  items: CreateOrderRequestDto['items'];
};

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersHttpController {
  constructor(
    @Inject('ORDERS_SERVICE')
    private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  createOrder(
    @CurrentUser() user: JwtUser,
    @Body() body: CreateOrderRequestDto,
  ): Promise<OrderResponse> {
    const payload: CreateOrderPayload = {
      userId: user.sub,
      email: user.email,
      items: body.items,
    };

    return firstValueFrom(
      this.ordersClient
        .send<OrderResponse, CreateOrderPayload>(
          ORDER_PATTERNS.CREATE_ORDER,
          payload,
        )
        .pipe(timeout(10000)),
    );
  }

  @Get('me')
  findMyOrders(@CurrentUser() user: JwtUser): Promise<OrderResponse[]> {
    return firstValueFrom(
      this.ordersClient
        .send<OrderResponse[], string>(ORDER_PATTERNS.FIND_MY_ORDERS, user.sub)
        .pipe(timeout(5000)),
    );
  }
}
