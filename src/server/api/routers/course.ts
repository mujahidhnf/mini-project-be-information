// Router ini digunakan untuk segala yang berkaitan dengan presensi event
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, inArray, or } from "drizzle-orm/expressions";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { courses, studentsOnCourses } from "~/server/db/schema";
import { title } from "process";
import { Column } from "drizzle-orm";

export const courseRouter = createTRPCRouter({
  getAllCourses: publicProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
    // Expected output: seluruh data course yang ada
    const AllCourses = await ctx.db
    .select()
    .from(courses)

    return AllCourses
  }),

  getStudentsListOnCourseId: publicProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: data course berdasarkan id yang diberikan beserta seluruh student yang mengikutinya
      const resultCourse = await ctx.db
      .select()
      .from(studentsOnCourses)
      .where(eq(studentsOnCourses.coursesId, input.courseId))
      .limit(1)

      return resultCourse

    }),

  insertNewCourse: publicProcedure
    .input(z.object({ name: z.string(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert
      await ctx.db
      .insert(courses)
      .values({
        title: input.name,
        credits: input.credits,
      })

      const newCourse = await ctx.db.select().from(courses).where(eq(courses.title, input.name))
      return newCourse
      }),

  updateCourseData: publicProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        name: z.string().optional(),
        credits: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(courses)
      .set({
        title: input.name,
        credits: input.credits        
      })
      .where(eq(courses.id, input.courseId))

      const updateCourse = await ctx.db.select().from(courses).where(eq(courses.id, input.courseId))
      return updateCourse
      // TODO: isi logic disini
      // Expected output: hasil data yang di update berdasarkan courseId yang diberikan, apabila name atau credits tidak diberikan, tidak usah di update
    }),

  enrollNewStudent: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() }),
    )
    .mutation(async ({ ctx, input }) => {

      await ctx.db.insert(studentsOnCourses).values({
        coursesId: input.courseId,
        stdId: input.studentId
      })

      const enrollNew = await ctx.db.select().from(studentsOnCourses).where(eq(studentsOnCourses.stdId, input.studentId))
      return enrollNew
      // TODO: isi logic disini
      // Expected output: hasil data yang di-insert, enrollment_date mengikuti waktu ketika fungsi dijalankan
    }),

  removeStudentfromCourse: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di delete
      
      const deleteStd = await ctx.db
      .delete(studentsOnCourses)
      .where(eq(studentsOnCourses.stdId, input.studentId))

      return deleteStd
    }),
});
