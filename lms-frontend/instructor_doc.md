# Instructor Service API Documentation

This document outlines the API endpoints associated with the Instructor Service and related instructor operations.

## Base URL

- Instructor Routes: `/instructors`
- Course Routes (Instructor Operations): `/courses`

---

## 1. Get Instructor By ID

Retrieves details of a specific instructor by their user ID.

- **Endpoint**: `GET /instructors/:id`
- **Auth Required**: No (Publicly accessible usually, or verify requirement)
- **Parameters**:
  - `id` (path): The unique identifier of the instructor.
- **Response**:
  - `200 OK`: Returns the instructor object.
    ```json
    {
      "_id": "instructor_uuid",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Instructor",
      "description": "Experienced web developer...",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
    ```
  - `404 Not Found`: Instructor not found.
  - `500 Internal Server Error`: Server error.

---

## 2. Get Instructor Courses

Retrieves a paginated list of courses created by the currently authenticated instructor.

- **Endpoint**: `GET /courses/instructor/my-courses`
- **Auth Required**: Yes (Instructor)
- **Query Parameters**:
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Number of items per page (default: 10).
- **Response**:
  - `200 OK`: Returns a paginated list of courses.
    ```json
    {
      "courses": [
        {
          "_id": "course_uuid",
          "title": "Advanced Node.js",
          "description": "Deep dive into Node.js...",
          "price": 49.99,
          "imageUrl": "http://example.com/image.jpg",
          "instructor": "instructor_uuid",
          "tag": {
            "_id": "tag_uuid",
            "name": "Web Development"
          },
          "level": "advanced",
          "createdAt": "2023-05-01T00:00:00.000Z"
        }
      ],
      "page": 1,
      "limit": 10,
      "totalItems": 15,
      "totalPages": 2,
      "hasPrevPage": false,
      "hasNextPage": true,
      "prevPage": null,
      "nextPage": 2
    }
    ```
  - `500 Internal Server Error`: Server error.

---

## 3. Get Courses By Instructor ID

Retrieves a paginated list of courses created by a specific instructor (Public).

- **Endpoint**: `GET /courses/instructor/:instructorId`
- **Auth Required**: No
- **Parameters**:
  - `instructorId` (path): The unique identifier of the instructor.
- **Query Parameters**:
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Number of items per page (default: 10).
- **Response**:
  - `200 OK`: Returns a paginated list of courses.
    ```json
    {
      "courses": [
        {
          "_id": "course_uuid",
          "title": "Course Title",
          "description": "...",
          "price": 49.99,
          "imageUrl": "...",
          "instructor": "instructor_uuid",
          "level": "beginner",
          "createdAt": "..."
        }
      ],
      "page": 1,
      "limit": 10,
      "totalItems": 5,
      "totalPages": 1,
      "hasPrevPage": false,
      "hasNextPage": false
    }
    ```
  - `404 Not Found`: Instructor not found.
  - `500 Internal Server Error`: Server error.
