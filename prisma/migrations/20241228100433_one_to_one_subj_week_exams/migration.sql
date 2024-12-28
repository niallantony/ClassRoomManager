/*
  Warnings:

  - You are about to drop the column `exam_id` on the `subj_week` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subject_id,week]` on the table `exams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `week` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subj_week" DROP CONSTRAINT "subj_week_exam_id_fkey";

-- AlterTable
ALTER TABLE "_lessonsTostudents" ADD CONSTRAINT "_lessonsTostudents_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_lessonsTostudents_AB_unique";

-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "week" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subj_week" DROP COLUMN "exam_id";

-- CreateIndex
CREATE UNIQUE INDEX "exams_subject_id_week_key" ON "exams"("subject_id", "week");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_subject_id_week_fkey" FOREIGN KEY ("subject_id", "week") REFERENCES "subj_week"("subject_id", "week") ON DELETE CASCADE ON UPDATE NO ACTION;
