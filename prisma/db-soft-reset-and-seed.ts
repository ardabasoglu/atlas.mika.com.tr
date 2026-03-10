import { prisma } from "@/lib/prisma";
import { runSeed } from "./seed";

async function softResetDatabase(): Promise<void> {
  console.log("Starting soft database reset (runtime CRM data only)...");

  await prisma.timelineEvent.deleteMany();
  await prisma.paymentPlan.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.person.deleteMany();
  await prisma.project.deleteMany();
  await prisma.lead.deleteMany();

  console.log("Soft reset completed. Running seed...");
  await runSeed();
  console.log("Seed completed.");
}

softResetDatabase()
  .catch((error) => {
    console.error("Soft reset and seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

