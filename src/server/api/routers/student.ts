// Router ini digunakan untuk segala yang berkaitan dengan presensi event
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm/expressions";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { students, studentsOnCourses } from "~/server/db/schema";
import { isSQLWrapper } from "drizzle-orm";

export const studentRouter = createTRPCRouter({
  getStudentsWithCoursesOnId: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
      .select()
      .from(studentsOnCourses)
      .where(eq(studentsOnCourses.stdId, input.studentId))
      .limit(1)

      if (!result.length)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not found"
      });

      return result
      // TODO: isi logic disini
      // Expected output: data student berdasarkan id yang diberikan, kalau id tidak diberikan, fetch semua data
    }),

  insertNewStudent: publicProcedure
    .input(z.object({ studentName: z.string(), studentNim: z.string() }))
    .mutation(async ({ ctx, input }) => {
    // INSERT NEW STUDENT
    await ctx.db
    .insert(students)
    .values({
      name: input.studentName,
      nim: input.studentNim,
    });

    const newStudent = await ctx.db.select().from(students).where(eq(students.name, input.studentName))
    return newStudent
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert
    }),
});
