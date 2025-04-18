import { PrismaClient } from './generated/client';
import * as bcrypt from 'bcrypt';
import { UserInterface } from '@user/interfaces/user.interface';
import { PermissionInterface } from '../src/permission/interfaces/permission.interface';

const prisma = new PrismaClient();

async function main() {
  const adminUser: UserInterface = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'admin',
      password: await hash('12345678'),
    },
  });

  const permissions: PermissionInterface[] = [
    {
      name: 'view_users',
      label: 'view user',
      group: 'user',
    },
    {
      name: 'edit_users',
      label: 'edit user',
      group: 'user',
    },
    {
      name: 'delete_users',
      label: 'delete user',
      group: 'user',
    },
    //////////////////////role
    {
      name: 'view_roles',
      label: 'view role',
      group: 'role',
    },
    {
      name: 'edit_roles',
      label: 'edit role',
      group: 'role',
    },
    {
      name: 'delete_roles',
      label: 'delete role',
      group: 'role',
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {
        label: permission.label,
        group: permission.group,
      },
      create: permission,
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
    },
  });

  const allPermissions = await prisma.permission.findMany();

  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: perm.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: perm.id,
      },
    });
  }

  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: adminRole.id,
      },
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: adminRole.id,
    },
  });

  console.log('✅ Roles and permissions seeded');
}

const hash = async (plainText: string, saltOrRounds: number = 10): Promise<string> => {
  return await bcrypt.hash(plainText, saltOrRounds);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
