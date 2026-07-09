import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const schema = process.env.PRISMA_SCHEMA ?? 'apps/auth/prisma/schema.prisma';

export default defineConfig({
  schema,
  migrations: {
    path: schema.includes('apps/auth')
      ? 'apps/auth/prisma/migrations'
      : 'apps/inventory/prisma/migrations',
  },
  datasource: {
    url: schema.includes('apps/auth')
      ? process.env.AUTH_DATABASE_URL!
      : process.env.INVENTORY_DATABASE_URL!,
  },
});
