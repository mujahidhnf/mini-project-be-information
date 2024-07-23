CREATE TABLE IF NOT EXISTS "t3-template-app_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"credits" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3-template-app_students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nim" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3-template-app_studentsOnCourses" (
	"coursesId" uuid NOT NULL,
	"stdId" uuid NOT NULL,
	CONSTRAINT "t3-template-app_studentsOnCourses_coursesId_stdId_pk" PRIMARY KEY("coursesId","stdId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3-template-app_studentsOnCourses" ADD CONSTRAINT "t3-template-app_studentsOnCourses_coursesId_t3-template-app_courses_id_fk" FOREIGN KEY ("coursesId") REFERENCES "public"."t3-template-app_courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3-template-app_studentsOnCourses" ADD CONSTRAINT "t3-template-app_studentsOnCourses_stdId_t3-template-app_students_id_fk" FOREIGN KEY ("stdId") REFERENCES "public"."t3-template-app_students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
