-- AlterTable
ALTER TABLE "suppliers" ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "postalcode" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;
