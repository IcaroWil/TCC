/*
  Warnings:

  - You are about to drop the column `cnpj` on the `establishments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document]` on the table `establishments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `business_category_id` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_type` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcategory` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessCategoryType" AS ENUM ('BEAUTY_AESTHETICS', 'HEALTH_WELLNESS', 'PROFESSIONAL_SERVICES', 'EDUCATION_TRAINING', 'OTHER');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- DropIndex
DROP INDEX "establishments_cnpj_key";

-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "cnpj",
ADD COLUMN     "business_category_id" TEXT NOT NULL,
ADD COLUMN     "business_type" "BusinessType" NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "document" TEXT NOT NULL,
ADD COLUMN     "social_media" JSONB,
ADD COLUMN     "subcategory" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "business_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BusinessCategoryType" NOT NULL,
    "description" TEXT NOT NULL,
    "subcategories" TEXT[],
    "default_settings" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "establishment_settings" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "working_hours" JSONB NOT NULL,
    "appointment_settings" JSONB NOT NULL,
    "payment_settings" JSONB NOT NULL,
    "notification_settings" JSONB NOT NULL,
    "custom_fields" JSONB NOT NULL,
    "integrations" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishment_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_settings_establishment_id_key" ON "establishment_settings"("establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "establishments_document_key" ON "establishments"("document");

-- AddForeignKey
ALTER TABLE "establishments" ADD CONSTRAINT "establishments_business_category_id_fkey" FOREIGN KEY ("business_category_id") REFERENCES "business_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_settings" ADD CONSTRAINT "establishment_settings_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
