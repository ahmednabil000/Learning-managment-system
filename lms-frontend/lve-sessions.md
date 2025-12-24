# Live Sessions API Documentation

## Overview

The Live Sessions API provides endpoints for managing live video sessions using Daily.co for video conferencing and Cloudinary for recording storage.

## Base URL

```
http://localhost:7000/sessions
```

---

## Endpoints

### Create Live Session

**POST** `/sessions`

Create a new live session with a Daily.co room.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "title": "string (3-200 chars, required)",
  "description": "string (max 1000 chars, optional)",
  "courseId": "string (UUID, required)",
  "instructorId": "string (UUID, optional - auto from auth)",
  "scheduledAt": "ISO date (future date, required)",
  "duration": "number (15-480 minutes, required)",
  "maxParticipants": "number (1-1000, default: 100, optional)"
}
```

**Response:** `201 Created`

```json
{
  "_id": "uuid-string",
  "title": "Introduction to JavaScript",
  "description": "Live coding session",
  "course": "course-uuid",
  "instructor": "instructor-uuid",
  "roomName": "introduction-to-javascript-1234567890",
  "roomUrl": "https://your-domain.daily.co/room-name",
  "scheduledAt": "2025-12-25T10:00:00.000Z",
  "duration": 60,
  "status": "scheduled",
  "maxParticipants": 100,
  "participants": [],
  "isRecorded": false,
  "createdAt": "2025-12-23T...",
  "updatedAt": "2025-12-23T..."
}
```

**Error Response:** `400 Bad Request`

```json
{
  "message": "\"title\" is required"
}
```

**Error Response:** `400 Bad Request` (Invalid Date)

```json
{
  "message": "\"scheduledAt\" must be greater than or equal to now"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "message": "Failed to create Daily.co room"
}
```

---

### Get All Live Sessions

**GET** `/sessions`

Get paginated list of all live sessions.

**Authentication:** Required (Bearer Token)

**Query Parameters:**

| Parameter | Type   | Default | Description     |
| --------- | ------ | ------- | --------------- |
| page      | number | 1       | Page number     |
| pageCount | number | 10      | Items per page  |
| search    | string | ""      | Search by title |

**Response:** `200 OK`

```json
{
  "sessions": [
    {
      "_id": "uuid-1",
      "title": "JavaScript Basics",
      "course": {
        "_id": "course-uuid-1",
        "title": "JavaScript Fundamentals"
      },
      "instructor": {
        "_id": "instructor-uuid-1",
        "name": "John Doe"
      },
      "scheduledAt": "2025-12-25T10:00:00.000Z",
      "duration": 60,
      "status": "scheduled",
      "participants": []
    },
    {
      "_id": "uuid-2",
      "title": "Advanced React Patterns",
      "course": {
        "_id": "course-uuid-2",
        "title": "React Advanced"
      },
      "instructor": {
        "_id": "instructor-uuid-2",
        "name": "Jane Smith"
      },
      "scheduledAt": "2025-12-26T14:00:00.000Z",
      "duration": 90,
      "status": "live",
      "participants": ["student-1", "student-2"]
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

**Error Response:** `400 Bad Request`

```json
{
  "message": "\"page\" must be greater than or equal to 1"
}
```

---

### Get Live Session by ID

**GET** `/sessions/:id`

Get detailed information about a specific live session.

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `id` (string, required): The UUID of the live session

**Response:** `200 OK`

```json
{
  "_id": "uuid-string",
  "title": "Introduction to JavaScript",
  "course": {
    "_id": "course-uuid",
    "title": "JavaScript Fundamentals"
  },
  "instructor": {
    "_id": "instructor-uuid",
    "name": "John Doe"
  },
  "roomUrl": "https://your-domain.daily.co/room-name",
  "scheduledAt": "2025-12-25T10:00:00.000Z",
  "duration": 60,
  "status": "scheduled",
  "recordingUrl": null,
  "participants": [],
  "maxParticipants": 100,
  "isRecorded": false,
  "createdAt": "2025-12-23T...",
  "updatedAt": "2025-12-23T..."
}
```

**Error Response:** `404 Not Found`

```json
{
  "message": "Live session not found"
}
```

---

### Get Sessions by Course

**GET** `/sessions/course/:courseId`

Get all live sessions for a specific course.

**Authentication:** Not Required

**URL Parameters:**

- `courseId` (string, required): The UUID of the course

**Response:** `200 OK`

```json
[
  {
    "_id": "uuid-1",
    "title": "Week 1: JavaScript Basics",
    "description": "Introduction to variables and functions",
    "course": "course-uuid",
    "instructor": {
      "_id": "instructor-uuid",
      "name": "John Doe"
    },
    "scheduledAt": "2025-12-25T10:00:00.000Z",
    "duration": 60,
    "status": "scheduled",
    "roomUrl": "https://your-domain.daily.co/room-name-1",
    "participants": [],
    "maxParticipants": 100
  },
  {
    "_id": "uuid-2",
    "title": "Week 2: Advanced Concepts",
    "scheduledAt": "2025-12-27T10:00:00.000Z",
    "duration": 90,
    "status": "scheduled",
    "roomUrl": "https://your-domain.daily.co/room-name-2",
    "participants": []
  }
]
```

**Error Response:** `500 Internal Server Error`

```json
{
  "message": "Database query failed"
}
```

---

### Get Sessions by Instructor

**GET** `/sessions/instructor/:instructorId`

Get all live sessions created by a specific instructor.

**Authentication:** Not Required

**URL Parameters:**

- `instructorId` (string, required): The UUID of the instructor

**Response:** `200 OK`

```json
[
  {
    "_id": "uuid-1",
    "title": "JavaScript Fundamentals Live",
    "course": {
      "_id": "course-uuid-1",
      "title": "JavaScript Fundamentals"
    },
    "instructor": "instructor-uuid",
    "scheduledAt": "2025-12-25T10:00:00.000Z",
    "duration": 60,
    "status": "scheduled",
    "roomUrl": "https://your-domain.daily.co/room-1",
    "participants": []
  },
  {
    "_id": "uuid-2",
    "title": "React Advanced Patterns",
    "course": {
      "_id": "course-uuid-2",
      "title": "React Advanced Course"
    },
    "instructor": "instructor-uuid",
    "scheduledAt": "2025-12-26T14:00:00.000Z",
    "duration": 90,
    "status": "ended",
    "recordingUrl": "https://res.cloudinary.com/.../recording.mp4",
    "participants": ["student-1", "student-2"]
  }
]
```

**Error Response:** `500 Internal Server Error`

```json
{
  "message": "Database query failed"
}
```

---

### Update Live Session

**PUT** `/sessions/:id`

Update an existing live session.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "scheduledAt": "2025-12-26T10:00:00.000Z",
  "duration": 90,
  "maxParticipants": 150
}
```

**Response:** `200 OK`

```json
{
  "_id": "uuid-string",
  "title": "Updated Title",
  "description": "Updated description",
  "course": "course-uuid",
  "instructor": "instructor-uuid",
  "roomName": "introduction-to-javascript-1234567890",
  "roomUrl": "https://your-domain.daily.co/room-name",
  "scheduledAt": "2025-12-26T10:00:00.000Z",
  "duration": 90,
  "status": "scheduled",
  "maxParticipants": 150,
  "participants": [],
  "isRecorded": false,
  "createdAt": "2025-12-23T...",
  "updatedAt": "2025-12-24T..."
}
```

**Error Response:** `404 Not Found`

```json
{
  "message": "Live session not found"
}
```

---

### Delete Live Session

**DELETE** `/sessions/:id`

Delete a live session and its Daily.co room.

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `id` (string, required): The UUID of the live session

**Response:** `200 OK`

```json
{
  "message": "Live session deleted successfully",
  "session": {
    "_id": "uuid-string",
    "title": "JavaScript Basics",
    "course": "course-uuid",
    "instructor": "instructor-uuid",
    "roomName": "javascript-basics-1234567890",
    "status": "cancelled",
    "deletedAt": "2025-12-24T..."
  }
}
```

**Error Response:** `404 Not Found`

```json
{
  "message": "Live session not found"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "message": "Failed to delete Daily.co room"
}
```

---

### Start Recording

**POST** `/sessions/recording/start`

Start recording a live session.

**Authentication:** Not Required

**Request Body:**

```json
{
  "roomName": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "recording": {
    "id": "recording-id-uuid",
    "room_name": "javascript-basics-1234567890",
    "status": "recording",
    "start_ts": 1703500800000,
    "duration": 0
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "message": "Room name is required"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "message": "Failed to start recording on Daily.co"
}
```

---

### Stop Recording

**POST** `/sessions/recording/stop`

Stop an active recording.

**Authentication:** Not Required

**Request Body:**

```json
{
  "recordingId": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "recording": {
    "id": "recording-id-uuid",
    "room_name": "javascript-basics-1234567890",
    "status": "finished",
    "duration": 3600,
    "end_ts": 1703504400000
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "message": "Recording ID is required"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "message": "Failed to stop recording on Daily.co"
}
```

---

### Add Participant

**POST** `/sessions/:id/participants`

Add a student to a live session.

**Authentication:** Not Required

**URL Parameters:**

- `id` (string, required): The UUID of the live session

**Request Body:**

```json
{
  "studentId": "student-uuid-123"
}
```

**Response:** `200 OK`

```json
{
  "_id": "session-uuid",
  "title": "JavaScript Basics",
  "course": "course-uuid",
  "instructor": "instructor-uuid",
  "participants": ["student-uuid-123"],
  "maxParticipants": 100,
  "status": "scheduled",
  "scheduledAt": "2025-12-25T10:00:00.000Z"
}
```

**Error Response:** `400 Bad Request`

```json
{
  "message": "Student ID is required"
}
```

**Error Response:** `404 Not Found`

```json
{
  "message": "Live session not found"
}
```

**Error Response:** `400 Bad Request` (Session Full)

```json
{
  "message": "Session has reached maximum participants"
}
```

---

### Remove Participant

**DELETE** `/sessions/:id/participants/:studentId`

Remove a student from a live session.

**Authentication:** Not Required

**URL Parameters:**

- `id` (string, required): The UUID of the live session
- `studentId` (string, required): The UUID of the student to remove

**Response:** `200 OK`

```json
{
  "_id": "session-uuid",
  "title": "JavaScript Basics",
  "course": "course-uuid",
  "instructor": "instructor-uuid",
  "participants": [],
  "maxParticipants": 100,
  "status": "scheduled",
  "scheduledAt": "2025-12-25T10:00:00.000Z"
}
```

**Error Response:** `404 Not Found`

```json
{
  "message": "Live session not found"
}
```

**Error Response:** `404 Not Found`

```json
{
  "message": "Student not found in session participants"
}
```

---

### Update Session Status

**PATCH** `/sessions/:id/status`

Update the status of a live session.

**Authentication:** Not Required

**URL Parameters:**

- `id` (string, required): The UUID of the live session

**Request Body:**

```json
{
  "status": "live"
}
```

**Valid Status Values:**

- `scheduled` - Session is scheduled but not started
- `live` - Session is currently active
- `ended` - Session has ended
- `cancelled` - Session was cancelled

**Response:** `200 OK`

```json
{
  "_id": "session-uuid",
  "title": "JavaScript Basics",
  "course": "course-uuid",
  "instructor": "instructor-uuid",
  "status": "live",
  "scheduledAt": "2025-12-25T10:00:00.000Z",
  "duration": 60,
  "participants": ["student-1", "student-2"],
  "roomUrl": "https://your-domain.daily.co/room-name",
  "updatedAt": "2025-12-24T..."
}
```

**Error Response:** `400 Bad Request`

```json
{
  "message": "Status is required"
}
```

**Error Response:** `400 Bad Request` (Invalid Status)

```json
{
  "message": "Invalid status value. Must be one of: scheduled, live, ended, cancelled"
}
```

**Error Response:** `404 Not Found`

```json
{
  "message": "Live session not found"
}
```

---

### Daily.co Webhook

**POST** `/sessions/webhook/daily`

Webhook endpoint for Daily.co events. Handles recording completion and uploads to Cloudinary.

**Authentication:** Not Required (Configure Daily.co webhook URL)

**Webhook Events Handled:**

- `recording.ready-to-download`: Automatically uploads recording to Cloudinary and updates session
- `recording.started`: Logs recording start event
- `recording.stopped`: Logs recording stop event
- `room.exp`: Handles room expiration

**Example Webhook Payload (recording.ready-to-download):**

```json
{
  "type": "recording.ready-to-download",
  "room": "javascript-basics-1234567890",
  "recording_id": "recording-uuid",
  "download_url": "https://api.daily.co/recordings/...",
  "duration": 3600,
  "start_ts": 1703500800000,
  "end_ts": 1703504400000
}
```

**Response:** `200 OK` (Always returns 200 to acknowledge receipt)

**Processing:**

1. Validates webhook event type
2. Downloads recording from Daily.co
3. Uploads to Cloudinary (folder: `live-sessions/{courseId}`)
4. Updates session with `recordingUrl`, `recordingDuration`, `isRecorded: true`
5. Updates status to `ended`

---

## Live Session Status Values

- `scheduled`: Session is scheduled but not started
- `live`: Session is currently active
- `ended`: Session has ended
- `cancelled`: Session was cancelled

---

## Cloudinary Integration

When a recording is finished:

1. Daily.co sends webhook to `/sessions/webhook/daily`
2. Recording is downloaded from Daily.co
3. Video is uploaded to Cloudinary in folder `live-sessions/{courseId}`
4. Session is updated with:
   - `recordingUrl`: Cloudinary secure URL
   - `recordingDuration`: Video duration
   - `isRecorded`: Set to `true`
   - `status`: Changed to `ended`

---

## Environment Variables Required

```env
DAILY_API_KEY=your_daily_api_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "message": "Error message description"
}
```

**Common Error Codes:**

- `400 Bad Request`: Validation error or missing required fields
- `404 Not Found`: Session not found
- `500 Internal Server Error`: Server or external API error

---

## Example Usage Flow

### 1. Create a Session

```javascript
POST /sessions
{
  "title": "JavaScript Basics Live Session",
  "description": "We'll cover variables, functions, and more",
  "courseId": "course-uuid",
  "scheduledAt": "2025-12-25T10:00:00.000Z",
  "duration": 60
}
```

### 2. Students Join

Students use the `roomUrl` from the session to join via Daily.co.

### 3. Start Recording

```javascript
POST /sessions/recording/start
{
  "roomName": "javascript-basics-live-session-1234567890"
}
```

### 4. Session Ends

Recording stops automatically or via API:

```javascript
POST /sessions/recording/stop
{
  "recordingId": "recording-uuid"
}
```

### 5. Webhook Processes Recording

Daily.co webhook triggers, recording is uploaded to Cloudinary, and session is updated with recording URL.

---

## Notes

- All sessions use UUID v4 for `_id`
- Daily.co rooms are automatically created with each session
- Recording is optional but enabled by default
- Cloudinary folder structure: `live-sessions/{courseId}/{sessionId}-recording`
- Sessions expire based on `scheduledAt + duration`
