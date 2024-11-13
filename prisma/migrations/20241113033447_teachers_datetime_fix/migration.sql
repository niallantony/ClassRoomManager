/*
  Warnings:

  - Made the column `joined` on table `teachers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "joined" SET NOT NULL,
ALTER COLUMN "joined" SET DEFAULT CURRENT_TIMESTAMP;
