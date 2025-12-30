# Courses API Documentation

Base URL: `/courses`

---

## 1. Get All Courses

Fetches a paginated list of all courses.

- **Endpoint**: `/`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `pageCount` (optional): Items per page (default: 10)
  - `search` (optional): Search term for course titles

**Response Example** (200 OK):

```json
{
  "shortCourses": [
    {
      "_id": "uuid",
      "title": "Intro to Programming",
      "price": 49.99,
      "salePrice": 29.99,
      "discount": 20,
      "imageUrl": "...",
      "level": "beginner"
    }
  ],
  "page": 1,
  "pageCount": 10,
  "totalItems": 15,
  "totalPages": 2,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

---

## 2. Get Course by ID

Fetches details of a specific course, including lectures and current sale info.

- **Endpoint**: `/:id`
- **Method**: `GET`

**Response Example** (200 OK):

```json
{
  "_id": "uuid",
  "title": "Intro to Programming",
  "price": 49.99,
  "salePrice": 29.99,
  "discount": 20,
  "lectures": [...],
  "instructor": "...",
  "status": "published"
}
```

---

## 3. Create Course

Creates a new course.

- **Endpoint**: `/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "New Course",
    "description": "Course description...",
    "price": 99.99,
    "imageUrl": "http://...",
    "tag": "uuid-tag",
    "level": "intermediate"
  }
  ```

---

## 4. Update Course

Updates an existing course.

- **Endpoint**: `/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "price": 79.99
  }
  ```

---

## 5. Delete Course

Deletes a course.

- **Endpoint**: `/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`

---

## 6. Add/Update Course Discount (Sale)

Sets a course on sale for a specific duration.

- **Endpoint**: `/:courseId/discount`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "salePrice": 29.99,
    "discount": 40,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-07T00:00:00Z"
  }
  ```

**Response Example** (200 OK):

```json
{
  "statusCode": 200,
  "message": "Course discount added successfully"
}
```

---

## 7. Remove Course Discount

Removes any active discount/sale from the course.

- **Endpoint**: `/:courseId/discount`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`

**Response Example** (200 OK):

```json
{
  "statusCode": 200,
  "message": "Course discount removed successfully"
}
```
