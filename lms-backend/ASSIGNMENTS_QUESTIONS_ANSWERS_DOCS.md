# Assignments, Questions, and Answers API Documentation

Base URL: `/api/v1` (Assuming generic prefix, adjust if known, otherwise just paths)
_Note: The actual base URL might depend on app configuration._

## Assignments

### 1. Get Assignments

**Endpoint:** `GET /assignments`

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | Number | 1 | Page number |
| `pageCount` | Number | 10 | Items per page |
| `search` | String | "" | Search term |

**Response (200 OK):**

```json
{
  "assignments": [
    {
      "_id": "60d5ecb8b5c9c62b3c8b4567",
      "title": "Assignment 1",
      "lecture": "60d5ecb8b5c9c62b3c8b4560",
      "questions": [],
      "createdAt": "2021-06-25T10:00:00.000Z",
      "updatedAt": "2021-06-25T10:00:00.000Z"
    }
  ],
  "page": 1,
  "pageCount": 10,
  "totalItems": 1,
  "totalPages": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

### 2. Get Assignment by ID

**Endpoint:** `GET /assignments/:id`

**Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `id` | String | Assignment ID |

**Response (200 OK):**

```json
{
  "_id": "60d5ecb8b5c9c62b3c8b4567",
  "title": "Assignment 1",
  "lecture": "60d5ecb8b5c9c62b3c8b4560",
  "questions": [],
  "createdAt": "2021-06-25T10:00:00.000Z",
  "updatedAt": "2021-06-25T10:00:00.000Z"
}
```

**Response (404 Not Found):**

```json
{ "message": "Assignment not found" }
```

### 3. Get Assignments by Course ID

**Endpoint:** `GET /assignments/by-course`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `courseId` | String | Yes | - | Course ID |
| `page` | Number | No | 1 | Page number |
| `pageCount` | Number | No | 10 | Items per page |

**Response (200 OK):**

```json
{
  "assignments": [ ... ],
  "page": 1,
  "pageCount": 10,
  "totalItems": 1,
  "totalPages": 1
}
```

### 4. Create Assignment

**Endpoint:** `POST /assignments`

**Request Body:**
| Field | Type | Required | Restrictions | Description |
|---|---|---|---|---|
| `title` | String | Yes | Min 3, Max 100 chars | Title of the assignment |
| `lecture` | String | Yes | - | Lecture ID |
| `questions` | Array<String> | No | - | Array of Question IDs |

**Example Request:**

```json
{
  "title": "Math Assignment 1",
  "lecture": "60d5ecb8b5c9c62b3c8b4560",
  "questions": [],
  "createdAt": "2021-06-25T10:00:00.000Z"
}
```

**Response (201 Created):**
Returns the created assignment object.

### 5. Update Assignment

**Endpoint:** `PUT /assignments/:id`

**Request Body:**
Same as Create Assignment. All fields validated.

**Response (200 OK):**
Returns the updated assignment object.

### 6. Delete Assignment

**Endpoint:** `DELETE /assignments/:id`

**Response (200 OK):**

```json
{ "message": "Assignment deleted successfully" }
```

---

## Questions

### 1. Get Questions

**Endpoint:** `GET /questions`

**Query Parameters:**
Same as Get Assignments (page, pageCount, search).

### 2. Get Question by ID

**Endpoint:** `GET /questions/:id`

**Response (200 OK):**

```json
{
  "_id": "60d5ecb8b5c9c62b3c8b4999",
  "title": "What is 2+2?",
  "type": "multiple-choice",
  "options": ["3", "4", "5"],
  "correctAnswer": "4",
  "points": 5,
  "assignment": "60d5ecb8b5c9c62b3c8b4567"
}
```

### 3. Create Question

**Endpoint:** `POST /questions`

**Request Body:**
| Field | Type | Required | Restrictions | Description |
|---|---|---|---|---|
| `title` | String | Yes | Min 5, Max 500 chars | Question text |
| `type` | String | Yes | one of: "multiple-choice", "true-false", "short-answer", "essay" | Question type |
| `options` | Array<String> | No | - | Options for multiple choice |
| `correctAnswer` | String | Yes | - | The correct answer |
| `points` | Number | Yes | Min 0 | Points value |
| `assignment` | String | _Conditionally_ | - | Assignment ID (Required if exam not provided) |
| `exam` | String | _Conditionally_ | - | Exam ID (Required if assignment not provided) |

_Note: You must provide either `assignment` OR `exam`._

**Example Request:**

```json
{
  "title": "What is the capital of France?",
  "type": "multiple-choice",
  "options": ["Paris", "London", "Berlin"],
  "correctAnswer": "Paris",
  "points": 2,
  "assignment": "60d5ecb8b5c9c62b3c8b4567"
}
```

### 4. Update Question

**Endpoint:** `PUT /questions/:id`

**Request Body:** Same as Create Question.

### 5. Delete Question

**Endpoint:** `DELETE /questions/:id`

**Response (200 OK):**

```json
{ "message": "Question deleted successfully" }
```

### 6. Add Question to Assignment

**Endpoint:** `POST /questions/assignment/:assignmentId`

**Request Body:**
Standard Question object fields.
_IMPORTANT: Due to current validation rules, you must include `assignment` field in the body matching the ID, or providing a dummy valid assignment ID to pass validation._

### 7. Remove Question from Assignment

**Endpoint:** `DELETE /questions/:questionId/assignment`

**(Note: This endpoint functionality depends on service implementation details regarding "removing" vs "deleting" relationship)**

### 8. Add/Remove Question to/from Exam

**Endpoints:**

- `POST /questions/exam/:examId`
- `DELETE /questions/:questionId/exam`

Similar request body and behavior as Assignment endpoints.

---

## Answers

### 1. Create Answer

**Endpoint:** `POST /answers`

**Request Body:**
| Field | Type | Required | Description |
|---|---|---|---|
| `question` | String | Yes | Question ID |
| `value` | String | Yes | The user's answer |
| `submittedAsignment` | String | No | Assignment Attempt ID (Typo in schema: submittedAsignment) |
| `isCorrect` | Boolean | No | Manually marked correct/incorrect |
| `points` | Number | No | Points awarded |

**Example Request:**

```json
{
  "question": "60d5ecb8b5c9c62b3c8b4999",
  "value": "Paris",
  "submittedAsignment": "60d5ecb8b5c9c62b3c8b9999"
}
```

### 2. Get Answer by ID

**Endpoint:** `GET /answers/:id`

### 3. Update Answer

**Endpoint:** `PUT /answers/:id`

### 4. Delete Answer

**Endpoint:** `DELETE /answers/:id`

### 5. Get Answers by Exam Attempt

**Endpoint:** `GET /answers/exam-attempt/:examAttemptId`

**Response (200 OK):**
Returns array of answers.

### 6. Get Answers by Assignment Attempt

**Endpoint:** `GET /answers/assignment-attempt/:assignmentAttemptId`

**Response (200 OK):**
Returns array of answers.
