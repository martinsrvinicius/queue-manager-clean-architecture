import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Create a tenant with the ID used in tests
    const tenant = await prisma.tenant.upsert({
      where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      update: {},
      create: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Tenant',
      },
    });

    console.log('Tenant created/updated:', tenant);

    // Create a queue for the tenant
    const queue = await prisma.queue.upsert({
      where: { id: '123e4567-e89b-12d3-a456-426614174001' },
      update: {},
      create: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        tenantId: tenant.id,
        name: 'Main Queue',
      },
    });

    console.log('Queue created/updated:', queue);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
