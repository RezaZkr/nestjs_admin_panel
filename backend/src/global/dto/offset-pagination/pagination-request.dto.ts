import { IsOptional, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequestDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) // Transform string to number
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(100)
  @Type(() => Number) // Transform string to number
  take?: number = 10;
}
