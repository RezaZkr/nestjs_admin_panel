import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from '@user/services/user.service';
import { UserResourceDto } from '@user/dto/user-resource.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index(): Promise<UserResourceDto[]> {
    return this.userService.index();
  }

  @Get('/:id/show')
  async show(@Param('id', ParseIntPipe) id: number): Promise<UserResourceDto> {
    return this.userService.show(id);
  }
}
