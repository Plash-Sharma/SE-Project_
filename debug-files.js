const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

(async () => {
  const files = await prisma.file.findMany({
    select: { id: true, name: true, ext: true, resource_type: true, public_id: true, version: true }
  });
  console.log('Files in database:');
  console.log(JSON.stringify(files, null, 2));
  await prisma.$disconnect();
})();
