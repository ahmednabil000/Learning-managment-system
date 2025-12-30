# Instructor Analytics API Documentation

Base URL: `/analytics/instructor`

All endpoints require the following header:
`Authorization: Bearer <your_jwt_token>`

The system assumes the authenticated user is an **Instructor**.

---

### 1. Get Courses Count

Returns the number of courses created by the instructor within a specific period.

- **Endpoint**: `/courses-count`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate` (optional): Start date in ISO format (e.g., `2023-01-01`). Defaults to 30 days ago.
  - `endDate` (optional): End date in ISO format. Defaults to now.

**Request Example**:

```http
GET /analytics/instructor/courses-count?startDate=2024-01-01&endDate=2024-12-31 HTTP/1.1
Authorization: Bearer <token>
```

**Response Example** (200 OK):

```json
{
  "count": 5,
  "period": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-12-31T00:00:00.000Z"
  }
}
```

---

### 2. Get Enrolled Users Count

Returns the total number of enrollments across all the instructor's courses within a specific period.

- **Endpoint**: `/enrolled-users-count`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate` (optional)
  - `endDate` (optional)

**Response Example** (200 OK):

```json
{
  "count": 142,
  "period": {
    "start": "2024-11-30T10:00:00.000Z",
    "end": "2024-12-30T10:00:00.000Z"
  }
}
```

---

### 3. Get Total Revenue

Returns the total revenue generated from enrollments. Can be filtered by a specific course.

- **Endpoint**: `/total-revenue`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate` (optional)
  - `endDate` (optional)
  - `courseId` (optional): ID of a specific course to filter revenue.

**Request Example**:

```http
GET /analytics/instructor/total-revenue?courseId=course_123 HTTP/1.1
```

**Response Example** (200 OK):

```json
{
  "revenue": 599.50,
  "period": { "..." },
  "courseId": "course_123"
}
```

---

### 4. Get Enrollments by Course

Returns a detailed breakdown of enrollment counts for each of the instructor's courses in the defined period.

- **Endpoint**: `/enrollments-by-course`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate` (optional)
  - `endDate` (optional)

**Response Example** (200 OK):

```json
{
  "data": [
    {
      "courseId": "uuid-1",
      "title": "Introduction to React",
      "count": 45
    },
    {
      "courseId": "uuid-2",
      "title": "Advanced Node.js",
      "count": 12
    }
  ],
  "period": { "..." }
}
```

---

### 5. Get Top Courses

Returns the top performing courses based on all-time enrollments (or filtered if we add date logic later, currently all-time/aggregation specific).

- **Endpoint**: `/top-courses`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Number of courses to return. Defaults to 5.

**Request Example**:

```http
GET /analytics/instructor/top-courses?limit=3 HTTP/1.1
```

**Response Example** (200 OK):

```json
{
  "data": [
    {
      "courseId": "uuid-1",
      "title": "Introduction to React",
      "count": 150
    },
    {
      "courseId": "uuid-5",
      "title": "Web Design Fundamentals",
      "count": 120
    },
    {
      "courseId": "uuid-2",
      "title": "Advanced Node.js",
      "count": 98
    }
  ]
}
```

---

### 6. Get Instructor Rate

Returns the average rating of all courses taught by the instructor.

- **Endpoint**: `/instructor-rate`
- **Method**: `GET`

**Response Example** (200 OK):

```json
{
  "averageRate": 4.7
}
```
