📚 Assignment Management System
===============================

Full-Stack Web Application for Student Groups & Assignment Tracking

React Node.js Express PostgreSQL Tailwind CSS

📌 Overview
-----------

A role-based system enabling students to form groups, manage members, and submit assignments, while professors track progress and manage assignments through a unified dashboard.

#### 👨‍🎓 Student Features

* Create & manage groups
* Add/remove members
* Submit assignments
* Track submissions

#### 👨‍🏫 Admin Features

* Create assignments
* Track submissions
* View analytics
* Manage groups

**Frontend** React 18, Vite, React Router, Axios, Tailwind CSS

**Backend** Node.js, Express, JWT, bcryptjs, cookie-parser

**Database** PostgreSQL 14+, pg (node-postgres)

## 📸 Screenshots

### 👨‍🏫 Professor 
<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/41e8d969-2777-442f-bde8-a2ea71afa638" />
<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/02b0dfcd-ea91-4f16-a666-7cd2b43c7887" />
<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/29d70d22-2fd0-48bc-aa6f-c21edae0bd0f" />
<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/b91778ad-8055-4cd6-bb42-acc98e9e2812" />
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/2febb71f-690a-4409-8fcf-074c3d0dbac4" />
<img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/7355ed00-bb77-4091-98ff-02f290bfadac" />
<img width="1900" height="969" alt="image" src="https://github.com/user-attachments/assets/5bc90878-4baf-424b-b6eb-38fdb76c0e9b" />

### 🎓 Student Dashboard
<img width="1897" height="968" alt="image" src="https://github.com/user-attachments/assets/8ae7ee65-7b12-49d4-a5f0-5a37f5bed222" />
<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/e05c16c3-7b6b-492e-a6fa-4be656b69a25" />
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/1de2c219-0a79-41fe-a506-c13e54ffacf0" />
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/972ca5ab-ca74-498d-9cae-7af2941e5f71" />




🚀 Setup & Run Instructions
---------------------------

### Prerequisites

* Node.js v18+
* PostgreSQL 14+
* npm or yarn

### 1\. Database Setup

psql -U postgres
CREATE DATABASE assignment_management;
\\q

### 2\. Backend Setup

cd backend
npm install
cp .env.example .env
\# Edit .env with your credentials
npm run setup    # Run database migrations
npm run dev      # Start server on port 3000

### 3\. Frontend Setup

cd frontend
npm install
cp .env.example .env
npm run dev      # Start on port 5173

### 4\. Environment Variables

**Backend (.env):**

DB_USER=postgres
DB_HOST=localhost
DB\_NAME=assignment\_management
DB\_PASSWORD=your\_password
DB_PORT=5432
JWT\_SECRET=your\_secret\_key\_min\_32\_chars
ADMIN\_KEY=your\_admin_key

**Frontend (.env):**

VITE\_API\_URL=http://localhost:3000/api

### 5\. Access Application

* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:3000/api`

🔌 API Endpoints
----------------

**Base URL:** `http://localhost:3000/api`

## 🔐 Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|-----------|--------------|----------------|------|
| `POST` | `/auth/register` | Register a new user (Student or Admin). Admins must provide `adminKey`. | ❌ | All |
| `POST` | `/auth/login` | Login and receive JWT token. | ❌ | All |
| `POST` | `/auth/logout` | Logout and invalidate current session. | ✅ | All |
| `GET`  | `/auth/profile` | Get logged-in user profile. | ✅ | All |
| `GET`  | `/auth/users?role=student` | Get all users filtered by role. | ✅ | Admin |

---

## 📚 Course Routes (`/courses`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|-----------|--------------|----------------|------|
| `POST` | `/courses/` | Create a new course. | ✅ | Admin |
| `GET`  | `/courses/my-courses` | Get all courses for the logged-in user. | ✅ | All |
| `GET`  | `/courses/:courseId` | Get detailed info for a specific course. | ✅ | All |
| `POST` | `/courses/:courseId/enroll` | Enroll a student in a course. | ✅ | Admin |

---

## 📝 Assignment Routes (`/assignments`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|-----------|--------------|----------------|------|
| `POST` | `/assignments/` | Create a new assignment for a course. | ✅ | Admin |
| `GET`  | `/assignments/course/:courseId` | Get all assignments for a specific course. | ✅ | All |
| `GET`  | `/assignments/:assignmentId` | Get details of a specific assignment. | ✅ | All |
| `PUT`  | `/assignments/:assignmentId` | Update an existing assignment. | ✅ | Admin |
| `DELETE` | `/assignments/:assignmentId` | Delete an assignment. | ✅ | Admin |

---

## 🧑‍🎓 Submission Routes (`/submissions`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|-----------|--------------|----------------|------|
| `POST` | `/submissions/` | Submit an assignment. | ✅ | Student |
| `GET`  | `/submissions/my-submissions` | Get all submissions of the logged-in student. | ✅ | Student |
| `GET`  | `/submissions/group/:groupId` | Get all submissions for a specific group. | ✅ | All |
| `GET`  | `/submissions/status/:assignmentId/:groupId` | Check submission status for a specific assignment and group. | ✅ | All |
| `DELETE` | `/submissions/:submissionId` | Delete a submission. | ✅ | All |

---

## 👥 Group Routes (`/groups`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|-----------|--------------|----------------|------|
| `POST` | `/groups/` | Create a new group. | ✅ | Student |
| `GET`  | `/groups/my-groups` | Get all groups for the logged-in student. | ✅ | Student |
| `GET`  | `/groups/:groupId` | Get details of a specific group. | ✅ | All |
| `POST` | `/groups/:groupId/members` | Add a new member to the group. | ✅ | Student |
| `DELETE` | `/groups/:groupId/members/:memberId` | Remove a member from a group. | ✅ | Student |
| `GET`  | `/groups/` | Get all groups (Admin only). | ✅ | Admin |

---

## 🧾 Acknowledgment Routes (`/acknowledgments`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|-----------|--------------|----------------|------|
| `POST` | `/acknowledgments/` | Acknowledge assignment completion. | ✅ | Student |

---

## 📊 Statistics Routes (`/stats`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|-----------|--------------|----------------|------|
| `GET` | `/stats/admin` | Fetch overall system stats for Admin Dashboard. <br>Returns counts of students, groups, assignments, and submissions. | ✅ | Admin |
| `GET` | `/stats/student` | Fetch student-specific stats: total groups, submissions, and assignments. | ✅ | Student |

---



## 🔄 Request Flow

React Component (User Action)  
   ⭢ Axios Service (API Call)  
   ⭢ HTTP Request (with JWT Cookie)  
   ⭢ Express Route Handler  
   ⭢ Auth Middleware (JWT Verification)  
   ⭢ Controller (Business Logic)  
   ⭢ Model (Database Query)  
   ⭢ PostgreSQL Database  
   ⭢ JSON Response  
   ⭢ React State Update & UI Render

### Layer Responsibilities

| Layer | Technology | Responsibility |
| --- | --- | --- |
| **Presentation** | React Components | UI rendering, user interactions, form validation |
| **State Management** | Context API | Global auth state, user data |
| **API Client** | Axios | HTTP requests, error handling |
| **Routes** | Express Router | URL mapping, middleware application |
| **Middleware** | Custom Functions | Authentication, authorization, CORS |
| **Controllers** | Business Logic | Request validation, response formatting |
| **Models** | Database Queries | Data access, SQL queries |
| **Database** | PostgreSQL | Data persistence, transactions |

🎯 Key Design Decisions
-----------------------

**1\. JWT with HTTP-only Cookies** Prevents XSS attacks, provides stateless auth, 7-day expiration balances security & UX

**2\. PostgreSQL Database** ACID compliance, complex relationships support, excellent performance with indexing, transaction support

**3\. Role-Based Access Control (RBAC)** Two roles (student/admin) with middleware enforcement, admin key prevents unauthorized access

**4\. Two-Step Submission Verification** Checkbox confirmation prevents accidental submissions, ensures user intent

**5\. Self-Service Group Management** Students create groups autonomously, group creator becomes leader with management permissions

**6\. RESTful API Design** Predictable URL structure, HTTP verbs match operations, consistent response format

**7\. Component-Based Frontend** Reusable components (Button, Card, Modal), Context API for global state, no over-engineering

**8\. Database Indexing** Indexes on foreign keys and frequently queried columns (email, due_date) for 10-20x performance

### Deployment Strategy

| Component | Recommended Platform | Notes |
| --- | --- | --- |
| **Frontend** | Vercel / Netlify | Zero-config deployment, CDN, auto-scaling |
| **Backend** | Railway / Heroku | Easy PostgreSQL integration, environment variables |
| **Database** | Railway / AWS RDS | Managed PostgreSQL, automated backups |

**Assignment Management System v1.0**

Built with React, Node.js, Express & PostgreSQL
