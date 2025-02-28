const {
  PrismaClientKnownRequestError,
} = require("@prisma/client/runtime/library");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

const Subject = () => {
  const queryId = async (teacher_id, id) => {
    const result = await prisma.subjects.findUnique({
      where: {
        subject_id: +id,
        teacher_id: +teacher_id,
      },
    });
    return result;
  };

  const queryIdWithExams = async (teacher_id, id) => {
    const result = await prisma.subjects.findUnique({
      where: {
        subject_id: +id,
        teacher_id: +teacher_id,
      },
      include: {
        exams: {
          select: {
            exam_id: true,
            name: true,
            marks: true,
            percent: true,
          },
        },
      },
    });
    return result;
  };

  const querySubjectInfoAll = async (teacher_id, id) => {
    const result = await prisma.subjects.findUnique({
      where: {
        subject_id: +id,
        teacher_id: +teacher_id,
      },
      include: {
        exams: {
          select: {
            exam_id: true,
            name: true,
            marks: true,
            percent: true,
            subj_week: true,
          },
        },
        subj_week: {
          select: {
            week: true,
            description: true,
            exam: true,
          },
        },
        lessons: {
          select: {
            name: true,
            semester: true,
            year: true,
          },
        },
      },
    });
    return result;
  };

  const queryWeek = async (teacher_id, subject_id, week) => {
    return prisma.$transaction(async (tx) => {
      const subject = await tx.subjects.findUnique({
        where: {
          subject_id: +subject_id,
          teacher_id: +teacher_id,
        },
      });
      const weekData = await tx.subj_week.findUnique({
        where: {
          subject_id_week: {
            subject_id: +subject_id,
            week: +week,
          },
        },
        include: {
          exam: true,
        },
      });
      return weekData;
    });
  };

  const queryAll = async (id) => {
    const res = await prisma.subjects.findMany({
      where: {
        teacher_id: id,
      },
    });
    return res;
  };

  const queryNames = async (id) => {
    const res = await prisma.subjects.findMany({
      where: {
        teacher_id: id,
      },
      select: {
        name: true,
        subject_id: true,
      },
    });
    return res;
  };

  const queryWeeks = async (subject_id) => {
    const res = await prisma.subj_week.findMany({
      where: {
        subject_id: subject_id,
      },
      orderBy: {
        week: "asc",
      },
      select: {
        week: true,
      },
    });
    return res;
  };

  const insert = async (args) => {
    const subject = await prisma.subjects.create({ data: args });
    return subject;
  };

  const insertWithWeeks = async (args) => {
    await prisma.$transaction(async (tx) => {
      const subject = await tx.subjects.create({
        data: {
          teacher_id: args.teacher_id,
          textbook: args.textbook,
          description: args.description,
          name: args.name,
        },
      });
      const weeks = [];
      console.log(subject);
      for (let i = 0; i < args.weeks; i++) {
        weeks.push({
          subject_id: subject.subject_id,
          week: i + 1,
        });
      }
      await tx.subj_week.createMany({
        data: weeks,
      });
    });
  };

  const deleteId = async (id) => {
    try {
      const res = await prisma.subjects.delete({
        where: {
          subject_id: +id,
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2003") {
          throw e;
        }
      }
      console.log(e);
    }
  };

  const updateWeek = async (teacher_id, subject_id, week_id, description) => {
    return prisma.$transaction(async (tx) => {
      await tx.subjects.findUnique({
        where: {
          subject_id: +subject_id,
          teacher_id: +teacher_id,
        },
      });
      await tx.subj_week.update({
        where: {
          subject_id_week: {
            subject_id: +subject_id,
            week: +week_id,
          },
        },
        data: {
          description: description,
        },
      });
    });
  };

  const update = async (teacher_id, id, args) => {
    try {
      const res = await prisma.subjects.update({
        where: {
          subject_id: +id,
          teacher_id: +teacher_id,
        },
        data: args,
      });
      return res;
    } catch (e) {
      console.log(e);
    }
  };

  return {
    querySubjectInfoAll,
    update,
    updateWeek,
    deleteId,
    queryId,
    queryIdWithExams,
    queryAll,
    queryNames,
    insert,
    insertWithWeeks,
    queryWeek,
    queryWeeks,
  };
};

const Lesson = () => {
  const queryAll = async (id, active) => {
    const res = await prisma.lessons.findMany({
      where: {
        teacher_id: id,
      },
      include: {
        subjects: true,
        students: true,
      },
    });
    if (active) {
      const active = [];
      res.forEach((lesson) => {
        if (isActive(lesson.year, lesson.semester) || lesson.forceactive) {
          active.push(lesson);
        }
      });
      return active;
    }
    return res;
  };

  const getExams = async (teacher_id, lesson_id) => {
    const lesson = await prisma.lessons.findFirst({
      where: {
        teacher_id: teacher_id,
        lesson_id: lesson_id,
      },
    });
    const exams = await prisma.exams.findMany({
      where: {
        subject_id: lesson.subject_id,
      },
    });
    return exams;
  };

  const isActive = (year, semester) => {
    const now = new Date();
    const months = [
      [2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11],
    ];
    return (
      (now.getFullYear() === year &&
        months[semester - 1].includes(now.getMonth())) ||
      (now.getFullYear() === year + 1 && now.getMonth() < 3 && semester === 2)
    );
  };

  const getNames = async (id) => {
    const res = await prisma.lessons.findMany({
      where: {
        teacher_id: id,
      },
      select: {
        name: true,
        lesson_id: true,
      },
    });
    return res;
  };

  const queryId = async (teacher_id, id) => {
    const res = await prisma.lessons.findFirst({
      where: {
        teacher_id: teacher_id,
        lesson_id: id,
      },
      include: {
        subjects: true,
      },
    });
    return res;
  };

  const getResults = async (teacher_id, lesson_id, exam_id) => {
    const res = await prisma.$transaction(async (ts) => {
      const lesson = await ts.lessons.findFirst({
        where: {
          teacher_id: teacher_id,
          lesson_id: lesson_id,
        },
        include: {
          students: true,
        },
      });
      const results = await Promise.all(
        lesson.students.map(async (student) => {
          const studentResult = await ts.stud_exam.findFirst({
            where: {
              student_id: student.student_id,
              exam_id: exam_id,
            },
            select: {
              points: true,
            },
          });
          return { [student.student_id]: studentResult.points };
        })
      );
      const resultsObject = Object.assign({}, ...results);
      return resultsObject;
    });
    return res;
  };

  const insert = async (args) => {
    const lesson = await prisma.lessons.create({ data: args });
    return lesson;
  };

  const deleteId = async (teacher_id, id) => {
    const lesson = await prisma.lessons.delete({
      where: {
        teacher_id: +teacher_id,
        lesson_id: +id,
      },
    });
    return lesson;
  };

  const update = async (teacher_id, id, args) => {
    const res = await prisma.lessons.update({
      where: {
        lesson_id: id,
        teacher_id: teacher_id,
      },
      data: args,
    });
    return res;
  };

  return {
    getNames,
    getExams,
    update,
    deleteId,
    queryAll,
    queryId,
    insert,
    getResults,
  };
};

const User = () => {
  const insert = async (args) => {
    const user = await prisma.teachers.create({ data: args });
    console.log(user);
  };

  const queryEmail = async (email) => {
    const result = await prisma.teachers.findUnique({
      where: {
        email: email,
      },
    });
    return result;
  };

  const queryId = async (id) => {
    const result = await prisma.teachers.findUnique({
      where: {
        teacher_id: id,
      },
    });
    return result;
  };

  return {
    insert,
    queryEmail,
    queryId,
  };
};

const Exam = () => {
  const insert = async (args) => {
    const exam = await prisma.exams.create({ data: args });
    return exam;
  };

  const queryExams = async (teacher_id, subject_id) => {
    const exams = await prisma.$transaction(async (ts) => {
      await ts.subjects.findFirst({
        where: {
          teacher_id: teacher_id,
          subject_id: subject_id,
        },
      });
      const exams = await ts.exams.findMany({
        where: {
          subject_id: subject_id,
        },
      });
      return exams;
    });
    return exams;
  };

  const updateGrades = async (teacher_id, exam_id, grades) => {
    const subject = await prisma.subjects.findFirst({
      where: {
        teacher_id: teacher_id,
        exams: {
          some: {
            exam_id: exam_id,
          },
        },
      },
    });
    if (!subject) {
      return { error: "Unauthorised" };
    }
    const updated = await Promise.all(
      Object.keys(grades).map(async (student) => {
        const res = await prisma.stud_exam.update({
          where: {
            student_id_exam_id: {
              exam_id: exam_id,
              student_id: +student,
            },
          },
          data: {
            points: +grades[student],
          },
        });
        return res;
      })
    );
    return updated;
  };

  const insertToWeek = async (args) => {
    const result = await prisma.$transaction(async (ts) => {
      const exam = await ts.exams.create({
        data: {
          name: args.name,
          marks: args.marks,
          subject_id: args.subject_id,
          percent: args.percent,
          type: args.type,
          week: args.week,
        },
      });

      const lessons = await ts.lessons.findMany({
        where: {
          subject_id: args.subject_id,
        },
        include: {
          students: true,
        },
      });
      const studentExams = [];
      lessons.forEach((lesson) => {
        lesson.students.forEach((student) => {
          studentExams.push({
            student_id: student.student_id,
            exam_id: exam.exam_id,
            exam_name: exam.name,
          });
        });
      });

      if (studentExams.length > 0) {
        await ts.stud_exam.createMany({
          data: studentExams,
        });
      }
    });
    return result;
  };

  const queryId = async (teacher_id, id) => {
    const result = await prisma.$transaction(async (ts) => {
      const subject = await ts.subjects.findFirst({
        where: {
          teacher_id: +teacher_id,
          exams: {
            some: {
              exam_id: +id,
            },
          },
        },
      });
      const exam = await ts.exams.findUnique({
        where: {
          exam_id: +id,
          subject_id: subject.subject_id,
        },
        include: {
          subjects: true,
        },
      });
      return exam;
    });
    return result;
  };

  const update = async (teacher_id, exam_id, args) => {
    return prisma.$transaction(async (ts) => {
      await ts.subjects.findFirst({
        where: {
          teacher_id: +teacher_id,
          exams: {
            some: {
              exam_id: +exam_id,
            },
          },
        },
      });
      const exam = await ts.exams.update({
        where: {
          exam_id: +exam_id,
        },
        data: args,
      });
      return exam;
    });
  };

  const deleteId = async (teacher_id, id) => {
    return prisma.$transaction(async (ts) => {
      const subject = ts.subjects.findFirst({
        where: {
          teacher_id: +teacher_id,
          exams: {
            some: {
              exam_id: +id,
            },
          },
        },
      });
      const exam = await ts.exams.delete({
        where: {
          exam_id: +id,
        },
      });
      return exam;
    });
  };

  return {
    update,
    insert,
    queryExams,
    queryId,
    deleteId,
    insertToWeek,
    updateGrades,
  };
};

const Student = () => {
  const insert = async (args) => {
    const res = await prisma.$transaction(async (ts) => {
      await ts.students.create({
        data: {
          name: args.name,
          student_id: args.student_id,
          teacher_id: args.teacher_id,
          lessons: {
            connect: [{ lesson_id: args.lesson_id }],
          },
        },
      });
      const subject = await ts.lessons.findFirst({
        where: {
          lesson_id: args.lesson_id,
        },
        select: {
          subject_id: true,
        },
      });
      const exams = await ts.exams.findMany({
        where: {
          subject_id: subject.subject_id,
        },
        select: {
          exam_id: true,
          name: true,
        },
      });
      const studentExams = [];
      exams.forEach((exam) => {
        studentExams.push({
          exam_name: exam.name,
          exam_id: exam.exam_id,
          student_id: args.student_id,
        });
      });
      if (studentExams.length > 0) {
        await ts.stud_exam.createMany({
          data: studentExams,
        });
      }
    });
    return res;
  };

  const insertNote = async (args) => {
    const res = await prisma.stud_notes.create({
      data: {
        student_id: args.student_id,
        added: args.added,
        description: args.description,
      },
    });
    return res;
  };

  const deleteNote = async (note_id) => {
    const res = await prisma.stud_notes.delete({
      where: {
        note_id: note_id,
      },
    });
    return res;
  };

  const updateNote = async (note_id, args) => {
    const res = await prisma.stud_notes.update({
      where: {
        note_id: note_id,
      },
      data: args,
    });
    return res;
  };

  const queryStudentNotes = async (student_id) => {
    const res = await prisma.stud_notes.findMany({
      where: {
        student_id: student_id,
      },
    });
    return res;
  };

  const queryExists = async (id) => {
    const res = await prisma.students.findUnique({
      where: {
        student_id: id,
      },
    });
    return res;
  };

  const queryId = async (teacher_id, id) => {
    const res = await prisma.students.findUnique({
      where: {
        student_id: id,
        teacher_id: teacher_id,
      },
      include: {
        lessons: true,
        stud_notes: true,
      },
    });
    return res;
  };

  const update = async (teacher_id, id, args) => {
    const res = await prisma.students.update({
      where: {
        student_id: id,
        teacher_id: teacher_id,
      },
      data: {
        name: args.name,
      },
    });
    return res;
  };

  const getInLesson = async (teacher_id, lesson_id) => {
    const res = await prisma.students.findMany({
      where: {
        lessons: {
          some: {
            lesson_id: lesson_id,
            teacher_id: +teacher_id,
          },
        },
      },
    });
    return res;
  };

  const deleteId = async (teacher_id, student_id) => {
    const res = await prisma.students.delete({
      where: {
        teacher_id: teacher_id,
        student_id: student_id,
      },
    });
    return res;
  };

  const getExams = async (teacher_id, student_id) => {
    const res = await prisma.$transaction(async (ts) => {
      await ts.students.findFirst({
        where: {
          teacher_id: teacher_id,
          student_id: student_id,
        },
      });
      const exams = await ts.stud_exam.findMany({
        where: {
          student_id: student_id,
        },
      });
      return exams;
    });
    return res;
  };

  return {
    getExams,
    deleteId,
    insert,
    queryId,
    getInLesson,
    queryExists,
    update,
    insertNote,
    deleteNote,
    updateNote,
    queryStudentNotes,
  };
};

module.exports = {
  Subject,
  Lesson,
  User,
  Exam,
  Student,
};
