-- AlterTable
ALTER TABLE "subj_week" ADD COLUMN     "exam_id" INTEGER;

-- AddForeignKey
ALTER TABLE "subj_week" ADD CONSTRAINT "subj_week_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("exam_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
