import { IsInt, Min } from 'class-validator';

export class UpdateStockReservationRequestDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}
