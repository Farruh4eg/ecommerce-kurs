/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `postalcode` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postalcode",
ADD COLUMN     "addressid" INTEGER;

-- CreateTable
CREATE TABLE "addresses" (
    "addressid" SERIAL NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "postalcode" INTEGER NOT NULL,
    "address" VARCHAR(255) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("addressid")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressid_fkey" FOREIGN KEY ("addressid") REFERENCES "addresses"("addressid") ON DELETE NO ACTION ON UPDATE CASCADE;
