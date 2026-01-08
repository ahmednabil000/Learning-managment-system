# Course Blog API Documentation

Base URL: `/course-blogs`

## 1. Create a Course Blog

**Endpoint:** `POST /`

**Description:** Creates a new blog post for a specific course.

**Authentication:** Required (Instructor only). User must be the instructor of the course.

**Headers:**

- `Authorization`: Bearer <token>
- `Content-Type`: application/json

**Request Body:**

| Field       | Type   | Required | Description                          |
| ----------- | ------ | -------- | ------------------------------------ |
| `course`    | String | Yes      | The ID of the course.                |
| `title`     | String | Yes      | Title of the blog (3-100 chars).     |
| `content`   | String | Yes      | Content of the blog (10-1000 chars). |
| `thumbnail` | String | Yes      | URL of the thumbnail image.          |

**Example Request:**

```json
{
  "course": "64f1b2c3e4b0a1a1a1a1a1a1",
  "title": "Introduction to React Hooks",
  "content": "In this blog post, we will explore the basics of React Hooks...",
  "thumbnail": "https://example.com/thumbnail.jpg"
}
```

**Response (Success - 201):**

```json
{
  "statusCode": 201,
  "message": "Course blog created successfully",
  "data": {
{{ ... }}
  }
}
```

**Response (Error):**

- `400 Bad Request`: Validation error.
- `404 Not Found`: Course not found.
- `401 Unauthorized`: User is not the instructor of the course.

---

## 2. Get Course Blogs

**Endpoint:** `GET /course/:courseId`

**Description:** Retrieves a paginated list of blog posts for a specific course.

**Authentication:** Not Required (Public).

**Parameters:**

- `courseId` (path, required): The ID of the course.
- `page` (query, optional): Page number (default: 1).
- `limit` (query, optional): Items per page (default: 10).

**Example Request:**
`GET /course-blogs/course/64f1b2c3e4b0a1a1a1a1a1a1?page=1&limit=5`

**Response (Success - 200):**

````json
[
  {
    "_id": "uuid-v4-string",
    "title": "Introduction to React Hooks",
{{ ... }}

**Endpoint:** `GET /:id`

**Description:** Retrieves the details of a specific blog post.

**Authentication:** Required. User must be **enrolled** in the course associated with the blog.

**Headers:**
- `Authorization`: Bearer <token>

**Response (Success - 200):**
```json
{
  "_id": "uuid-v4-string",
  "course": "64f1b2c3e4b0a1a1a1a1a1a1",
  "user": {
{{ ... }}
  "__v": 0
}
````

**Response (Error):**

- `404 Not Found`: Course blog not found.
- `401 Unauthorized`: User is not authorized to access this course blog (not enrolled).

---

## 4. Update Course Blog

**Endpoint:** `PUT /:id`

**Description:** Updates an existing blog post. Only the creator (instructor) can update it.

**Authentication:** Required.

**Request Body:** (Any subset of fields)

```json
{
  "title": "Advanced React Hooks",
  "content": "Updated content..."
}
```

**Response (Success - 200):**

```json
{
  "_id": "uuid-v4-string",
  "course": "64f1b2c3e4b0a1a1a1a1a1a1",
  "user": "user-id",
{{ ... }}
  "__v": 0
}
```

**Response (Error):**

- `404 Not Found`: Blog not found.
- `401 Unauthorized`: User is not the owner.

---

## 5. Delete Course Blog

**Endpoint:** `DELETE /:id`

**Description:** Deletes a blog post. Only the creator (instructor) can delete it.

**Authentication:** Required.

**Response (Success - 200):**

```json
{
  "message": "Course blog deleted successfully"
}
```

**Response (Error):**

- `404 Not Found`: Blog not found.
- `401 Unauthorized`: User is not the owner.
