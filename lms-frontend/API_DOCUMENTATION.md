# LMS Backend API Documentation

## Base URL

```
http://localhost:7000
```

---

## Table of Contents

- [Courses](#courses)
- [Course Tags](#course-tags)
- [Lectures](#lectures)
- [Lessons](#lessons)

---

## ID Format

All resources use UUID v4 format for their primary identifier stored in the `_id` field. Example: `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`

**Important:** MongoDB's default ObjectId has been replaced with UUID strings as the `_id` field across all models. This provides:

- Human-readable, consistent identifiers across all resources
- Better client-side caching and tracking
- URL-friendly identifiers without encoding issues

When making API requests, use the `_id` value (UUID string) for all path parameters and identifiers.

---

## Courses

### Get All Courses (with pagination)

**GET** `/courses`

Get a paginated list of all courses with search functionality.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number (min: 1) |
| pageCount | number | 10 | Items per page (min: 1) |
| search | string | "" | Search query for course title/description |

**Response:** `200 OK`

```json
{
  "shortCourses": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": "number",
      "imageUrl": "string"
    }
  ],
  "page": 1,
  "pageCount": 10,
  "totalItems": 50,
  "totalPages": 5,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

**Error Responses:**

- `500 Internal Server Error` - Server error

---

### Get Course by ID

**GET** `/courses/:id`

Get detailed information about a specific course.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Course ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "instructor": "string"
}
```

**Error Responses:**

- `404 Not Found` - Course not found
- `500 Internal Server Error` - Server error

---

### Create Course

**POST** `/courses`

Create a new course.

**Request Body:**

```json
{
  "title": "string (5-50 chars, required)",
  "description": "string (10-300 chars, required)",
  "price": "number (required)",
  "imageUrl": "string (optional)",
  "instructor": "string (required)"
}
```

**Response:** `201 Created`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "instructor": "string"
}
```

**Error Responses:**

- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

---

### Update Course

**PUT** `/courses/:id`

Update an existing course.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Course ID |

**Request Body:**

```json
{
  "title": "string (5-50 chars, required)",
  "description": "string (10-300 chars, required)",
  "price": "number (required)",
  "imageUrl": "string (optional)",
  "instructor": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "instructor": "string"
}
```

**Error Responses:**

- `400 Bad Request` - Validation error
- `404 Not Found` - Course not found
- `500 Internal Server Error` - Server error

---

### Delete Course

**DELETE** `/courses/:id`

Delete a specific course.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Course ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "instructor": "string"
}
```

**Error Responses:**

- `404 Not Found` - Course not found
- `500 Internal Server Error` - Server error

---

## Course Tags

### Get All Course Tags (with pagination)

**GET** `/course-tags`

Get a paginated list of all course tags with search functionality.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number (min: 1) |
| pageCount | number | 10 | Items per page (min: 1) |
| search | string | "" | Search query for tag name/description |

**Response:** `200 OK`

```json
{
  "tags": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "page": 1,
  "pageCount": 10,
  "totalItems": 50,
  "totalPages": 5,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

**Error Responses:**

- `500 Internal Server Error` - Server error

---

### Get Course Tag by ID

**GET** `/course-tags/:id`

Get detailed information about a specific course tag.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Tag ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "name": "string",
  "description": "string"
}
```

**Error Responses:**

- `404 Not Found` - Tag not found
- `500 Internal Server Error` - Server error

---

### Create Course Tag

**POST** `/course-tags`

Create a new course tag.

**Request Body:**

```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Response:** `201 Created`

```json
{
  "id": "string",
  "name": "string",
  "description": "string"
}
```

**Error Responses:**

- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

---

### Update Course Tag

**PUT** `/course-tags/:id`

Update an existing course tag.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Tag ID |

**Request Body:**

```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Response:** `200 OK`

```json
{
  "id": "string",
  "name": "string",
  "description": "string"
}
```

**Error Responses:**

- `400 Bad Request` - Validation error
- `404 Not Found` - Tag not found
- `500 Internal Server Error` - Server error

---

### Delete Course Tag

**DELETE** `/course-tags/:id`

Delete a specific course tag.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Tag ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "name": "string",
  "description": "string"
}
```

**Error Responses:**

- `404 Not Found` - Tag not found
- `500 Internal Server Error` - Server error

---

## Lectures

### Get All Lectures (with pagination)

**GET** `/lectures`

Get a paginated list of all lectures with search functionality.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number (min: 1) |
| pageCount | number | 10 | Items per page (min: 1) |
| search | string | "" | Search query for lecture title/description |

**Response:** `200 OK`

```json
{
  "lectures": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "courseId": "string",
      "order": "number"
    }
  ],
  "page": 1,
  "pageCount": 10,
  "totalItems": 50,
  "totalPages": 5,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

**Error Responses:**

- `500 Internal Server Error` - Server error

---

### Get Lectures by Course ID

**GET** `/lectures/course/:courseId`

Get all lectures for a specific course, sorted by order.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| courseId | string | Course ID (UUID) |

**Response:** `200 OK`

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "course": "ObjectId",
    "order": "number",
    "lessons": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "videoUrl": "string",
        "duration": "number",
        "order": "number"
      }
    ],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

**Error Responses:**

- `404 Not Found` - Course not found
- `500 Internal Server Error` - Server error

---

### Get Lecture by ID

**GET** `/lectures/:id`

Get detailed information about a specific lecture.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Lecture ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "courseId": "string",
  "order": "number",
  "lessons": []
}
```

**Error Responses:**

- `404 Not Found` - Lecture not found
- `500 Internal Server Error` - Server error

---

### Create Lecture

**POST** `/lectures`

Create a new lecture.

**Request Body:**

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "courseId": "string (required)",
  "order": "number (required)"
}
```

**Response:** `201 Created`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "courseId": "string",
  "order": "number"
}
```

**Error Responses:**

- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

---

### Update Lecture

**PUT** `/lectures/:id`

Update an existing lecture.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Lecture ID |

**Request Body:**

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "courseId": "string (required)",
  "order": "number (required)"
}
```

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "courseId": "string",
  "order": "number"
}
```

**Error Responses:**

- `400 Bad Request` - Validation error
- `404 Not Found` - Lecture not found
- `500 Internal Server Error` - Server error

---

### Delete Lecture

**DELETE** `/lectures/:id`

Delete a specific lecture.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Lecture ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "courseId": "string",
  "order": "number"
}
```

**Error Responses:**

- `404 Not Found` - Lecture not found
- `500 Internal Server Error` - Server error

---

### Add Lesson to Lecture

**POST** `/lectures/:lectureId/lessons`

Add a lesson to a specific lecture.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| lectureId | string | Lecture ID |

**Request Body:**

```json
{
  "lessonId": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "courseId": "string",
  "order": "number",
  "lessons": ["lessonId"]
}
```

**Error Responses:**

- `404 Not Found` - Lecture or Lesson not found
- `500 Internal Server Error` - Server error

---

### Remove Lesson from Lecture

**DELETE** `/lectures/:lectureId/lessons/:lessonId`

Remove a lesson from a specific lecture.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| lectureId | string | Lecture ID |
| lessonId | string | Lesson ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "courseId": "string",
  "order": "number",
  "lessons": []
}
```

**Error Responses:**

- `404 Not Found` - Lecture or Lesson not found
- `500 Internal Server Error` - Server error

---

## Lessons

### Get Lesson by ID

**GET** `/lessons/:id`

Get detailed information about a specific lesson.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Lesson ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "lectureId": "string",
  "order": "number",
  "duration": "number",
  "videoUrl": "string"
}
```

**Error Responses:**

- `404 Not Found` - Lesson not found
- `500 Internal Server Error` - Server error

---

### Get Lessons by Lecture ID

**GET** `/lessons/:lectureId/lessons`

Get all lessons for a specific lecture.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| lectureId | string | Lecture ID |

**Response:** `200 OK`

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "lectureId": "string",
    "order": "number",
    "duration": "number",
    "videoUrl": "string"
  }
]
```

**Error Responses:**

- `500 Internal Server Error` - Server error

---

### Create Lesson

**POST** `/lessons`

Create a new lesson.

**Request Body:**

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "lectureId": "string (required)",
  "order": "number (required)",
  "duration": "number (required)",
  "videoUrl": "string (required)"
}
```

**Response:** `201 Created`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "lectureId": "string",
  "order": "number",
  "duration": "number",
  "videoUrl": "string"
}
```

**Error Responses:**

- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

---

### Update Lesson

**PUT** `/lessons/:id`

Update an existing lesson.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Lesson ID |

**Request Body:**

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "lectureId": "string (required)",
  "order": "number (required)",
  "duration": "number (required)",
  "videoUrl": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "lectureId": "string",
  "order": "number",
  "duration": "number",
  "videoUrl": "string"
}
```

**Error Responses:**

- `400 Bad Request` - Validation error
- `404 Not Found` - Lesson not found
- `500 Internal Server Error` - Server error

---

### Delete Lesson

**DELETE** `/lessons/:id`

Delete a specific lesson.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Lesson ID |

**Response:** `200 OK`

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "lectureId": "string",
  "order": "number",
  "duration": "number",
  "videoUrl": "string"
}
```

**Error Responses:**

- `404 Not Found` - Lesson not found
- `500 Internal Server Error` - Server error

---

## Common Error Response Format

All endpoints return errors in the following format:

```json
{
  "message": "Error message description"
}
```

## Pagination Parameters

Endpoints that support pagination accept the following query parameters:

| Parameter | Type   | Default | Validation | Description              |
| --------- | ------ | ------- | ---------- | ------------------------ |
| page      | number | 1       | min: 1     | Current page number      |
| pageCount | number | 10      | min: 1     | Number of items per page |
| search    | string | ""      | -          | Search query string      |

## Notes

- All endpoints return JSON responses
- Timestamps (`createdAt`, `updatedAt`) are automatically added to all resources
- All resources use UUID v4 strings as their `_id` field (primary identifier)
- The `_id` field replaces MongoDB's default ObjectId across all models
- Path parameters use the UUID `_id` field (e.g., `/courses/:id` expects a UUID string)
- The search functionality performs case-insensitive partial matches on relevant text fields
- All foreign key references in request bodies should use the appropriate resource ID
