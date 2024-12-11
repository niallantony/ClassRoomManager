/*
  Warnings:

  - Added the required column `name` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "teacher_id" INTEGER;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE CASCADE ON UPDATE NO ACTION;
