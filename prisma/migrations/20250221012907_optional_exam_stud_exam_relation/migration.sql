/*
  Warnings:

  - The primary key for the `stud_exam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[student_id,exam_id]` on the table `stud_exam` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exam_name` to the `stud_exam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stud_exam" DROP CONSTRAINT "stud_exam_exam_id_fkey";

-- AlterTable
ALTER TABLE "stud_exam" DROP CONSTRAINT "stud_exam_pkey",
ADD COLUMN     "exam_name" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "exam_id" DROP NOT NULL,
ADD CONSTRAINT "stud_exam_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "stud_exam_student_id_exam_id_key" ON "stud_exam"("student_id", "exam_id");

-- AddForeignKey
ALTER TABLE "stud_exam" ADD CONSTRAINT "stud_exam_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("exam_id") ON DELETE SET NULL ON UPDATE NO ACTION;
