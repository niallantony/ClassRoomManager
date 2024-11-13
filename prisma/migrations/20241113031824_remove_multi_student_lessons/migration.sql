/*
  Warnings:

  - You are about to drop the `stud_less` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stud_less" DROP CONSTRAINT "stud_less_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "stud_less" DROP CONSTRAINT "stud_less_student_id_fkey";

-- DropTable
DROP TABLE "stud_less";

-- CreateTable
CREATE TABLE "_lessonsTostudents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_lessonsTostudents_AB_unique" ON "_lessonsTostudents"("A", "B");

-- CreateIndex
CREATE INDEX "_lessonsTostudents_B_index" ON "_lessonsTostudents"("B");

-- AddForeignKey
ALTER TABLE "_lessonsTostudents" ADD CONSTRAINT "_lessonsTostudents_A_fkey" FOREIGN KEY ("A") REFERENCES "lessons"("lesson_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_lessonsTostudents" ADD CONSTRAINT "_lessonsTostudents_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;
