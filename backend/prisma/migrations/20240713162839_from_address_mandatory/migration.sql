/*
  Warnings:

  - Made the column `fromAddress` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "fromAddress" SET NOT NULL;
