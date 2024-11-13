-- CreateTable
CREATE TABLE "exams" (
    "exam_id" SERIAL NOT NULL,
    "marks" INTEGER NOT NULL,
    "file" VARCHAR,
    "percent" INTEGER NOT NULL,
    "type" VARCHAR NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("exam_id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "lesson_id" SERIAL NOT NULL,
    "teacher_id" INTEGER,
    "semester" SMALLINT NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "attendance" SMALLINT NOT NULL,
    "classroom" VARCHAR,
    "class_start" TIME(6) NOT NULL,
    "year" SMALLINT NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("lesson_id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "stud_exam" (
    "student_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "points" INTEGER,

    CONSTRAINT "stud_exam_pkey" PRIMARY KEY ("student_id","exam_id")
);

-- CreateTable
CREATE TABLE "stud_less" (
    "student_id" INTEGER NOT NULL,
    "lesson_id" INTEGER NOT NULL,

    CONSTRAINT "stud_less_pkey" PRIMARY KEY ("student_id","lesson_id")
);

-- CreateTable
CREATE TABLE "stud_notes" (
    "student_id" INTEGER NOT NULL,
    "added" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "stud_notes_pkey" PRIMARY KEY ("student_id","added")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" INTEGER NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "subj_exam" (
    "subject_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,

    CONSTRAINT "subj_exam_pkey" PRIMARY KEY ("subject_id","exam_id")
);

-- CreateTable
CREATE TABLE "subj_week" (
    "subject_id" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "subj_week_pkey" PRIMARY KEY ("subject_id","week")
);

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" SERIAL NOT NULL,
    "textbook" VARCHAR(255),
    "description" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "teacher_id" INTEGER,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "teacher_id" SERIAL NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "joined" TIMESTAMP(6),

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateIndex
CREATE INDEX "idx_session_expire" ON "session"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "unique_name_id" ON "subjects"("teacher_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stud_exam" ADD CONSTRAINT "stud_exam_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("exam_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stud_exam" ADD CONSTRAINT "stud_exam_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stud_less" ADD CONSTRAINT "stud_less_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("lesson_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stud_less" ADD CONSTRAINT "stud_less_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stud_notes" ADD CONSTRAINT "stud_notes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subj_exam" ADD CONSTRAINT "subj_exam_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("exam_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subj_exam" ADD CONSTRAINT "subj_exam_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subj_week" ADD CONSTRAINT "subj_week_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "fk_teacher_id" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE CASCADE ON UPDATE NO ACTION;
