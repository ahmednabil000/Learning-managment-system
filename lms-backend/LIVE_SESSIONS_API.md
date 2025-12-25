# Live Sessions and Scheduled Live Sessions API Documentation

This document provides comprehensive documentation for the Live Session and Scheduled Live Session APIs, including request formats, response formats, and examples.

---

## Table of Contents

1. [Live Sessions API](#live-sessions-api)

   - [Create Live Session](#1-create-live-session)
   - [Get Live Session by Name](#2-get-live-session-by-name)
   - [Delete Live Session](#3-delete-live-session)
   - [Start Session Recording](#4-start-session-recording)
   - [Stop Session Recording](#5-stop-session-recording)
   - [Get Session Recording](#6-get-session-recording)
   - [Get Session Token](#7-get-session-token)

2. [Scheduled Live Sessions API](#scheduled-live-sessions-api)
   - [Create Scheduled Session](#1-create-scheduled-session)
   - [Get All Scheduled Sessions](#2-get-all-scheduled-sessions)
   - [Get Scheduled Session by ID](#3-get-scheduled-session-by-id)
   - [Update Scheduled Session Status](#4-update-scheduled-session-status)
   - [Update Scheduled Session](#5-update-scheduled-session)
   - [Delete Scheduled Session](#6-delete-scheduled-session)

---

## Live Sessions API

Base URL: `/sessions`

### 1. Create Live Session

Creates a new live session room with recording capabilities.

**Endpoint:** `POST /sessions`

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "title": "string",
  "description": "string"
}
```

**Request Example:**

```json
{
  "title": "Introduction to Node.js",
  "description": "A comprehensive guide to Node.js fundamentals"
}
```

**Success Response:**

**Status Code:** `201 Created`

```json
{
  "_id": "uuid-string",
  "roomId": "daily-room-id",
  "instructor": "instructor-id",
  "roomName": "unique-room-name",
  "title": "Introduction to Node.js",
  "description": "A comprehensive guide to Node.js fundamentals",
  "recordingId": null
}
```

**Error Response:**

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to create session room"
}
```

---

### 2. Get Live Session by Name

Retrieves details of a live session by its room name.

**Endpoint:** `GET /sessions/:sessionName`

**Authentication:** Not Required

**URL Parameters:**

- `sessionName` (string, required) - The unique room name of the session

**Request Example:**

```
GET /sessions/unique-room-name
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "_id": "uuid-string",
  "roomId": "daily-room-id",
  "instructor": "instructor-id",
  "roomName": "unique-room-name",
  "title": "Introduction to Node.js",
  "description": "A comprehensive guide to Node.js fundamentals",
  "recordingId": null
}
```

**Error Response:**

**Status Code:** `500 Internal Server Error`

```json
"Session not found"
```

---

### 3. Delete Live Session

Deletes a live session. Only the instructor who created the session can delete it.

**Endpoint:** `DELETE /sessions/:sessionName`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `sessionName` (string, required) - The unique room name of the session

**Request Example:**

```
DELETE /sessions/unique-room-name
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "_id": "uuid-string",
  "roomId": "daily-room-id",
  "instructor": "instructor-id",
  "roomName": "unique-room-name",
  "title": "Introduction to Node.js",
  "description": "A comprehensive guide to Node.js fundamentals",
  "recordingId": null
}
```

**Error Responses:**

**Status Code:** `404 Not Found`

```json
{
  "message": "Session not found"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "message": "Not authorized to delete session:unique-room-name"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to delete session"
}
```

---

### 4. Start Session Recording

Starts recording for a live session. Only the instructor who created the session can start recording.

**Endpoint:** `POST /sessions/:sessionName/start-recording`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `sessionName` (string, required) - The unique room name of the session

**Request Example:**

```
POST /sessions/unique-room-name/start-recording
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "recordingId": "recording-uuid",
  "startedAt": "2025-12-25T10:00:00.000Z"
}
```

**Error Responses:**

**Status Code:** `404 Not Found`

```json
{
  "message": "Session not found"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "message": "Not authorized to record session:unique-room-name"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to start session recording"
}
```

---

### 5. Stop Session Recording

Stops the ongoing recording for a live session. Only the instructor can stop recording.

**Endpoint:** `POST /sessions/:sessionName/stop-recording`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `sessionName` (string, required) - The unique room name of the session

**Request Example:**

```
POST /sessions/unique-room-name/stop-recording
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "recordingId": "recording-uuid",
  "stoppedAt": "2025-12-25T11:00:00.000Z",
  "duration": 3600
}
```

**Error Responses:**

**Status Code:** `404 Not Found`

```json
{
  "message": "Session not found"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "message": "Not authorized to stop recording session:unique-room-name"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to stop session recording"
}
```

---

### 6. Get Session Recording

Retrieves the recording information and access link for a recorded session.

**Endpoint:** `GET /sessions/:sessionName/recording`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `sessionName` (string, required) - The unique room name of the session

**Request Example:**

```
GET /sessions/unique-room-name/recording
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "recordingId": "recording-uuid",
  "startedAt": "2025-12-25T10:00:00.000Z",
  "stoppedAt": "2025-12-25T11:00:00.000Z",
  "duration": 3600,
  "status": "finished",
  "downloadLink": "https://...",
  "accessLink": {
    "url": "https://...",
    "expiresAt": "2025-12-26T10:00:00.000Z"
  }
}
```

**Error Responses:**

**Status Code:** `404 Not Found` (Session not found)

```json
{
  "message": "Session not found"
}
```

**Status Code:** `404 Not Found` (Recording not found)

```json
{
  "message": "This session has not been recorded"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "message": "Not authorized to stop recording session:unique-room-name"
}
```

---

### 7. Get Session Token

Generates a meeting token for a user to join a live session. The token includes user information and permissions based on their role.

**Endpoint:** `POST /sessions/:sessionName/token`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `sessionName` (string, required) - The unique room name of the session

**Request Body:**

```json
{
  "userName": "string"
}
```

**Request Example:**

```
POST /sessions/unique-room-name/token
```

```json
{
  "userName": "John Doe"
}
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Details:**

- `token` (string) - JWT token that can be used to join the live session. The token includes:
  - User's name
  - Session room name
  - User permissions (is_owner for instructors)

**Error Response:**

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to get session token"
}
```

**Usage:**

The returned token should be used by the client to authenticate when joining the live session through the video conferencing platform.

---

## Scheduled Live Sessions API

Base URL: (To be configured - typically `/scheduled-sessions`)

### 1. Create Scheduled Session

Creates a new scheduled live session for a future date and time.

**Endpoint:** `POST /scheduled-sessions`

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "startsAt": "ISO 8601 date string"
}
```

**Request Example:**

```json
{
  "startsAt": "2025-12-26T15:00:00.000Z"
}
```

**Success Response:**

**Status Code:** `201 Created`

```json
{
  "_id": "uuid-string",
  "instructor": "instructor-id",
  "startsAt": "2025-12-26T15:00:00.000Z",
  "status": "scheduled",
  "sessionId": null
}
```

**Error Responses:**

**Status Code:** `400 Bad Request`

```json
{
  "message": "startsAt is required"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to create scheduled session"
}
```

---

### 2. Get All Scheduled Sessions

Retrieves a paginated list of scheduled sessions with optional filtering by instructor.

**Endpoint:** `GET /scheduled-sessions`

**Authentication:** Not Required

**Query Parameters:**

- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Number of items per page
- `instructorId` (string, optional) - Filter by instructor ID

**Request Example:**

```
GET /scheduled-sessions?page=1&limit=10&instructorId=instructor-123
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "sessions": [
    {
      "_id": "uuid-string",
      "instructor": {
        "_id": "instructor-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "startsAt": "2025-12-26T15:00:00.000Z",
      "status": "scheduled",
      "sessionId": null
    },
    {
      "_id": "uuid-string-2",
      "instructor": {
        "_id": "instructor-id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "startsAt": "2025-12-27T10:00:00.000Z",
      "status": "live",
      "sessionId": "live-session-id"
    }
  ],
  "page": 1,
  "limit": 10,
  "totalItems": 25,
  "totalPages": 3
}
```

**Error Response:**

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch scheduled sessions"
}
```

---

### 3. Get Scheduled Session by ID

Retrieves details of a specific scheduled session.

**Endpoint:** `GET /scheduled-sessions/:id`

**Authentication:** Not Required

**URL Parameters:**

- `id` (string, required) - The scheduled session ID

**Request Example:**

```
GET /scheduled-sessions/uuid-string
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "_id": "uuid-string",
  "instructor": {
    "_id": "instructor-id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "startsAt": "2025-12-26T15:00:00.000Z",
  "status": "scheduled",
  "sessionId": {
    "_id": "live-session-id",
    "roomName": "unique-room-name",
    "title": "Introduction to Node.js"
  }
}
```

**Error Responses:**

**Status Code:** `404 Not Found`

```json
{
  "message": "Scheduled session not found"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch scheduled session"
}
```

---

### 4. Update Scheduled Session Status

Updates only the status of a scheduled session. Valid statuses: `scheduled`, `live`, `finished`.

**Endpoint:** `PATCH /scheduled-sessions/:id/status`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `id` (string, required) - The scheduled session ID

**Request Body:**

```json
{
  "status": "scheduled | live | finished"
}
```

**Request Example:**

```json
{
  "status": "live"
}
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "_id": "uuid-string",
  "instructor": "instructor-id",
  "startsAt": "2025-12-26T15:00:00.000Z",
  "status": "live",
  "sessionId": "live-session-id"
}
```

**Error Responses:**

**Status Code:** `400 Bad Request` (Missing status)

```json
{
  "message": "status is required"
}
```

**Status Code:** `400 Bad Request` (Invalid status)

```json
{
  "message": "Invalid status. Must be one of: scheduled, live, finished"
}
```

**Status Code:** `404 Not Found`

```json
{
  "message": "Scheduled session not found"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "message": "Not authorized to update this scheduled session"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to update scheduled session status"
}
```

---

### 5. Update Scheduled Session

Updates multiple fields of a scheduled session (status, startsAt, sessionId).

**Endpoint:** `PUT /scheduled-sessions/:id`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `id` (string, required) - The scheduled session ID

**Request Body:**

```json
{
  "startsAt": "ISO 8601 date string (optional)",
  "status": "scheduled | live | finished (optional)",
  "sessionId": "string (optional)"
}
```

**Request Example:**

```json
{
  "startsAt": "2025-12-26T16:00:00.000Z",
  "status": "live",
  "sessionId": "live-session-id"
}
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "_id": "uuid-string",
  "instructor": "instructor-id",
  "startsAt": "2025-12-26T16:00:00.000Z",
  "status": "live",
  "sessionId": "live-session-id"
}
```

**Error Responses:**

**Status Code:** `400 Bad Request`

```json
{
  "message": "Invalid status. Must be one of: scheduled, live, finished"
}
```

**Status Code:** `404 Not Found`

```json
{
  "message": "Scheduled session not found"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "message": "Not authorized to update this scheduled session"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to update scheduled session"
}
```

---

### 6. Delete Scheduled Session

Deletes a scheduled session. Only the instructor who created it can delete it.

**Endpoint:** `DELETE /scheduled-sessions/:id`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `id` (string, required) - The scheduled session ID

**Request Example:**

```
DELETE /scheduled-sessions/uuid-string
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "message": "Scheduled session deleted successfully"
}
```

**Error Responses:**

**Status Code:** `404 Not Found`

```json
{
  "message": "Scheduled session not found"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "message": "Not authorized to delete this scheduled session"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to delete scheduled session"
}
```

---

## Data Models

### Live Session Model

```javascript
{
  _id: String (UUID),
  roomId: String (unique),
  instructor: String (ref: Instructor),
  roomName: String (unique),
  title: String,
  description: String,
  recordingId: String (optional)
}
```

### Scheduled Live Session Model

```javascript
{
  _id: String (UUID),
  sessionId: String (ref: LiveSession, optional),
  instructor: String (ref: Instructor, required),
  status: Enum ["scheduled", "live", "finished"] (default: "scheduled"),
  startsAt: Date (required)
}
```

---

## Authentication

Most endpoints require authentication via Bearer Token. Include the token in the Authorization header:

```
Authorization: Bearer <your-token-here>
```

The token should contain the user information (`req.user.id`) which is used to verify ownership and permissions.

---

## Notes

1. **Live Sessions** are created immediately and provide a Daily.co room for real-time video conferencing.
2. **Scheduled Live Sessions** are placeholders for future sessions and can be linked to a Live Session via the `sessionId` field.
3. Only instructors who created a session can modify or delete it.
4. The `status` field in Scheduled Sessions helps track the lifecycle: `scheduled` → `live` → `finished`.
5. Recording features are integrated with Daily.co's cloud recording service.

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

Common HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
