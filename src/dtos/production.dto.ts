import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  productionQuantity?: number;

  @IsOptional()
  @IsNumber()
  targetQuantity?: number;

  @IsOptional()
  @IsNumber()
  productionLines?: number;

  @IsOptional()
  @IsNumber()
  productionTime?: number;
}

export class UpdateProductionDto {
  @IsOptional()
  @IsString()
  @MinLength(0)
  name?: string;

  @IsOptional()
  @IsNumber()
  productionQuantity?: number;

  @IsOptional()
  @IsNumber()
  targetQuantity?: number;

  @IsOptional()
  @IsNumber()
  productionLines?: number;

  @IsOptional()
  @IsNumber()
  productionTime?: number;
}
