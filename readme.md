# EduSphere LMS

EduSphere is a comprehensive, full-featured online learning platform designed to facilitate seamless interaction between students, instructors, and administrators. It supports course enrollment, structured learning tracks, live sessions, assignments, exams, and certification.

## 🚀 Overview

The platform is built with a clean architecture following SOLID principles, ensuring scalability and performance. It caters to three main user roles:

- **Guest**: Browse public courses, tracks, and instructors.
- **Student**: Enroll in courses, track progress, submit assignments, take exams, and earn certificates.
- **Instructor**: Create and manage courses, grade assignments, conduct live sessions, and track performance.
- **Admin**: Oversee the entire system, manage users, approve instructor applications, and handle content moderation.

## ✨ Features

### Instructor Features

- **Course Management**: Comprehensive tools to manage **Courses**, **Lectures**, and **Lessons**.
- **Assessment Control**: Create, edit, and grade **Assignments** and **Exams**.
- **Live Interaction**: Schedule and host **Live Sessions** efficiently.
- **Content Creation**: Write and publish **Blogs** to engage with students.
- **And More**: Access detailed analytics and other advanced tools.

### Student Features

- **Enrollment**: Easily **Enroll in courses** and track learning progress.
- **Learning Tracks**: Purchase curated **Bundles of courses** at a discounted rate to master a specific path.
- **Engagement**: **Discuss with comments** on lessons and **Rate courses** to provide feedback.
- **Live Participation**: Join and **Participate in live sessions** for real-time learning.
- **Assessments**: Take exams and submit assignments online.
- **And More**: Access resources, view certificates, and manage profile settings.

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js (JWT & Google OAuth)
- **File Storage**: Cloudinary / Multer
- **Payments**: Stripe
- **Validation**: Joi
- **Utilities**: Node-cron (Scheduling), Winston (Logging)

### Frontend

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Routing**: React Router DOM (v6)
- **Rich Text Editor**: Lexical
- **Video Player**: React Player
- **Live Calls**: Daily.co (Daily-js/Daily-react)
- **Internationalization**: i18next

## ⚙️ Background Services

The application utilizes background jobs (powered by `node-cron`) to maintain data integrity and automate tasks:

- **Course Sales Management**: Automatically deactivates expired course sales.
- **Exam Status Updates**: Regularly checks and updates the status of scheduled exams.

## 📂 Project Structure

```
LMS/
├── lms-backend/       # Node.js/Express Server
├── lms-frontend/      # React/Vite Client
└── readme.md          # Project Documentation
```

## 📚 API Documentation

Detailed documentation for the backend APIs can be found in the `lms-backend/` directory, including:

- `API_DOCUMENTATION.md`
- `AUTH_API.md`
- `COURSES_API.md`
- `EXAM_API.md`
- and more...

## 📄 License

This project is licensed under the ISC License.
