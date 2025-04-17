import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '@global/services/prisma.service';
import { UserResourceDto } from '@user/dto/user-resource.dto';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UserInterface } from '@user/interfaces/user.interface';
import { plainToInstance } from 'class-transformer';
import { hash } from '@global/utils/common.util';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async index(): Promise<UserResourceDto[]> {
    const users: UserInterface[] = await this.prismaService.user.findMany();

    return plainToInstance(UserResourceDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async show(id: number): Promise<UserResourceDto> {
    const foundUser: UserInterface = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return plainToInstance(UserResourceDto, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  async store(data: CreateUserDto): Promise<UserResourceDto> {
    const foundUser: UserInterface = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (foundUser) {
      throw new UnprocessableEntityException(`email ${data.email} already exists`);
    }

    data.password = await hash(data.password);

    const user: UserInterface = await this.prismaService.user.create({
      data: data,
    });

    return plainToInstance(UserResourceDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
