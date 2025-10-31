CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  deadline TIMESTAMP NOT NULL,
  onedrive_link TEXT NOT NULL,
  submission_type VARCHAR(20) NOT NULL DEFAULT 'individual' CHECK (submission_type IN ('individual', 'group')),
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS acknowledgments (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assignment_id, user_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_courses_professor ON courses(professor_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_groups_course ON groups(course_id);
CREATE INDEX IF NOT EXISTS idx_groups_creator ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_deadline ON assignments(deadline);
CREATE INDEX IF NOT EXISTS idx_acknowledgments_assignment ON acknowledgments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_acknowledgments_user ON acknowledgments(user_id);