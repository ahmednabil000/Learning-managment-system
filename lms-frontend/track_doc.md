# Track API Documentation

This documentation outlines the endpoints for managing tracks and purchasing them.

## Base URL

`/api/tracks`
`/api/payment`

---

## 1. Get All Tracks

Retrieves a paginated list of tracks.

**Endpoint:** `GET /api/tracks`

**Query Parameters:**

- `page` (number, required): Page number (starting from 1).
- `pageCount` (number, required): Number of items per page.
- `search` (string, optional): Search query for title or description.

**Response:**

```json
{
  "tracks": [
    {
      "_id": "5f8d0d55b54764421b7156c2",
      "title": "Full Stack Web Development",
      "description": "Master the MERN stack with this comprehensive track.",
      "discount": 20,
      "thumbnail": "https://example.com/track-thumbnail.jpg",
      "duration": 4500,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "user": {
        "_id": "5f8d04f1b54764421b7156c1",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "imageUrl": "https://example.com/avatar.jpg",
        "role": "Instructor"
      },
      "courses": [
        {
          "_id": "5f8d0d55b54764421b7156d3",
          "title": "React Fundamentals",
          "description": "Learn the basics of React.",
          "price": 50,
          "imageUrl": "https://example.com/react.jpg",
          "instructor": "5f8d04f1b54764421b7156c1",
          "tag": "5f8d0d55b54764421b7156a1",
          "level": "beginner",
          "createdAt": "2024-01-10T10:00:00.000Z",
          "updatedAt": "2024-01-10T10:00:00.000Z"
        },
        {
          "_id": "5f8d0d55b54764421b7156d4",
          "title": "Advanced Node.js",
          "description": "Deep dive into Node.js backend.",
          "price": 60,
          "imageUrl": "https://example.com/node.jpg",
          "instructor": "5f8d04f1b54764421b7156c1",
          "tag": "5f8d0d55b54764421b7156a2",
          "level": "advanced",
          "createdAt": "2024-01-12T10:00:00.000Z",
          "updatedAt": "2024-01-12T10:00:00.000Z"
        }
      ]
    }
  ],
  "page": 1,
  "pageCount": 10,
  "totalItems": 1,
  "totalPages": 1,
  "hasPrevPage": false,
  "hasNextPage": false
}
```

---

## 2. Get Track by ID

Retrieves details of a specific track.

**Endpoint:** `GET /api/tracks/:id`

**Response:**

```json
{
  "_id": "5f8d0d55b54764421b7156c2",
  "title": "Full Stack Web Development",
  "description": "Master the MERN stack with this comprehensive track.",
  "discount": 20,
  "thumbnail": "https://example.com/track-thumbnail.jpg",
  "duration": 4500,
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "user": {
    "_id": "5f8d04f1b54764421b7156c1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "googleId": "123456789",
    "imageUrl": "https://example.com/avatar.jpg",
    "role": "Instructor"
  },
  "courses": [
    {
      "_id": "5f8d0d55b54764421b7156d3",
      "title": "React Fundamentals",
      "description": "Learn the basics of React.",
      "price": 50,
      "imageUrl": "https://example.com/react.jpg",
      "instructor": "5f8d04f1b54764421b7156c1",
      "tag": "5f8d0d55b54764421b7156a1",
      "level": "beginner",
      "createdAt": "2024-01-10T10:00:00.000Z",
      "updatedAt": "2024-01-10T10:00:00.000Z"
    }
  ]
}
```

---

## 3. Create Track

Creates a new track. Requires authentication.

**Endpoint:** `POST /api/tracks`

**Headers:**
`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "New Track",
  "description": "Track description",
  "thumbnail": "http://example.com/image.png",
  "discount": 15, // Percentage (5-100)
  "isActive": false, // Optional, default false
  "courses": ["5f8d0d55b54764421b7156d3"] // Optional initial courses
}
```

**Response:**

```json
{
  "title": "New Track",
  "description": "Track description",
  "thumbnail": "http://example.com/image.png",
  "discount": 15,
  "isActive": false,
  "user": "5f8d04f1b54764421b7156c1", // User ID
  "courses": ["5f8d0d55b54764421b7156d3"],
  "_id": "5f8d0d55b54764421b7156c3",
  "createdAt": "2024-01-16T10:00:00.000Z",
  "updatedAt": "2024-01-16T10:00:00.000Z",
  "__v": 0
}
```

---

## 4. Update Track

Updates an existing track. Requires authentication and ownership.

**Endpoint:** `PUT /api/tracks/:id`

**Headers:**
`Authorization: Bearer <token>`

**Request Body:** (All fields optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "discount": 20,
  "thumbnail": "new-url",
  "isActive": true
}
```

**Response:**

```json
{
  "_id": "5f8d0d55b54764421b7156c2",
  "title": "Updated Title",
  "description": "Updated description",
  "discount": 20,
  "thumbnail": "new-url",
  "isActive": true,
  "user": "5f8d04f1b54764421b7156c1",
  "courses": ["5f8d0d55b54764421b7156d3"],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-16T11:00:00.000Z",
  "__v": 0
}
```

---

## 5. Delete Track

Deletes a track. Requires authentication and ownership.

**Endpoint:** `DELETE /api/tracks/:id`

**Headers:**
`Authorization: Bearer <token>`

**Response:**

```json
{
  "_id": "5f8d0d55b54764421b7156c2",
  "title": "Full Stack Web Development",
  "description": "Master the MERN stack with this comprehensive track.",
  "user": "5f8d04f1b54764421b7156c1",
  "courses": ["5f8d0d55b54764421b7156d3"],
  ...
}
```

---

## 6. Add Course to Track

Adds a course to a track. Requires authentication and ownership.

**Endpoint:** `POST /api/tracks/:id/courses`

**Headers:**
`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "courseId": "5f8d0d55b54764421b7156d4"
}
```

**Response:**

```json
{
  "_id": "5f8d0d55b54764421b7156c2",
  "title": "Full Stack Web Development",
  "courses": [
    "5f8d0d55b54764421b7156d3",
    "5f8d0d55b54764421b7156d4"
  ],
  "user": "5f8d04f1b54764421b7156c1",
  "updatedAt": "2024-01-16T12:00:00.000Z",
  ...
}
```

---

## 7. Remove Course from Track

Removes a course from a track. Requires authentication and ownership.

**Endpoint:** `DELETE /api/tracks/:id/courses/:courseId`

**Headers:**
`Authorization: Bearer <token>`

**Response:**

```json
{
  "_id": "5f8d0d55b54764421b7156c2",
  "title": "Full Stack Web Development",
  "courses": [
    "5f8d0d55b54764421b7156d3"
  ],
  "user": "5f8d04f1b54764421b7156c1",
  ...
}
```

---

## 8. Create Track Payment Intent

Initiates a payment for purchasing a track.

**Endpoint:** `POST /api/payment/create-track-payment-intent`

> **Note:** The total price is calculated based on the courses in the track. If the user is already enrolled in any of the courses within the track, those courses are excluded from the total price calculation. The track discount is then applied to the remaining total.

**Headers:**
`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "trackId": "5f8d0d55b54764421b7156c2"
}
```

**Response:**

```json
{
  "clientSecret": "pi_3Og..."
}
```

---

## 9. Success Track Payment

Completes the enrollment process after a successful payment for a track.

**Endpoint:** `POST /api/payment/success-track-payment`

**Headers:**
`Authorization: Bearer <token>`

**Request Body:**

```json
{
  "trackId": "5f8d0d55b54764421b7156c2"
}
```

**Response:**

```json
{
  "message": "User enrolled in track courses successfully"
}
```

---

## 10. Get Instructor Tracks

Retrieves a paginated list of tracks created by a specific instructor.

**Endpoint:** `GET /api/tracks/instructor/:instructorId`

**Query Parameters:**

- `page` (number, optional): Page number (default: 1).
- `limit` (number, optional): Number of items per page (default: 10).

**Response:**

```json
{
  "tracks": [
    {
      "_id": "track-uuid",
      "title": "Instructor's Track",
      "description": "...",
      "discount": 10,
      "thumbnail": "url",
      "courses": [ ... ],
      "active": true
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
