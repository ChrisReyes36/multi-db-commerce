import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { OrderStatus } from '@app/contracts/types/order.types';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  productId!: number;

  @Prop({ required: true })
  productName!: string;

  @Prop({ required: true })
  quantity!: number;

  @Prop({ required: true })
  unitPrice!: number;

  @Prop({ required: true })
  subtotal!: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  timestamps: true,
  collection: 'orders',
})
export class Order {
  @Prop({ required: true })
  userId!: string;

  @Prop({
    type: [OrderItemSchema],
    default: [],
  })
  items!: OrderItem[];

  @Prop({ required: true })
  total!: number;

  @Prop({
    type: String,
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    default: 'PENDING',
  })
  status!: OrderStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
