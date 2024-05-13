-- DropForeignKey
ALTER TABLE "orderdetails" DROP CONSTRAINT "orderdetails_productid_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userid_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_productid_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_userid_fkey";

-- AddForeignKey
ALTER TABLE "orderdetails" ADD CONSTRAINT "orderdetails_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("productid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("productid") ON DELETE CASCADE ON UPDATE CASCADE;
