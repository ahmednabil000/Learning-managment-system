# Exam API Documentation

This document outlines the API endpoints associated with the exam module, including creating exams, managing questions, and submitting attempts.

## Base URL

`/api/exams`

---

## 1. Create Exam

Creates a new exam for a specific course.

- **Endpoint**: `POST /`
- **Auth Required**: Yes (Instructor)
- **Request Body**:
  ```json
  {
    "title": "Midterm Exam",
    "description": "Midterm exam for the course",
    "course": "course_uuid",
    "startDate": "2024-01-01T10:00:00.000Z",
    "duration": 60,
    "questions": []
  }
  ```
- **Response**:
  - `201 Created`: Exam created successfully.
  ```json
  {
    "statusCode": 201,
    "message": "Exam created successfully",
    "data": {
      "_id": "exam_uuid",
      "title": "Midterm Exam",
      "description": "Midterm exam for the course",
      "course": "course_uuid",
      "instructor": "instructor_uuid",
      "duration": 60,
      "questions": [],
      "status": "not-started",
      "createdAt": "2024-01-01T09:00:00.000Z",
      "updatedAt": "2024-01-01T09:00:00.000Z"
    }
  }
  ```
  - `400 Bad Request`: Validation error.
  - `401 Unauthorized`: User is not the instructor of the course.
  - `404 Not Found`: Course not found.

---

## 2. Remove Exam

Deletes an existing exam.

- **Endpoint**: `DELETE /:examId`
- **Auth Required**: Yes (Instructor)
- **Response**:
  - `200 OK`: Exam removed successfully.
  ```json
  {
    "statusCode": 200,
    "message": "Exam removed successfully"
  }
  ```
  - `401 Unauthorized`: User is not the instructor.
  - `404 Not Found`: Exam not found.

---

## 3. Add Question to Exam

Adds a new question to an existing exam.

- **Endpoint**: `POST /:examId/questions`
- **Auth Required**: Yes (Instructor)
- **Request Body**:
  ```json
  {
    "question": "What is 2+2?",
    "type": "multiple-choice",
    "options": ["3", "4", "5"],
    "correctAnswer": "4",
    "points": 1
  }
  ```
- **Response**:
  - `201 Created`: Question added successfully.
  ```json
  {
    "statusCode": 201,
    "message": "Question added to exam successfully",
    "data": {
      "_id": "question_uuid",
      "exam": "exam_uuid",
      "instructor": "instructor_uuid",
      "question": "What is 2+2?",
      "type": "multiple-choice",
      "options": ["3", "4", "5"],
      "correctAnswer": "4",
      "points": 1,
      "createdAt": "2024-01-01T10:05:00.000Z",
      "updatedAt": "2024-01-01T10:05:00.000Z"
    }
  }
  ```
  - `404 Not Found`: Exam not found.

---

## 4. Remove Question from Exam

Removes a question from an exam.

- **Endpoint**: `DELETE /:examId/questions/:questionId`
- **Auth Required**: Yes (Instructor)
- **Response**:
  - `200 OK`: Question removed successfully.
  ```json
  {
    "statusCode": 200,
    "message": "Question removed from exam successfully"
  }
  ```
  - `404 Not Found`: Exam not found.

---

## 5. Get Course Available Exam

Fetches the currently available exam for a course (started or not-started).

- **Endpoint**: `GET /course/:courseId/available`
- **Auth Required**: Yes (Student enrolled in course)
- **Response**:
  - `200 OK`: Returns the exam object.
  ```json
  {
    "statusCode": 200,
    "message": "Course available exam",
    "data": {
      "_id": "exam_uuid",
      "title": "Midterm Exam",
      "status": "started",
      "startDate": "2024-01-01T10:00:00.000Z",
      "duration": 60
    }
  }
  ```
  - `404 Not Found`: No available exam or user not enrolled.

---

## 6. Get Exam Remained Duration

Checks the remaining duration for an exam for a specific user.

- **Endpoint**: `GET /:examId/duration`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`: Returns the remaining duration in milliseconds.
    ```json
    {
      "statusCode": 200,
      "message": "Exam available duration",
      "data": 3600000
    }
    ```
    _(Data represents milliseconds)_
  - `400 Bad Request`: Exam not started or has ended.

---

## 7. Start Exam Attempt

Starts an attempt for an exam.

- **Endpoint**: `POST /:examId/attempt`
- **Auth Required**: Yes
- **Request Body**: (Empty or initial data if needed)
  ```json
  {
    "score": 0 // Initial score
  }
  ```
- **Response**:
  - `201 Created`: Attempt started.
  ```json
  {
    "statusCode": 201,
    "message": "Exam attempt added successfully",
    "data": {
      "_id": "attempt_uuid",
      "user": "user_uuid",
      "exam": "exam_uuid",
      "score": 0,
      "status": "started",
      "answers": [],
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  }
  ```
  - `400 Bad Request`: User already attempted.

---

## 8. Submit Answer

Submits or updates an answer for a specific question in an ongoing attempt.

- **Endpoint**: `POST /attempt/:examAttemptId/answer`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "questionId": "question_uuid",
    "answer": "Selected Option"
  }
  ```
- **Response**:
  - `201 Created`: Answer added/updated.
  ```json
  {
    "statusCode": 201,
    "message": "Answer added to exam attempt successfully",
    "data": {
      "_id": "attempt_uuid",
      "answers": [
        {
          "question": "question_uuid",
          "answer": "Selected Option",
          "_id": "answer_entry_id"
        }
      ]
    }
  }
  ```
  - `400 Bad Request`: Exam has ended.

---

## 9. End Exam Attempt

Manually ends an ongoing exam attempt.

- **Endpoint**: `POST /attempt/:examAttemptId/end`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`: Exam attempt ended successfully.
  ```json
  {
    "statusCode": 200,
    "message": "Exam attempt ended successfully",
    "data": {
      "_id": "attempt_uuid",
      "status": "ended",
      "score": 85,
      "answers": [...]
    }
  }
  ```
  - `401 Unauthorized`: User does not own the attempt.
  - `404 Not Found`: Attempt not found.

---

## 10. Get Exam Attempt

Retrieves status and details of a specific exam attempt. Use this to resume an attempt or check its status.

- **Endpoint**: `GET /attempt/:examAttemptId`
- **Auth Required**: Yes
- **Response**:
  - `200 OK`: Returns the attempt object (populated with exam and questions).
  ```json
  {
    "statusCode": 200,
    "message": "Exam attempt retrieved successfully",
    "data": {
      "_id": "attempt_uuid",
      "status": "started",
      "score": 0,
      "exam": {
        "_id": "exam_uuid",
        "title": "Midterm Exam",
        "questions": [
          {
            "_id": "question_uuid",
            "question": "What is 2+2?",
            "type": "multiple-choice",
            "options": ["3", "4", "5"],
            "points": 1
            // Note: correctAnswer is hidden
          }
        ]
      },
      "answers": [
        {
          "question": "question_uuid",
          "answer": "4"
        }
      ]
    }
  }
  ```
  - `401 Unauthorized`: User does not own the attempt.
  - `404 Not Found`: Attempt not found.

---

## 11. Get Exams By Course Id

Retrieves all exams created for a specific course by the instructor.

- **Endpoint**: `GET /course/:courseId`
- **Auth Required**: Yes (Instructor)
- **Response**:
  - `200 OK`: Returns list of exams.
  ```json
  {
    "statusCode": 200,
    "message": "Exam retrieved successfully",
    "data": [
      {
        "_id": "exam_uuid",
        "title": "Midterm Exam",
        "description": "Midterm exam for the course",
        "status": "not-started",
        "startDate": "2024-01-01T10:00:00.000Z",
        "questions": ["question_uuid_1", "question_uuid_2"] // Depending on populate
      }
    ]
  }
  ```
  - `404 Not Found`: No exams found.
