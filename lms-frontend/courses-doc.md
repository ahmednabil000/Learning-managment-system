# Courses API Documentation

Base URL: `/courses`

---

## Authentication Note

Some endpoints support optional authentication. When a valid JWT token is provided in the `Authorization` header, the response will include `isEnroll` field indicating whether the authenticated user is enrolled in each course.

---

## 1. Get All Courses

Fetches a paginated list of all courses.

- **Endpoint**: `/`
- **Method**: `GET`
- **Headers** (optional): `Authorization: Bearer <token>`
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
      "description": "Learn the fundamentals of programming...",
      "price": 49.99,
      "salePrice": 29.99,
      "discount": 20,
      "imageUrl": "https://example.com/image.jpg",
      "level": "beginner",
      "isEnroll": false,
      "rate": 4.5,
      "reviewCount": 120,
      "studentsCount": 350
    },
    {
      "_id": "uuid-2",
      "title": "Advanced JavaScript",
      "description": "Master advanced JavaScript concepts...",
      "price": 79.99,
      "salePrice": null,
      "discount": null,
      "imageUrl": "https://example.com/js-image.jpg",
      "level": "advanced",
      "isEnroll": true,
      "rate": 0,
      "reviewCount": 0
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

### Response Fields

| Field                          | Type           | Description                                                 |
| ------------------------------ | -------------- | ----------------------------------------------------------- |
| `shortCourses`                 | Array          | Array of course objects                                     |
| `shortCourses[]._id`           | String (UUID)  | Unique course identifier                                    |
| `shortCourses[].title`         | String         | Course title                                                |
| `shortCourses[].description`   | String         | Course description                                          |
| `shortCourses[].price`         | Number         | Original course price                                       |
| `shortCourses[].salePrice`     | Number \| null | Discounted price (if on sale)                               |
| `shortCourses[].discount`      | Number \| null | Discount percentage (if on sale)                            |
| `shortCourses[].imageUrl`      | String         | Course thumbnail URL                                        |
| `shortCourses[].level`         | String         | Course difficulty level                                     |
| `shortCourses[].isEnroll`      | Boolean        | `true` if authenticated user is enrolled, `false` otherwise |
| `shortCourses[].rate`          | Number         | Average course rating (0-5)                                 |
| `shortCourses[].reviewCount`   | Number         | Total number of reviews                                     |
| `shortCourses[].studentsCount` | Number         | Total number of enrolled students                           |
| `page`                         | Number         | Current page number                                         |
| `pageCount`                    | Number         | Items per page                                              |
| `totalItems`                   | Number         | Total number of courses                                     |
| `totalPages`                   | Number         | Total number of pages                                       |
| `hasPrevPage`                  | Boolean        | Whether a previous page exists                              |
| `hasNextPage`                  | Boolean        | Whether a next page exists                                  |
| `prevPage`                     | Number \| null | Previous page number                                        |
| `nextPage`                     | Number \| null | Next page number                                            |

---

## 2. Get Course by ID

Fetches details of a specific course, including lectures, lessons, and current sale info.

- **Endpoint**: `/:id`
- **Method**: `GET`
- **Headers** (optional): `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id` (required): Course UUID

**Response Example** (200 OK):

```json
{
  "_id": "uuid",
  "title": "Intro to Programming",
  "description": "Learn the fundamentals of programming...",
  "price": 49.99,
  "salePrice": 29.99,
  "discount": 20,
  "imageUrl": "https://example.com/image.jpg",
  "level": "beginner",
  "isEnroll": true,
  "rate": 4.5,
  "reviewCount": 120,
  "studentsCount": 350,
  "totalDuration": 360,
  "instructor": {
    "_id": "instructor-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "imageUrl": "https://example.com/avatar.jpg"
  },
  "tag": {
    "_id": "tag-uuid",
    "name": "Programming",
    "description": "Programming courses"
  },
  "lectures": [
    {
      "_id": "lecture-uuid",
      "title": "Getting Started",
      "order": 1,
      "lessons": [
        {
          "_id": "lesson-uuid",
          "title": "Introduction",
          "videoUrl": "https://video.com/intro.mp4",
          "duration": 15,
          "order": 1,
          "isOpen": true
        },
        {
          "_id": "lesson-uuid-2",
          "title": "Setting Up Your Environment",
          "videoUrl": "https://video.com/setup.mp4",
          "duration": 20,
          "order": 2,
          "isOpen": false
        }
      ]
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

### Response Fields

| Field           | Type                | Description                                                 |
| --------------- | ------------------- | ----------------------------------------------------------- |
| `_id`           | String (UUID)       | Unique course identifier                                    |
| `title`         | String              | Course title                                                |
| `description`   | String              | Course description                                          |
| `price`         | Number              | Original course price                                       |
| `salePrice`     | Number \| undefined | Discounted price (if on sale)                               |
| `discount`      | Number \| undefined | Discount percentage (if on sale)                            |
| `imageUrl`      | String              | Course thumbnail URL                                        |
| `level`         | String              | Course difficulty level                                     |
| `isEnroll`      | Boolean             | `true` if authenticated user is enrolled, `false` otherwise |
| `rate`          | Number              | Average course rating (0-5)                                 |
| `reviewCount`   | Number              | Total number of reviews                                     |
| `studentsCount` | Number              | Total number of enrolled students                           |
| `totalDuration` | Number              | Total duration of all lessons in minutes                    |
| `instructor`    | Object              | Instructor details                                          |
| `tag`           | Object              | Course category tag                                         |
| `lectures`      | Array               | Array of lectures with nested lessons                       |
| `createdAt`     | String (ISO Date)   | Course creation timestamp                                   |
| `updatedAt`     | String (ISO Date)   | Last update timestamp                                       |

### Error Responses

| Status Code | Description           |
| ----------- | --------------------- |
| 404         | Course not found      |
| 500         | Internal server error |

---

## 3. Create Course

Creates a new course. Requires authentication as an instructor.

- **Endpoint**: `/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>` (required)
- **Body**:

```json
{
  "title": "New Course",
  "description": "Course description...",
  "price": 99.99,
  "imageUrl": "https://example.com/image.jpg",
  "tag": "uuid-tag",
  "level": "intermediate"
}
```

### Request Body Fields

| Field         | Type          | Required | Description                                     |
| ------------- | ------------- | -------- | ----------------------------------------------- |
| `title`       | String        | Yes      | Course title (5-50 characters)                  |
| `description` | String        | Yes      | Course description (10-300 characters)          |
| `price`       | Number        | Yes      | Course price                                    |
| `imageUrl`    | String        | No       | Course thumbnail URL                            |
| `tag`         | String (UUID) | Yes      | Course category tag ID                          |
| `level`       | String        | No       | Course level (beginner, intermediate, advanced) |

**Response Example** (201 Created):

```json
{
  "_id": "new-course-uuid",
  "title": "New Course",
  "description": "Course description...",
  "price": 99.99,
  "imageUrl": "https://example.com/image.jpg",
  "instructor": "instructor-uuid",
  "tag": "uuid-tag",
  "level": "intermediate",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 4. Update Course

Updates an existing course. Requires authentication as the course instructor.

- **Endpoint**: `/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>` (required)
- **Path Parameters**:
  - `id` (required): Course UUID
- **Body**:

```json
{
  "title": "Updated Title",
  "description": "Updated description...",
  "price": 79.99,
  "imageUrl": "https://example.com/new-image.jpg",
  "tag": "new-tag-uuid",
  "level": "advanced"
}
```

**Response Example** (200 OK):

```json
{
  "_id": "course-uuid",
  "title": "Updated Title",
  "description": "Updated description...",
  "price": 79.99,
  "imageUrl": "https://example.com/new-image.jpg",
  "instructor": "instructor-uuid",
  "tag": "new-tag-uuid",
  "level": "advanced",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

## 5. Delete Course

Deletes a course. Requires authentication as the course instructor.

- **Endpoint**: `/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>` (required)
- **Path Parameters**:
  - `id` (required): Course UUID

**Response Example** (200 OK):

```json
{
  "_id": "course-uuid",
  "title": "Deleted Course",
  "description": "...",
  "price": 49.99
}
```

---

## 6. Add/Update Course Discount (Sale)

Sets a course on sale for a specific duration. Requires authentication as the course instructor.

- **Endpoint**: `/:courseId/discount`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>` (required)
- **Path Parameters**:
  - `courseId` (required): Course UUID
- **Body**:

```json
{
  "discount": 40,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-07T00:00:00Z"
}
```

### Request Body Fields

| Field       | Type              | Required | Description                 |
| ----------- | ----------------- | -------- | --------------------------- |
| `discount`  | Number            | Yes      | Discount percentage (0-100) |
| `startDate` | String (ISO Date) | Yes      | Sale start date             |
| `endDate`   | String (ISO Date) | Yes      | Sale end date               |

**Response Example** (200 OK):

```json
{
  "statusCode": 200,
  "message": "Course discount added successfully"
}
```

### Error Responses

| Status Code | Description                                           |
| ----------- | ----------------------------------------------------- |
| 403         | You are not authorized to add discount to this course |
| 404         | Course not found                                      |
| 500         | Internal server error                                 |

---

## 7. Remove Course Discount

Removes any active discount/sale from the course. Requires authentication as the course instructor.

- **Endpoint**: `/:courseId/discount`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>` (required)
- **Path Parameters**:
  - `courseId` (required): Course UUID

**Response Example** (200 OK):

```json
{
  "statusCode": 200,
  "message": "Course discount removed successfully"
}
```

---

## 8. Get Instructor Courses

Fetches all courses created by a specific instructor.

- **Endpoint**: `/instructor/:instructorId`
- **Method**: `GET`
- **Path Parameters**:
  - `instructorId` (required): Instructor UUID
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Response Example** (200 OK):

```json
{
  "courses": [
    {
      "_id": "course-uuid",
      "title": "My Course",
      "description": "...",
      "price": 49.99,
      "imageUrl": "...",
      "level": "beginner",
      "tag": {
        "_id": "tag-uuid",
        "name": "Programming"
      }
    }
  ],
  "page": 1,
  "limit": 10,
  "totalItems": 5,
  "totalPages": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

---

## 9. Get My Enrolled Courses

Fetches all courses the authenticated user is currently enrolled in.

- **Endpoint**: `/my-courses`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>` (required)
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Response Example** (200 OK):

```json
{
  "courses": [
    {
      "_id": "course-uuid",
      "title": "Enrolled Course Title",
      "description": "...",
      "price": 49.99,
      "imageUrl": "...",
      "level": "beginner",
      "instructor": "instructor-id",
      "tag": "tag-id",
      "rate": 4.5,
      "reviewCount": 12,
      "studentsCount": 150,
      "enrolledAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "totalItems": 3,
  "totalPages": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

---

---

## 10. Manage Course Learning Items

### Add Learning Item

Adds a new "What you will learn" item to the course.

- **Endpoint**: `/:id/learning`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id` (required): Course UUID
- **Request Body**:
  ```json
  {
    "learningItem": "Master React Hooks and Context API"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "_id": "course-uuid",
    "title": "React Course",
    "learning": [
      "Understand Components",
      "Master React Hooks and Context API"
    ],
    ...
  }
  ```

### Remove Learning Item

Removes a learning item by its index.

- **Endpoint**: `/:id/learning/:index`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id` (required): Course UUID
  - `index` (required): Index of the item to remove (0-based)
- **Response** (200 OK):
  ```json
  {
    "_id": "course-uuid",
    "learning": [
      "Understand Components"
    ],
    ...
  }
  ```

### Update Learning Item

Updates a specific learning item by its index.

- **Endpoint**: `/:id/learning/:index`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id` (required): Course UUID
  - `index` (required): Index of the item to update (0-based)
- **Request Body**:
  ```json
  {
    "learningItem": "Master React Hooks (Updated)"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "_id": "course-uuid",
    "learning": [
      "Master React Hooks (Updated)",
      ...
    ],
    ...
  }
  ```

---

## 11. Manage Course Requirements

### Add Requirement

Adds a new requirement/prerequisite to the course.

- **Endpoint**: `/:id/requirements`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id` (required): Course UUID
- **Request Body**:
  ```json
  {
    "requirementItem": "Basic JavaScript knowledge"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "_id": "course-uuid",
    "requirements": [
      "No prior experience needed",
      "Basic JavaScript knowledge"
    ],
    ...
  }
  ```

### Remove Requirement

Removes a requirement by its index.

- **Endpoint**: `/:id/requirements/:index`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id` (required): Course UUID
  - `index` (required): Index of the item to remove (0-based)
- **Response** (200 OK):
  ```json
  {
    "_id": "course-uuid",
    "requirements": [
      "No prior experience needed"
    ],
    ...
  }
  ```

### Update Requirement

Updates a specific requirement by its index.

- **Endpoint**: `/:id/requirements/:index`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Path Parameters**:
  - `id` (required): Course UUID
  - `index` (required): Index of the item to update (0-based)
- **Request Body**:
  ```json
  {
    "requirementItem": "Intermediate JS needed"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "_id": "course-uuid",
    "requirements": [
      "Intermediate JS needed",
      ...
    ],
    ...
  }
  ```

### Common Error Responses

| Status Code | Description                         |
| ----------- | ----------------------------------- |
| 400         | Invalid item or index out of bounds |
| 403         | Unauthorized (Not the instructor)   |
| 404         | Course not found                    |
| 500         | Server error                        |

---

## 12. Get Top Courses

Fetches a list of the most popular courses based on enrollment numbers.

- **Endpoint**: `/top`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Number of courses to retrieve (default: 10)

**Response Example** (200 OK):

```json
[
  {
    "_id": "course-uuid",
    "title": "Popular Course",
    "description": "...",
    "price": 49.99,
    "imageUrl": "...",
    "level": "beginner",
    "instructor": { ... },
    "tag": { ... },
    "rate": 4.8,
    "reviewCount": 150,
    "studentsCount": 500
  },
  ...
]
```
