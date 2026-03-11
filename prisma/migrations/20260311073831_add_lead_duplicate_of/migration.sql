-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "duplicate_of_lead_id" TEXT;

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_phone_idx" ON "leads"("phone");

-- CreateIndex
CREATE INDEX "leads_duplicate_of_lead_id_idx" ON "leads"("duplicate_of_lead_id");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_duplicate_of_lead_id_fkey" FOREIGN KEY ("duplicate_of_lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
