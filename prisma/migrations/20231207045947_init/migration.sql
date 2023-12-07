/*
  Warnings:

  - You are about to drop the column `contactfname` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `contactlname` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `contacttitle` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "contactfname",
DROP COLUMN "contactlname",
DROP COLUMN "contacttitle",
ADD COLUMN     "logo" TEXT;
