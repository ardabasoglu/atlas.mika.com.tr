-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "converted_at" TIMESTAMP(3),
ADD COLUMN     "converted_by_user_id" TEXT;
