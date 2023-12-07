/*
  Warnings:

  - You are about to drop the column `customerid` on the `orders` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerid_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customerid",
ADD COLUMN     "userid" TEXT;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "userid" DROP DEFAULT,
ALTER COLUMN "userid" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userid");
DROP SEQUENCE "users_userid_seq";

-- CreateTable
CREATE TABLE "ratings" (
    "ratingid" SERIAL NOT NULL,
    "userid" TEXT,
    "productid" TEXT,
    "rating" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("ratingid")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "wishlistid" SERIAL NOT NULL,
    "userid" TEXT,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("wishlistid")
);

-- CreateTable
CREATE TABLE "wishlistitems" (
    "wishlistid" INTEGER NOT NULL,
    "productid" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "wishlistitems_wishlistid_productid_key" ON "wishlistitems"("wishlistid", "productid");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wishlistitems" ADD CONSTRAINT "wishlistitems_wishlistid_fkey" FOREIGN KEY ("wishlistid") REFERENCES "wishlists"("wishlistid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wishlistitems" ADD CONSTRAINT "wishlistitems_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;
