import exp from "constants";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
  text,
  primaryKey,
} from "drizzle-orm/pg-core";
import { string } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t3-template-app_${name}`);

// STUDENTS TABLE
export const students = createTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  nim: varchar("nim", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

//STUDENTS RELATIONS
export const stdRelations = relations(students, ({ many }) => ({
  coursesEnrolled: many(studentsOnCourses),
}));

//COURSES TABLE
export const courses = createTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  credits: integer("credits").notNull(),
});

//COURSES RELATIONS
export const coursesRelations = relations(courses, ({ many }) => ({
  stdEnrolled: many(studentsOnCourses),
}));

//STUDENTS ON COURSES TABLE
export const studentsOnCourses = createTable("studentsOnCourses", {
  coursesId: uuid("coursesId")
    .notNull()
    .references(()=>courses.id),
  stdId: uuid("stdId")
    .notNull()
    .references(()=>students.id),
},
(t)=>({
  pk: primaryKey(t.coursesId,t.stdId)
})
);

//STUDENTS ON COURSES RELATIONS
export const studentsOnCoursesRelations = relations(
  studentsOnCourses,
  ({ one }) => ({
    course: one(courses, {
      fields: [studentsOnCourses.coursesId],
      references: [courses.id],
    }),
    std: one(students, {
      fields: [studentsOnCourses.stdId],
      references: [students.id],
    }),
  }),
);