# Course Comments API Documentation

Base URL: `/course-comments`

---

## 1. Create a Comment

Adds a review/rating to a course.

- **Endpoint**: `/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "course": "uuid-of-course",
    "rate": 5,
    "content": "Excellent course! Highly recommended."
  }
  ```

**Response Example** (201 Created):

```json
{
  "_id": "uuid-comment-1",
  "user": "uuid-user-1",
  "course": "uuid-of-course",
  "rate": 5,
  "content": "Excellent course! Highly recommended.",
  "createdAt": "..."
}
```

---

## 2. Get Comments by Course

Fetches paginated comments for a specific course.

- **Endpoint**: `/course/:courseId`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Response Example** (200 OK):

```json
{
  "data": [
    {
      "_id": "...",
      "user": "...",
      "rate": 5,
      "content": "...",
      "createdAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## 3. Get Course Average Rate

Returns the calculated average rating for a course.

- **Endpoint**: `/course/:courseId/rate`
- **Method**: `GET`

**Response Example** (200 OK):

```json
{
  "courseId": "uuid-course",
  "averageRate": 4.5
}
```

---

## 4. Get Comment by ID

Fetches a single comment.

- **Endpoint**: `/:id`
- **Method**: `GET`

---

## 5. Update Comment

Updates an existing comment. Users can only update their own comments.

- **Endpoint**: `/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Partial fields to update (e.g., `rate`, `content`).

---

## 6. Delete Comment

Deletes a comment. Users can only delete their own comments.

- **Endpoint**: `/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
