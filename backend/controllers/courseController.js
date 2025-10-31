const {
  createCourse,
  findCourseById,
  findCoursesByProfessor,
  findCoursesByStudent,
  enrollStudent,
  getEnrolledStudents,
} = require("../models/courseModel");

const createCourseController = async (req, res) => {
  const { name, code, semester } = req.body;

  try {
    if (!name || !code || !semester) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const course = await createCourse({
      name: name.trim(),
      code: code.trim(),
      semester: semester.trim(),
      professor_id: req.user.id,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const courses = req.user.role === 'admin'
      ? await findCoursesByProfessor(req.user.id)
      : await findCoursesByStudent(req.user.id);

    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCourseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await findCourseById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const students = await getEnrolledStudents(courseId);

    res.json({
      course,
      students,
    });
  } catch (error) {
    console.error("Get course details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const enrollStudentController = async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;

  try {
    await enrollStudent(courseId, studentId);

    res.status(201).json({
      message: "Student enrolled successfully",
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "Student already enrolled" });
    }
    console.error("Enroll student error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCourseController,
  getMyCourses,
  getCourseDetails,
  enrollStudentController,
};