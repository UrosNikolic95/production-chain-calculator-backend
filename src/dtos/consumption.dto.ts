import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateConsumptionDto {
  @IsInt()
  productionId: number;

  @IsOptional()
  @IsInt()
  consumedProductionId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class UpdateConsumptionDto {
  @IsOptional()
  @IsInt()
  consumedProductionId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
