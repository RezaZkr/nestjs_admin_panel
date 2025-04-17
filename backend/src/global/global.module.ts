import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@global/services/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class GlobalModule {}
