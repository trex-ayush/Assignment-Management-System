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

### Authentication

POST `/auth/register` \- Register user (student/admin)

POST `/auth/login` \- Login user

GET `/auth/profile` \- Get current user profile

POST `/auth/logout` \- Logout user

### Assignments

POST `/assignments` \- Create assignment (Admin)

GET `/assignments` \- Get all assignments

GET `/assignments/:id` \- Get assignment details

PUT `/assignments/:id` \- Update assignment (Admin)

DELETE `/assignments/:id` \- Delete assignment (Admin)

GET `/assignments/:id/analytics` \- Get analytics (Admin)

### Groups

POST `/groups` \- Create group (Student)

GET `/groups/my-groups` \- Get my groups (Student)

GET `/groups/:id` \- Get group details

POST `/groups/:id/members` \- Add member (Student)

DELETE `/groups/:id/members/:memberId` \- Remove member (Student)

### Submissions

POST `/submissions` \- Submit assignment (Student)

GET `/submissions/my-submissions` \- Get my submissions (Student)

GET `/submissions/status/:assignmentId/:groupId` \- Check status

### Stats

GET `/stats/admin` \- Admin dashboard stats

GET `/stats/student` \- Student dashboard stats


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
