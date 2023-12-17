/*
  Warnings:

  - Added the required column `testAccessToken` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "testAccessToken" JSONB NOT NULL;
