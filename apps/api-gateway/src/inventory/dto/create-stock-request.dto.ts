import { IsInt, IsString, Min } from 'class-validator';

export class CreateStockRequestDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsString()
  warehouseId!: string;
}
