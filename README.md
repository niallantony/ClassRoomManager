# ClassRoomManager

A database for management of student grades and classes. Will allow teachers to view their classes, input students grades, view progress and input week-by-week lesson plans.

## Learning aims

- Create a full stack application that can be used in a real-world scenario
- Demonstrate logical database design
- Practice user authentication

### Possible Future Learning Points

- Learn about typescript and implement it in this app
- Use a CSS framework for alternative styling.

## Tools used

- Express
- node.js
- PostgreSQL
- Prisma ORM

## Current Progress

- Setting Up:
    - [x] Design database
    - [ ] Create basic forms for inputting data
        - [x] Create User form
        - [x] Encrypt Passwords (!)
        - [x] New subject form
        - [x] New class form
        - [ ] New student form
    - [x] Create an easier way for queries to be made on the database
    - [x] Create log in authentication
        - [ ] Handle user not found
    - [x] Create routes on backend
    - [x] Create querying module
    - [ ] Create delete actions for subjects, classes and students
        - [x] Handle 'Cannot Delete Subject with Lessons'
    - [x] Integrate Prisma ORM for DB management
    - [ ] Edit actions for subjects, classes and students
    - [ ] Create remaining database actions
        - [ ] Exams for subjects
        - [ ] Weeks for subjects
        - [ ] Student notes
        - [ ] Student Exam attempts
    - [ ] Test
    - [ ] Build Frontend
        - [ ] Dashboard Home Screen
        - [ ] Responsive design
        - [ ] API & React (?)