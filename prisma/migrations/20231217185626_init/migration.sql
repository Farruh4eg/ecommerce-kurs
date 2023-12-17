/*
  Warnings:

  - You are about to drop the `wishlistitems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "wishlistitems" DROP CONSTRAINT "wishlistitems_productid_fkey";

-- DropForeignKey
ALTER TABLE "wishlistitems" DROP CONSTRAINT "wishlistitems_wishlistid_fkey";

-- DropForeignKey
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_userid_fkey";

-- AlterTable
ALTER TABLE "wishlists" ADD COLUMN     "productid" TEXT;

-- DropTable
DROP TABLE "wishlistitems";

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("productid") ON DELETE CASCADE ON UPDATE CASCADE;
