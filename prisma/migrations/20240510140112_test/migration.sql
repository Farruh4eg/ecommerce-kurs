/*
  Warnings:

  - Made the column `userid` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productid` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderid` on table `orderdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productid` on table `orderdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userid` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `supplierid` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userid` on table `ratings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productid` on table `ratings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addressid` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userid` on table `wishlists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productid` on table `wishlists` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "userid" SET NOT NULL,
ALTER COLUMN "productid" SET NOT NULL;

-- AlterTable
ALTER TABLE "orderdetails" ALTER COLUMN "orderid" SET NOT NULL,
ALTER COLUMN "productid" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "userid" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "supplierid" SET NOT NULL;

-- AlterTable
ALTER TABLE "ratings" ALTER COLUMN "userid" SET NOT NULL,
ALTER COLUMN "productid" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "addressid" SET NOT NULL;

-- AlterTable
ALTER TABLE "wishlists" ALTER COLUMN "userid" SET NOT NULL,
ALTER COLUMN "productid" SET NOT NULL;
