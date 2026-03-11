-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "person_id" TEXT;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;
