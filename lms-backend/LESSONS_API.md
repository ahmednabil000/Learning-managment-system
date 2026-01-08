# Lessons API Documentation

Base URL: `/lessons`

## 1. Upload Video

Uploads a video file for a lesson. This endpoint handles the video file upload to Cloudinary and returns the public ID (or URL identifier) of the uploaded video, which should be used when creating or updating a lesson.

- **Endpoint**: `POST /upload`
- **Auth Required**: Yes
- **Headers**:
  - `Content-Type`: `multipart/form-data`
  - `Authorization`: `Bearer <token>`

**Request Body:**

- `video`: The video file to be uploaded (Max size: 100MB).

**Response:**

- `200 OK`: Video uploaded successfully.

  ```json
  {
    "videoUrl": "lessons/lesson_1704390000000_myvideo"
  }
  ```

  _(Note: The 'videoUrl' key returns the Cloudinary public ID or identifier for the video)_

- `400 Bad Request`: No video attached or validation error.
- `500 Internal Server Error`: Upload failed.

---

## 2. Create Lesson

Creates a new lesson module within a lecture.

- **Endpoint**: `POST /`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Introduction to React",
    "description": "Basic concepts",
    "lectureId": "lecture_uuid",
    "course": "course_uuid",
    "order": 1,
    "publicId": "lessons/lesson_1704390000000_myvideo",
    "duration": 120,
    "isOpen": false
  }
  ```
- **Response**:
  - `201 Created`: Lesson created.
  ```json
  {
    "_id": "lesson_uuid",
    "title": "Introduction to React",
    "description": "Basic concepts",
    "lecture": "lecture_uuid",
    "course": "course_uuid",
    "order": 1,
    "publicId": "lessons/lesson_1704390000000_myvideo",
    "duration": 120,
    "isOpen": false,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
  ```
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`: Server error.

---

## 3. Update Lesson

Updates an existing lesson.

- **Endpoint**: `PUT /:id`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Deep Dive into React",
    "description": "Advanced concepts",
    "isOpen": true
  }
  ```
- **Response**:
  - `200 OK`: Lesson updated successfully.
  ```json
  {
    "_id": "lesson_uuid",
    "title": "Deep Dive into React",
    "description": "Advanced concepts",
    "lecture": "lecture_uuid",
    "course": "course_uuid",
    "order": 1,
    "publicId": "lessons/lesson_1704390000000_myvideo",
    "duration": 120,
    "isOpen": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
  ```
  - `400 Bad Request`: Validation error.
  - `404 Not Found`: Lesson not found.

---

## 4. Get Lesson By ID

Retrieves details of a specific lesson.

- **Endpoint**: `GET /:id`
- **Auth Required**: Optional (Public if lesson is open, otherwise Auth required + Enrollment check)
- **Response**:
  - `200 OK`: Returns the lesson object.
  ```json
  {
    "_id": "lesson_uuid",
    "title": "Introduction to React",
    "description": "Basic concepts",
    "lecture": "lecture_uuid",
    "course": "course_uuid",
    "order": 1,
    "publicId": "lessons/lesson_1704390000000_myvideo",
    "url": "https://res.cloudinary.com/demo/video/upload/s--signature--/v1/lessons/lesson_1704390000000_myvideo.mp4",
    "duration": 120,
    "isOpen": false,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
  ```
  - `401 Unauthorized`: User not authenticated (and lesson is not open).
  - `403 Forbidden`: User not enrolled (and lesson is not open).
  - `404 Not Found`: Lesson not found.

---

## 5. Get Lessons By Lecture

Retrieves all lessons for a specific lecture.

- **Endpoint**: `GET /:lectureId/lessons`
- **Auth Required**: Yes (Usually implies enrollment depending on implementation)
- **Response**:
  - `200 OK`: Returns a list of lessons.
  ```json
  [
    {
      "_id": "lesson_uuid_1",
      "title": "Introduction to React",
      "order": 1,
      "publicId": "lessons/lesson_1",
      "duration": 120,
      "isOpen": false
    },
    {
      "_id": "lesson_uuid_2",
      "title": "React Components",
      "order": 2,
      "publicId": "lessons/lesson_2",
      "duration": 150,
      "isOpen": true
    }
  ]
  ```
  - `500 Internal Server Error`: Server error.
