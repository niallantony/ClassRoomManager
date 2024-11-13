/*
  Warnings:

  - You are about to drop the `subj_exam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subject_id` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subj_exam" DROP CONSTRAINT "subj_exam_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "subj_exam" DROP CONSTRAINT "subj_exam_subject_id_fkey";

-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "subject_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "subj_exam";

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE NO ACTION;
