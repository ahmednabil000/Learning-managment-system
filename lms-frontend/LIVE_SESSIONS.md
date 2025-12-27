# Live Sessions API Documentation

This document provides comprehensive documentation for the Live Session API, including request formats, response formats, and data models.

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
   - [Get Instructor Live Sessions](#get-instructor-live-sessions)

2. [Data Models](#data-models)
   - [LiveSession Model](#livesession-model)
   - [SessionParticipant Model](#sessionparticipant-model)
   - [Recording Model](#recording-model)

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
  "courseId": "string",
  "startsAt": "ISO 8601 date string",
  "recordingEnabled": "boolean (optional)",
  "maxParticipants": "number (optional)"
}
```

**Request Example:**

```json
{
  "courseId": "course-uuid-123",
  "startsAt": "2025-12-26T15:00:00.000Z",
  "recordingEnabled": true,
  "maxParticipants": 50
}
```

**Success Response:**

**Status Code:** `201 Created`

```json
{
  "_id": "uuid-string",
  "courseId": "course-uuid-123",
  "roomName": "unique-room-name",
  "status": "scheduled",
  "startsAt": "2025-12-26T15:00:00.000Z",
  "endsAt": null,
  "createdBy": "instructor-id",
  "recordingEnabled": true,
  "maxParticipants": 50,
  "createdAt": "2025-12-26T10:00:00.000Z",
  "updatedAt": "2025-12-26T10:00:00.000Z"
}
```

**Error Responses:**

**Status Code:** `400 Bad Request`

```json
{
  "error": "courseId and startsAt are required"
}
```

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
  "courseId": "course-uuid-123",
  "roomName": "unique-room-name",
  "status": "live",
  "startsAt": "2025-12-26T15:00:00.000Z",
  "endsAt": null,
  "createdBy": "instructor-id",
  "recordingEnabled": true,
  "maxParticipants": 50,
  "createdAt": "2025-12-26T10:00:00.000Z",
  "updatedAt": "2025-12-26T10:00:00.000Z"
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
  "courseId": "course-uuid-123",
  "roomName": "unique-room-name",
  "status": "ended",
  "startsAt": "2025-12-26T15:00:00.000Z",
  "endsAt": "2025-12-26T17:00:00.000Z",
  "createdBy": "instructor-id",
  "recordingEnabled": true,
  "maxParticipants": 50,
  "createdAt": "2025-12-26T10:00:00.000Z",
  "updatedAt": "2025-12-26T17:00:00.000Z"
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

**Status Code:** `400 Bad Request`

```json
{
  "message": "Recording is not enabled for this session"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to start session recording"
}
```

**Notes:**

- Starting a recording creates a `Recording` model entry with status "processing"
- If the session status is "scheduled", it will automatically change to "live" when recording starts

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

**Notes:**

- Stopping a recording updates the `Recording` model with duration and changes status to "completed"
- The session status is automatically changed to "ended"
- The session's `endsAt` field is set to the current timestamp

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
  "message": "Not authorized to access recording for session:unique-room-name"
}
```

**Notes:**

- Retrieves the most recent recording for the session from the `Recording` model
- Fetches recording details and access link from Daily.co API
- Access link is temporary and will expire

---

### 7. Get Session Token

Generates a meeting token for a user to join a live session. The token includes user information and permissions based on their role.

**Endpoint:** `POST /sessions/:sessionName/token`

**Authentication:** Required (Bearer Token)

**URL Parameters:**

- `sessionName` (string, required) - The unique room name of the session

**Request Body:**

No request body required. User information is extracted from the authentication token.

**Request Example:**

```
POST /sessions/unique-room-name/token
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
  - User's name (from `req.user.name`)
  - Session room name
  - User permissions (`is_owner: true` for instructors, `false` for others)

**Error Response:**

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to get session token"
}
```

**Usage:**

The returned token should be used by the client to authenticate when joining the live session through the video conferencing platform (Daily.co).

---

### Get Instructor Live Sessions

Fetches all live sessions created by a specific instructor.

**Endpoint:** `GET /sessions/instructor/:instructorId`

**Authentication:** Not Required

**URL Parameters:**
- `instructorId` (string, required) - The instructor's user ID

**Request Example:**
```
GET /sessions/instructor/1234567890abcdef
```

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "_id": "uuid-string",
  "courseId": "course-uuid-123",
  "roomName": "unique-room-name",
  "status": "scheduled",
  "startsAt": "2025-12-26T15:00:00.000Z",
  "endsAt": null,
  "createdBy": "1234567890abcdef",
  "recordingEnabled": true,
  "maxParticipants": 50,
  "createdAt": "2025-12-26T10:00:00.000Z",
  "updatedAt": "2025-12-26T10:00:00.000Z"
}
```

**Error Response:**

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch instructor sessions"
}
```

---

## Data Models

### LiveSession Model

```javascript
{
  _id: String (UUID),
  courseId: String (ref: Course, required),
  roomName: String (unique, required),
  status: Enum ["scheduled", "live", "ended"] (default: "scheduled", required),
  startsAt: Date (required),
  endsAt: Date (optional),
  createdBy: String (ref: Instructor, required),
  recordingEnabled: Boolean (default: false),
  maxParticipants: Number (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Fields:**

- `_id`: Unique identifier (UUID v4)
- `courseId`: Reference to the Course this session belongs to
- `roomName`: Unique Daily.co room name for the session
- `status`: Current status of the session (scheduled → live → ended)
- `startsAt`: Scheduled start time of the session
- `endsAt`: Actual end time of the session (set when session ends)
- `createdBy`: Instructor ID who created the session
- `recordingEnabled`: Whether recording is enabled for this session
- `maxParticipants`: Maximum number of participants allowed (optional)
- `createdAt`: Timestamp when record was created
- `updatedAt`: Timestamp when record was last updated

### SessionParticipant Model

Tracks attendance and permissions for each participant in a live session.

```javascript
{
  _id: String (UUID),
  userId: String (ref: User, required),
  sessionId: String (ref: LiveSession, required),
  role: Enum ["instructor", "student"] (required),
  joinedAt: Date (optional),
  leftAt: Date (optional),
  wasKicked: Boolean (default: false),
  micAllowed: Boolean (default: true),
  cameraAllowed: Boolean (default: true),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Fields:**

- `_id`: Unique identifier (UUID v4)
- `userId`: Reference to the User participating in the session
- `sessionId`: Reference to the LiveSession
- `role`: Participant's role (instructor or student)
- `joinedAt`: Timestamp when participant joined the session
- `leftAt`: Timestamp when participant left the session
- `wasKicked`: Whether the participant was removed from the session
- `micAllowed`: Whether participant has microphone permissions
- `cameraAllowed`: Whether participant has camera permissions
- `createdAt`: Timestamp when record was created
- `updatedAt`: Timestamp when record was last updated

**Indexes:**

- Compound index on `sessionId` and `userId` for efficient participant lookups
- Compound index on `sessionId` and `role` for role-based queries

### Recording Model

Stores information about session recordings.

```javascript
{
  _id: String (UUID),
  sessionId: String (ref: LiveSession, required),
  recordingId: String (Daily.co recording ID, required),
  s3Key: String (S3 storage key, optional),
  duration: Number (Duration in seconds, optional),
  status: Enum ["processing", "completed", "failed"] (default: "processing", required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Fields:**

- `_id`: Unique identifier (UUID v4)
- `sessionId`: Reference to the LiveSession that was recorded
- `recordingId`: Daily.co recording identifier
- `s3Key`: Amazon S3 storage key for the recording file
- `duration`: Length of the recording in seconds
- `status`: Processing status of the recording
  - `processing`: Recording is being processed
  - `completed`: Recording is ready and available
  - `failed`: Recording processing failed
- `createdAt`: Timestamp when record was created
- `updatedAt`: Timestamp when record was last updated

**Indexes:**

- Index on `sessionId` for efficient session recording lookups
- Index on `recordingId` for Daily.co recording queries

---

## Authentication

Most endpoints require authentication via Bearer Token. Include the token in the Authorization header:

```
Authorization: Bearer <your-token-here>
```

The token should contain the user information (`req.user.id`) which is used to verify ownership and permissions.

---

## Notes

1. **Live Sessions** are associated with courses and provide Daily.co rooms for real-time video conferencing.
2. Sessions have three statuses: `scheduled` → `live` → `ended`.
3. Only instructors who created a session (via `createdBy` field) can modify or delete it.
4. **Automatic Status Changes:**
   - Starting recording on a "scheduled" session automatically changes it to "live"
   - Stopping recording automatically changes the session to "ended" and sets `endsAt` timestamp
5. **SessionParticipant** tracks who joins sessions, their roles, and their permissions.
6. **Recording** model stores all recording-related data with integration to Daily.co and S3 storage.
7. Recordings have their own lifecycle: `processing` → `completed` (or `failed`).
8. The system supports configurable `maxParticipants` limit per session.
9. Recording must be enabled (`recordingEnabled: true`) when creating a session to allow recording functionality.

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
