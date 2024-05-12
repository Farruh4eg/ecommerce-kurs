-- CreateEnum
CREATE TYPE "connection" AS ENUM ('WIFI', 'BLUETOOTH', 'USB', 'JACK');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "chargingpower" INTEGER,
ADD COLUMN     "connection" "connection",
ADD COLUMN     "iswired" BOOLEAN,
ADD COLUMN     "length" DOUBLE PRECISION;
