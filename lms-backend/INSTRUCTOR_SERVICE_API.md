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
      "email": "john.doe@example.com",
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

Retrieves a paginated list of courses created by a specific instructor.

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

## 3. Update Instructor

Updates the profile details of the authenticated instructor.

- **Endpoint**: `PUT /instructors/`
- **Auth Required**: Yes (Must be logged in)
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "description": "Updated description..."
  }
  ```
- **Response**:
  - `200 OK`: Returns the updated instructor object.
    ```json
    {
      "_id": "instructor_uuid",
      "firstName": "John",
      "lastName": "Doe",
      "description": "Updated description...",
      ...
    }
    ```
  - `401 Unauthorized`: User is not logged in.
  - `404 Not Found`: Instructor not found.
  - `500 Internal Server Error`: Server error.
