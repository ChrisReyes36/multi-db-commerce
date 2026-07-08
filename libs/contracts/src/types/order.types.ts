export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export type OrderItemResponse = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderResponse = {
  id: string;
  userId: string;
  items: OrderItemResponse[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};
