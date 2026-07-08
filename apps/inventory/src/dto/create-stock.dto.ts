import { IsInt, IsString, Min } from 'class-validator';

export class CreateStockDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsString()
  warehouseId!: string;
}
