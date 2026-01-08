# Lecture Items API Documentation

Base URL: `/lecture-items`

## 1. Update Items Order

**Endpoint:** `PUT /order/:lectureId`

**Description:** Reorders the items (lessons, blogs, etc.) within a specific lecture.

**Authentication:** Required.

**Headers:**

- `Authorization`: Bearer <token>
- `Content-Type`: application/json

**Parameters:**

- `lectureId` (path, required): The ID of the lecture.

**Request Body:**

| Field          | Type  | Required | Description                                                         |
| -------------- | ----- | -------- | ------------------------------------------------------------------- |
| `updatesItems` | Array | Yes      | An array of objects containing the item ID and its new order index. |

**Example Request:**

```json
{
  "updatesItems": [
    { "id": "item-uuid-1", "order": 1 },
    { "id": "item-uuid-2", "order": 2 },
    { "id": "item-uuid-3", "order": 3 }
  ]
}
```

**Response (Success - 200):**

```json
{
  "statusCode": 200,
  "message": "Items updated successfully"
}
```

**Response (Error):**

- `400 Bad Request`: Invalid format or missing fields.
- `404 Not Found`: Lecture or items not found.
- `401 Unauthorized`: User is not authorized.
