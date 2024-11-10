require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    firstname VARCHAR ( 255 ) NOT NULL,
    lastname VARCHAR ( 255 ) NOT NULL,
    email VARCHAR ( 255 ) UNIQUE NOT NULL,
    password VARCHAR ( 255 ) NOT NULL,
    joined TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
    ) WITH (OIDS=FALSE);
    
CREATE INDEX IDX_session_expire ON session (expire);

CREATE TABLE IF NOT EXISTS subjects (
    subject_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    teacher_id INTEGER,
    name VARCHAR ( 255 ) NOT NULL,
    textbook VARCHAR ( 255 ),
    description TEXT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    UNIQUE (teacher_id, name)
    );
    
CREATE TABLE IF NOT EXISTS lessons (
    lesson_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    teacher_id INTEGER,
    semester SMALLINT NOT NULL,
    subject_id INTEGER NOT NULL,
    attendance SMALLINT NOT NULL CHECK(attendance < 100),
    classroom VARCHAR,
    class_start TIME NOT NULL,
    FOREIGN KEY(teacher_id)
        REFERENCES teachers(teacher_id)
        ON DELETE CASCADE,
    FOREIGN KEY(subject_id)
        REFERENCES subjects(subject_id)
    );

CREATE TABLE IF NOT EXISTS exams (
    exam_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    marks INTEGER NOT NULL,
    file VARCHAR,
    percent INTEGER NOT NULL CHECK(percent < 100),
    type VARCHAR NOT NULL
    );

CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY,
    name VARCHAR ( 255 )
    );

CREATE TABLE IF NOT EXISTS stud_exam (
    student_id INTEGER,
    exam_id INTEGER,
    points INTEGER,
    PRIMARY KEY(student_id, exam_id),
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY(exam_id) REFERENCES exams(exam_id)
    );

CREATE TABLE IF NOT EXISTS stud_less (
    student_id INTEGER,
    lesson_id INTEGER,
    PRIMARY KEY(student_id,lesson_id),
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY(lesson_id) REFERENCES lessons(lesson_id)
    );

CREATE TABLE IF NOT EXISTS subj_exam (
    subject_id INTEGER,
    exam_id INTEGER,
    PRIMARY KEY(subject_id, exam_id),
    FOREIGN KEY(subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY(exam_id) REFERENCES exams(exam_id)
    );

CREATE TABLE IF NOT EXISTS stud_notes (
    student_id INTEGER,
    added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    PRIMARY KEY(student_id, added),
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS subj_week (
    subject_id INTEGER,
    week INTEGER,
    description TEXT,
    PRIMARY KEY(subject_id, week),
    FOREIGN KEY(subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
    );
`

async function main() {
    console.log('seeding...');
    const client = new Client({
        connectionString: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:5432/${process.env.DATABASE_NAME}`, 
    });
    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log("done");
}

main();