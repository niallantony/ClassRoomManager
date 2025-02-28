/*
  Warnings:

  - The primary key for the `stud_notes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[student_id,added]` on the table `stud_notes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "stud_notes" DROP CONSTRAINT "stud_notes_pkey",
ADD COLUMN     "note_id" SERIAL NOT NULL,
ADD CONSTRAINT "stud_notes_pkey" PRIMARY KEY ("note_id");

-- CreateIndex
CREATE UNIQUE INDEX "stud_notes_student_id_added_key" ON "stud_notes"("student_id", "added");
