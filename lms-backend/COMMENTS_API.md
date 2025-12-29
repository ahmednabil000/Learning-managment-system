# Comments API Documentation

Base URL: `/comments`

## 1. Create Comment

Create a new comment on a lecture.

- **URL**: `/`
- **Method**: `POST`
- **Auth Required**: Yes

### Request Body

```json
{
  "content": "Does this lecture cover async/await?",
  "lecture": "c8d0a9b-1234-4567-890a-bcdef0123456",
  "parentComment": null
}
```

_Note: `parentComment` is optional. Provide a comment ID if replying to another comment._

### Success Response `201 Created`

```json
{
  "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "content": "Does this lecture cover async/await?",
  "user": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "lecture": "c8d0a9b-1234-4567-890a-bcdef0123456",
  "parentComment": null,
  "_v": 0,
  "createdAt": "2023-12-29T10:00:00.000Z",
  "updatedAt": "2023-12-29T10:00:00.000Z"
}
```

---

## 2. Get Comment by ID

Retrieve details of a single comment.

- **URL**: `/:id`
- **Method**: `GET`
- **Auth Required**: No

### Success Response `200 OK`

```json
{
  "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "content": "Does this lecture cover async/await?",
  "user": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "lecture": "c8d0a9b-1234-4567-890a-bcdef0123456",
  "parentComment": null,
  "_v": 0,
  "createdAt": "2023-12-29T10:00:00.000Z",
  "updatedAt": "2023-12-29T10:00:00.000Z"
}
```

---

## 3. Get Lecture Comments

Retrieve top-level comments for a lecture, including their replies.

- **URL**: `/lecture/:lectureId`
- **Method**: `GET`
- **Auth Required**: No
- **Query Params**: `page=1`, `pageCount=10`

### Success Response `200 OK`

```json
[
  {
    "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "content": "Great lecture!",
    "user": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "lecture": "c8d0a9b-1234-4567-890a-bcdef0123456",
    "parentComment": null,
    "_v": 0,
    "createdAt": "2023-12-29T10:00:00.000Z",
    "updatedAt": "2023-12-29T10:00:00.000Z",
    "replies": [
      {
        "_id": "99887766-5544-3322-1100-aabbccddeeff",
        "content": "I agree, very helpful.",
        "user": "12345678-90ab-cdef-1234-567890abcdef",
        "lecture": "c8d0a9b-1234-4567-890a-bcdef0123456",
        "parentComment": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "_v": 0,
        "createdAt": "2023-12-29T10:05:00.000Z",
        "updatedAt": "2023-12-29T10:05:00.000Z"
      }
    ]
  }
]
```

---

## 4. Update Comment

Update an existing comment text.

- **URL**: `/:id`
- **Method**: `PUT`
- **Auth Required**: Yes

### Request Body

```json
{
  "content": "Updated content here."
}
```

### Success Response `200 OK`

```json
{
  "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "content": "Updated content here.",
  "user": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "lecture": "c8d0a9b-1234-4567-890a-bcdef0123456",
  "parentComment": null,
  "_v": 0,
  "createdAt": "2023-12-29T10:00:00.000Z",
  "updatedAt": "2023-12-29T10:10:00.000Z"
}
```

---

## 5. Delete Comment

Remove a comment.

- **URL**: `/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

### Success Response `200 OK`

```json
{
  "_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "content": "Updated content here.",
  "user": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "lecture": "c8d0a9b-1234-4567-890a-bcdef0123456",
  "parentComment": null,
  "_v": 0,
  "createdAt": "2023-12-29T10:00:00.000Z",
  "updatedAt": "2023-12-29T10:10:00.000Z"
}
```
