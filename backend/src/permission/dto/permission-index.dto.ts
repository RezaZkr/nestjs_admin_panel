import { IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from '@global/dto/offset-pagination/pagination-request.dto';

export class PermissionIndexDto extends PaginationRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  group?: string;
}
