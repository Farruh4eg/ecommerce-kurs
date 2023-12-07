-- CreateEnum
CREATE TYPE "devicetype" AS ENUM ('SMARTPHONE', 'CELLPHONE', 'TABLET', 'HEADPHONE', 'CHARGER', 'CABLE', 'PLAYER', 'WATCH');

-- CreateEnum
CREATE TYPE "simtype" AS ENUM ('MINI_SIM', 'MICRO_SIM', 'NANO_SIM', 'ESIM');

-- CreateEnum
CREATE TYPE "memorytype" AS ENUM ('TB', 'GB', 'MB', 'KB');

-- CreateTable
CREATE TABLE "orderdetails" (
    "orderdetailid" SERIAL NOT NULL,
    "orderid" INTEGER,
    "productid" INTEGER,
    "price" INTEGER,
    "quantity" INTEGER,
    "total" INTEGER,

    CONSTRAINT "orderdetails_pkey" PRIMARY KEY ("orderdetailid")
);

-- CreateTable
CREATE TABLE "orders" (
    "orderid" SERIAL NOT NULL,
    "customerid" INTEGER,
    "orderdate" DATE DEFAULT CURRENT_TIMESTAMP,
    "fulfilled" BOOLEAN,
    "deleted" BOOLEAN,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orderid")
);

-- CreateTable
CREATE TABLE "products" (
    "productid" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "instock" BOOLEAN NOT NULL,
    "supplierid" INTEGER,
    "sku" VARCHAR(255),
    "discountavailable" BOOLEAN,
    "discount" DECIMAL,
    "producttype" "devicetype",
    "releaseyear" SMALLINT,
    "color" CHAR(7),
    "memoryamount" INTEGER,
    "memoryunit" VARCHAR(10),
    "sdslot" BOOLEAN,
    "cameracount" SMALLINT,
    "cameraresolution" SMALLINT,
    "frontcameraresolution" INTEGER,
    "os" VARCHAR(50),
    "osversion" VARCHAR(100),
    "cpumodel" VARCHAR(100),
    "cpucores" INTEGER,
    "simtype" "simtype",
    "simcount" SMALLINT,
    "displaysize" DOUBLE PRECISION,
    "displayheight" INTEGER,
    "displaywidth" INTEGER,
    "refreshrate" INTEGER,
    "batterytype" TEXT,
    "batterycapacity" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "thickness" INTEGER,
    "weight" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("productid")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "supplierid" SERIAL NOT NULL,
    "companyname" VARCHAR(255) NOT NULL,
    "contactlname" VARCHAR(100) NOT NULL,
    "contactfname" VARCHAR(100) NOT NULL,
    "contacttitle" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "postalcode" INTEGER NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "producttype" "devicetype"[],

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("supplierid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "salt" VARCHAR(64) NOT NULL,
    "privileges" VARCHAR(100) NOT NULL DEFAULT 'default',
    "email" VARCHAR(255),
    "lastname" VARCHAR(255),
    "firstname" VARCHAR(255),
    "birthdate" DATE,
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "postalcode" INTEGER,
    "address" VARCHAR(255),
    "datecreated" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- AddForeignKey
ALTER TABLE "orderdetails" ADD CONSTRAINT "orderdetails_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "orders"("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orderdetails" ADD CONSTRAINT "orderdetails_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerid_fkey" FOREIGN KEY ("customerid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplierid_fkey" FOREIGN KEY ("supplierid") REFERENCES "suppliers"("supplierid") ON DELETE NO ACTION ON UPDATE NO ACTION;
