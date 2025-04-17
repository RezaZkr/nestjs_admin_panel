import { IsOptional, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Transform string to number
  take?: number = 10;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Transform string to number
  cursor?: string;
}
