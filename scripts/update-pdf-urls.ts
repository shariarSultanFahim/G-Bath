import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const assessments = await prisma.assessment.findMany({
    where: {
      pdfUrl: {
        startsWith: '/uploads'
      }
    }
  });

  console.log(`Found ${assessments.length} assessments to update.`);

  for (const assessment of assessments) {
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        pdfUrl: `/api/assessments/${assessment.id}/download-pdf`
      }
    });
    console.log(`Updated assessment ${assessment.id}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
