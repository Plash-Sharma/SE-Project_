import prisma from "./src/lib/prisma";

(async () => {
  const files = await prisma.file.findMany({
    select: { id: true, name: true, ext: true, resource_type: true, public_id: true, version: true }
  });
  console.log('Files in database:');
  console.log(JSON.stringify(files, null, 2));
  process.exit(0);
})();
