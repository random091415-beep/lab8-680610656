import { Router, type Request, type Response } from "express";
import { zCourseId, zStudentId } from "../libs/zodValidators.js";

// import database
import { students, courses, enrollments } from "../db/db.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId;
    const studentId = req.query.studentId;
    const checkStdId = zStudentId.safeParse(studentId);
    const checkCrsId = zCourseId.safeParse(courseId);

    if ((courseId && studentId) || (!courseId && !studentId)) {
      return res.status(400).json({
        ok: false,
        message: "Please provide either studentId or courseId and not both!",
      });
    } else if (courseId) {
      if (!checkCrsId.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: checkCrsId.error.issues[0]?.message,
        });
      }
      const id = enrollments
        .filter((enr) => enr.courseId === courseId)
        .map((enr) => enr.studentId);
      const stdInfo = students
        .filter((std) => id.includes(std.studentId))
        .map((std) => ({
          studentId: std.studentId,
          firstName: std.firstName,
          lastName: std.lastName,
          program: std.program,
        }));
      return res.status(200).json({
        ok: true,
        students: stdInfo,
      });
    } else if (studentId) {
      if (!checkStdId.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: checkStdId.error.issues[0]?.message,
        });
      }
      const id = enrollments
        .filter((enr) => enr.studentId === studentId)
        .map((enr) => enr.courseId);
      const crsInfo = courses
        .filter((crs) => id.includes(crs.courseId))
        .map((crs) => ({
          courseId: crs.courseId,
          title: crs.courseTitle,
        }));
      return res.status(200).json({
        ok: true,
        students: crsInfo,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

export default router;
