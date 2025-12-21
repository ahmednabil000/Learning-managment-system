🎯 Overview
EduSphere is a full-featured online learning platform that enables students to enroll in courses and structured learning tracks, attend live sessions, complete assignments, take exams, and earn certificates. Instructors can create and manage content, while administrators oversee operations, careers, and community engagement.

The system supports three user roles:

Guest: Browse public content.
Student: Enroll, learn, submit work, and track progress.
Instructor: Author courses, grade submissions, and manage live sessions.
Admin: Full system control and moderation.
Built with clean architecture, the project follows SOLID principles, prioritizes performance, and ensures responsive UX across all devices.

🗺️ Information Architecture (Based on Sitemap)
The frontend is organized into the following main sections:

Home
Courses (listing + details)
Tracks (learning paths)
Activities (Blogs, Videos, Certificates)
About Academy (About, Careers, Contact, Join as Instructor, FAQ)
My Dashboard (authenticated student zone)
My Profile
🧱 Backend Models (Express.js + Mongoose)
The following MongoDB models are implemented:

1. User
   ts
   123456789
   {
   name: string,
   email: string (unique),
   password: string (hashed),
   role: 'student' | 'instructor' | 'admin',
   isActive: boolean,
   profileImage?: string,
   createdAt: Date
   }
2. Profile (optional extension)
   Linked to User; stores bio, contact info, resume.

3. Track
   title, description, coverImage, price, isPublished
   courses: [Course]
4. Course
   title, description, instructor (User), track (Track?)
   lectures: [Lecture]
5. Lecture → Lesson
   Hierarchical content units (Lesson has videoUrl, content)
6. Assignment & SubmittedAssignment
   Supports file upload, grading, and feedback.
7. Exam & ExamAttempt
   Two types: theoretical, online
   Tracks answers, scores, and timing.
8. Appeal
   Links to ExamAttempt or SubmittedAssignment
   Status workflow: pending → resolved/rejected
9. BlogPost & Comment
   Nested comments supported.
10. Certificate
    Issued upon course/track completion; includes PDF URL.
11. LiveSession
    scheduledAt, meetingUrl, isRecorded
12. InstructorApplication, JobApplication, ContactMessage
    For onboarding flows.
13. FAQ, Feedback
    Static and dynamic content models.
    All models use timestamps: true and proper indexing on foreign keys.

🖥️ Frontend Pages
🔓 Public Pages (No Auth Required)
Page
Route
Purpose
Home
/
Landing with CTAs
Courses
/courses
Browse all courses
Course Detail
/courses/:id
View syllabus, enroll
Tracks
/tracks
List learning paths
Track Detail
/tracks/:id
View curriculum, enroll
Blog
/blog
Article listing
Blog Post
/blog/:id
Full post + comments
About Us
/about
Mission & team
Instructors
/instructors
Public instructor profiles
Careers
/careers
Job openings
Contact
/contact
Message form
FAQ
/faq
Help center
Login / Signup
/auth/login, /auth/signup
Auth entry
Join as Instructor
/become-instructor
Application form
🔐 Authenticated – Student
Page
Route
Features
Dashboard
/dashboard
Overview of activity
My Courses
/dashboard/courses
Enrolled courses
Lesson View
/dashboard/courses/:id/lecture/:lid/lesson/:lsid
Video + content
Live Sessions
/dashboard/sessions
Join or view recordings
Assignments
/dashboard/assignments
Submit or view graded work
Exams
/dashboard/exams
Take new exams or review history
Appeals
/dashboard/appeals
Submit or track appeals
Certificates
/dashboard/certificates
Download PDFs
My Questions
/dashboard/questions
(Optional Q&A)
Feedback
/dashboard/feedback/:courseId
Rate course/track
My Profile
/profile
Edit personal info
👩‍🏫 Authenticated – Instructor
Page
Route
Features
Instructor Dashboard
/instructor
Stats & quick actions
Manage Courses
/instructor/courses
CRUD courses, lectures, lessons
Grade Assignments
/instructor/assignments
Review & grade
Manage Exams
/instructor/exams
Create and monitor
Live Sessions
/instructor/sessions
Schedule & link meetings
⚙️ Admin Panel
Page
Route
Features
Admin Dashboard
/admin
System metrics
Users
/admin/users
Manage accounts
Instructor Apps
/admin/applications/instructors
Approve/reject
Job Apps
/admin/applications/jobs
Review resumes
Contact Inbox
/admin/contact
Respond to messages
Blog & FAQ
/admin/content
Manage static content
Course Moderation
/admin/courses
(If approval workflow exists)
🔐 Authentication & Authorization
JWT-based session management.
Role-based route guards:
PublicRoute
PrivateRoute (any logged-in user)
StudentRoute
InstructorRoute
AdminRoute
Passwords hashed with bcrypt.
Email validation on signup (optional but recommended).
🛠️ Tech Stack
Backend
Node.js + Express.js
MongoDB (via Mongoose)
JWT for auth
Multer for file uploads (assignments, resumes, certificates)
Nodemailer (for future email notifications)
RESTful API design with clean architecture layers:
Controllers
Services
Repositories
Models
Frontend
React + TypeScript
React Router v6 for navigation
Axios for API calls
Tailwind CSS or Bootstrap for responsive design
Formik + Yup for forms
React Player for video lessons
DevOps & Tools
Git + GitHub (feature branching)
ESLint + Prettier
Jest + Supertest (unit & integration tests)
Environment config via .env
🔄 Key User Flows
Student Enrollment
Browse Course → Click Enroll → (Auth if needed) → Added to User.enrolledCourses
Assignment Submission
View Assignment → Upload File → Submit → Instructor receives notification
Exam Attempt
Start Exam → Timer begins → Submit → Auto-grade (or manual) → View score
Instructor Application
Fill form → Save to InstructorApplication → Admin reviews → User role updated
Certificate Issuance
On course/track completion → System generates Certificate → Student can download
🧪 Testing Strategy
Unit Tests: Services, utilities
Integration Tests: Auth, course enrollment, assignment submission
E2E Tests (optional): Critical paths (login → enroll → complete lesson)
Validation: All input sanitized and validated (using Joi or express-validator)
📅 Next Steps (Implementation Roadmap)
✅ Finalize backend models & API contracts
🔄 Build core REST APIs (auth, courses, dashboard)
🖼️ Develop public-facing pages (React)
🔒 Implement protected student/instructor routes
🛡️ Add role-based access control middleware
🧪 Write test suites
🚀 Deploy (e.g., Render + MongoDB Atlas)
📎 Notes
The term “Abbot us” in the original sitemap is assumed to be a typo for “About us”.
“My Profile” appears in both top nav and dashboard—keep one canonical route (/profile) and link from both places.
Video storage: Use Cloudinary or AWS S3 in production (not local disk).
