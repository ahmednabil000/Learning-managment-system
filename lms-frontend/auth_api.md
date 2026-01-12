# Auth API Documentation

Base URL: `/auth`

---

## 1. Register

Registers a new user (student) in the system.

- **Endpoint**: `/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "fullName": "John Doe"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id_uuid",
      "email": "user@example.com"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation error or user already exists.
  - `500 Internal Server Error`: Server processing error.

---

## 2. Login

Authenticates a user and returns a JWT token.

- **Endpoint**: `/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id_uuid",
      "email": "user@example.com",
      "role": "Student"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: User not found.
  - `400 Bad Request`: Invalid credentials.
  - `500 Internal Server Error`: Server processing error.
