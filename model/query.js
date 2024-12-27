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
            subj_week: {
              where: {
                subject_id: +id,
              },
            },
          },
        },
        subj_week: {
          select: {
            week: true,
            description: true,
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
  const queryAll = async (id) => {
    const res = await prisma.lessons.findMany({
      where: {
        teacher_id: id,
      },
      include: {
        subjects: true,
        students: true,
      },
    });
    return res;
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

  const insert = async (args) => {
    console.log(args);
    const lesson = await prisma.lessons.create({ data: args });
    console.log(lesson);
  };

  const deleteId = async (id) => {
    const lesson = await prisma.lessons.delete({
      where: {
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
    update,
    deleteId,
    queryAll,
    queryId,
    insert,
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

  const insertToWeek = async (args) => {
    const exam = await prisma.exams.create({
      data: {
        name: args.name,
        marks: args.marks,
        subject_id: args.subject_id,
        percent: args.percent,
        type: args.type,
        subj_week: {
          connect: [
            {
              subject_id_week: {
                subject_id: args.subject_id,
                week: args.week,
              },
            },
          ],
        },
      },
    });
    return exam;
  };

  const queryId = async (id) => {
    const result = await prisma.exams.findUnique({
      where: {
        exam_id: +id,
      },
      include: {
        subjects: true,
      },
    });
    return result;
  };

  const update = async (id, args) => {
    try {
      const res = await prisma.exams.update({
        where: {
          exam_id: id,
        },
        data: args,
      });
      return res;
    } catch (e) {
      console.log(e);
    }
  };

  const deleteId = async (id) => {
    console.log("Delete: ", id);
    const res = await prisma.exams.delete({
      where: {
        exam_id: +id,
      },
    });
    return res;
  };

  return {
    update,
    insert,
    queryId,
    deleteId,
    insertToWeek,
  };
};

const Student = () => {
  const insert = async (args) => {
    const res = await prisma.students.create({
      data: {
        name: args.name,
        student_id: args.student_id,
        teacher_id: args.teacher_id,
        lessons: {
          connect: [{ lesson_id: args.lesson_id }],
        },
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

  const getInLesson = async (lesson_id) => {
    const res = await prisma.students.findMany({
      where: {
        lessons: {
          some: {
            lesson_id: lesson_id,
          },
        },
      },
      include: {
        lessons: true,
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
  return {
    deleteId,
    insert,
    queryId,
    getInLesson,
    queryExists,
    update,
  };
};

module.exports = {
  Subject,
  Lesson,
  User,
  Exam,
  Student,
};
