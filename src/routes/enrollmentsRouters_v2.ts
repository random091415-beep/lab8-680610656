import { Router, type Request, type Response } from "express";

// import database
import { students, enrollments } from "../db/db.js";

const router = Router();

router.delete("/", (req: Request, res: Response) => {
  try {
    const body = req.body;

    const foundEnrollment = enrollments.findIndex(
      (enr) =>
        enr.studentId === body.studentId && enr.courseId === body.courseId,
    );

    if (foundEnrollment === -1) {
      return res.status(404).json({
        success: false,
        message: "Enrollment does not exists",
      });
    }

    // delete found student from array
    students.splice(foundEnrollment, 1);

    res.status(200).json({
      success: true,
      message: `Enrollment has been deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

export default router;
