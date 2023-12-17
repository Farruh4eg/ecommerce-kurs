-- CreateTable
CREATE TABLE "carts" (
    "cartid" SERIAL NOT NULL,
    "userid" TEXT,
    "productid" TEXT,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("cartid")
);

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("productid") ON DELETE CASCADE ON UPDATE CASCADE;
