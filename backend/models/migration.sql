CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(50) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  professor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course_id, student_id)
);

ALTER TABLE groups ADD COLUMN IF NOT EXISTS course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS submission_type VARCHAR(20) DEFAULT 'group' CHECK (submission_type IN ('individual', 'group'));
ALTER TABLE assignments RENAME COLUMN due_date TO deadline;

CREATE TABLE IF NOT EXISTS acknowledgments (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assignment_id, user_id)
);

INSERT INTO acknowledgments (assignment_id, user_id, group_id, acknowledged_at)
SELECT assignment_id, submitted_by, group_id, submitted_at
FROM submissions
WHERE submitted_by IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO courses (name, code, semester, professor_id)
SELECT 'General Course', 'GEN001', 'Fall 2024', id
FROM users WHERE role = 'admin' LIMIT 1
ON CONFLICT DO NOTHING;

UPDATE assignments SET course_id = (SELECT id FROM courses LIMIT 1) WHERE course_id IS NULL;
UPDATE groups SET course_id = (SELECT id FROM courses LIMIT 1) WHERE course_id IS NULL;


INSERT INTO course_enrollments (course_id, student_id)
SELECT (SELECT id FROM courses LIMIT 1), id
FROM users WHERE role = 'student'
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_courses_professor ON courses(professor_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_groups_course ON groups(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_acknowledgments_assignment ON acknowledgments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_acknowledgments_user ON acknowledgments(user_id);