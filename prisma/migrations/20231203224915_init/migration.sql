-- CreateEnum
CREATE TYPE "frequencytype" AS ENUM ('GHz', 'MHz', 'KHz', 'Hz');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "cpufrequency" DOUBLE PRECISION,
ADD COLUMN     "cpufrequencyunit" "frequencytype",
ADD COLUMN     "ramamount" INTEGER,
ADD COLUMN     "ramunit" "memorytype";
