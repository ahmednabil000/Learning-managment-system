# Data Models Documentation

## Overview

This document describes the data models used in the LMS backend. All models have been standardized to use UUID v4 strings as their primary `_id` field.

## ID Strategy

**All models use UUID v4 as the `_id` field instead of MongoDB's default ObjectId.**

### Why UUID?

1. **Consistency**: Same identifier format across all resources
2. **URL-Friendly**: No special encoding needed in URLs
3. **Human-Readable**: Easier to debug and track
4. **Client-Side Generation**: Can be generated client-side if needed
5. **No Collision Risk**: UUID v4 provides sufficient uniqueness

### Implementation

```javascript
const { v4: uuidv4 } = require("uuid");

const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  // other fields...
});
```

---

## Core Models

### User

Base model for all user types with discriminator pattern.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `name` (String): User's full name
- `email` (String, unique): User's email address
- `googleId` (String, unique): Google OAuth ID
- `imageUrl` (String): Profile image URL
- `role` (String): Discriminator key for user types
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

**Discriminators:**

- `Instructor`: User with instructor privileges
- `Student`: User with enrolled courses
  - `enrolledCourses` (Array of ObjectId): References to Course model
- `Admin`: Administrative user
- `Superadmin`: Super administrative user

---

### Course

Represents a learning course.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `title` (String): Course title
- `description` (String): Course description
- `price` (Number): Course price
- `imageUrl` (String): Course thumbnail/cover image
- `instructor` (ObjectId, ref: "Instructor", required): Course instructor
- `tag` (ObjectId, ref: "CourseTag", required): Course category tag
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### CourseTag

Category tags for courses.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `name` (String): Tag name
- `description` (String): Tag description

---

### Track

Learning track containing multiple courses.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `title` (String): Track title
- `description` (String): Track description
- `courses` (Array of ObjectId, ref: "Course"): Courses in this track
- `coverImage` (String): Track cover image
- `duration` (Number): Total track duration
- `isPublished` (Boolean): Publication status
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### Lecture

A lecture within a course.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `title` (String): Lecture title
- `course` (ObjectId, ref: "Course", required): Parent course
- `lessons` (Array of ObjectId, ref: "Lesson"): Lessons in this lecture
- `order` (Number): Display order
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### Lesson

Individual lesson within a lecture.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `title` (String): Lesson title
- `lecture` (ObjectId, ref: "Lecture", required): Parent lecture
- `videoUrl` (String): Video content URL
- `order` (Number): Display order within lecture
- `duration` (Number): Lesson duration in minutes
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### StudentCourse

Junction table for student course enrollment.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `studentId` (ObjectId, ref: "Student", required): Student reference
- `courseId` (ObjectId, ref: "Course", required): Course reference
- `progress` (Number, default: 0): Completion progress percentage

---

### Feedback

Course feedback from students.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `body` (String): Feedback content
- `student` (ObjectId, ref: "Student", required): Student who provided feedback
- `course` (ObjectId, ref: "Course", required): Course being reviewed
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

## Assessment Models

### Assignment

Assignment for a lecture.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `title` (String): Assignment title
- `lecture` (ObjectId, ref: "Lecture"): Associated lecture
- `totalPoints` (Number): Maximum points possible
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### AssignmentAttempt

Student's attempt at an assignment.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `assignment` (ObjectId, ref: "Assignment"): Assignment reference
- `student` (ObjectId, ref: "Student"): Student reference
- `totalPoints` (Number): Points earned
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### Exam

Exam for a course.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `title` (String): Exam title
- `duration` (Number): Exam duration in minutes
- `startDate` (Date): Exam start date/time
- `endDate` (Date): Exam end date/time
- `isPublished` (Boolean): Publication status
- `instructor` (ObjectId, ref: "User"): Exam creator
- `course` (ObjectId, ref: "Course"): Associated course
- `totalPoints` (Number): Maximum points possible
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### ExamAttempt

Student's attempt at an exam.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `exam` (ObjectId, ref: "Exam"): Exam reference
- `student` (ObjectId, ref: "Student"): Student reference
- `totalPoints` (Number): Points earned
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### Question

Question for assignments or exams.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `title` (String): Question text
- `assignment` (ObjectId, ref: "Assignment"): Assignment reference (if applicable)
- `exam` (ObjectId, ref: "Exam"): Exam reference (if applicable)
- `type` (String): Question type (e.g., "multiple-choice", "true-false", "essay")
- `options` (Array of String): Answer options for multiple-choice questions
- `correctAnswer` (String): Correct answer
- `points` (Number): Points for this question
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

### Answer

Student's answer to a question.

**Fields:**

- `_id` (String, UUID v4): Primary identifier
- `question` (ObjectId, ref: "Question"): Question reference
- `assignmentAttempt` (ObjectId, ref: "AssignmentAttempt"): Assignment attempt reference
- `examAttempt` (ObjectId, ref: "ExamAttempt"): Exam attempt reference
- `type` (String): Answer type
- `value` (String): Student's answer
- `isCorrect` (Boolean): Whether answer is correct
- `submittedBy` (ObjectId, ref: "Student"): Student who submitted
- `points` (Number): Points earned
- `createdAt` (Date): Auto-generated timestamp
- `updatedAt` (Date): Auto-generated timestamp

---

## Relationships

### One-to-Many

- **Course → Lectures**: One course has many lectures
- **Lecture → Lessons**: One lecture has many lessons
- **Assignment → Questions**: One assignment has many questions
- **Exam → Questions**: One exam has many questions
- **User (Instructor) → Courses**: One instructor creates many courses
- **Track → Courses**: One track contains many courses

### Many-to-One

- **Lectures → Course**: Many lectures belong to one course
- **Lessons → Lecture**: Many lessons belong to one lecture
- **Questions → Assignment/Exam**: Many questions belong to one assignment or exam

### Many-to-Many

- **Students ↔ Courses**: Implemented via `StudentCourse` junction table

### Special Relationships

- **Inheritance**: User model uses discriminator pattern for Instructor, Student, Admin, Superadmin

---

## Database Queries

### Finding by ID

All models use UUID strings for `_id`:

```javascript
// Correct
const course = await Course.findOne({ _id: courseId });
const course = await Course.findById(courseId); // Also works with string IDs

// Incorrect (old way with 'id' field)
const course = await Course.findOne({ id: courseId }); // This will NOT work
```

### Creating Documents

MongoDB will automatically generate UUID v4 for `_id`:

```javascript
const course = await Course.create({
  title: "New Course",
  description: "Course description",
  // _id will be auto-generated as UUID v4
});
```

### Populating References

References still use ObjectId for relationships:

```javascript
const course = await Course.findOne({ _id: courseId })
  .populate("instructor")
  .populate("tag");
```

---

## Migration Notes

### Breaking Changes

1. **Primary Key Change**: All models now use UUID string `_id` instead of custom `id` field
2. **No Separate ID Field**: The `id` field has been removed; use `_id` directly
3. **Query Updates**: All queries using `{ id: value }` must be changed to `{ _id: value }`

### What Changed

- ✅ Replaced `id: { type: String, default: uuidv4, unique: true, index: true }`
- ✅ With `_id: { type: String, default: uuidv4 }`
- ✅ Removed redundant unique and index properties (MongoDB's `_id` is already unique and indexed)
- ✅ Updated all service layer queries to use `_id`
- ✅ Updated controllers to use `_id` when accessing model properties

### What Stayed the Same

- ❌ URL parameters still use `:id` (e.g., `/courses/:id`)
- ❌ Request bodies can still refer to "id" for backwards compatibility
- ❌ Foreign key relationships still use ObjectId (not UUID)

---

## Best Practices

1. **Always use `_id` in database queries**: `findOne({ _id: value })`
2. **Use UUID format for all primary identifiers**: No need to convert to ObjectId
3. **Keep ObjectId for relationships**: Foreign keys still use ObjectId type
4. **Validate UUID format in validators**: Ensure incoming IDs are valid UUID v4
5. **Use `.lean()` for read-only queries**: Improves performance when you don't need Mongoose documents

---

## Example Usage

### Creating a Course

```javascript
const course = await Course.create({
  title: "JavaScript Fundamentals",
  description: "Learn the basics of JavaScript",
  price: 49.99,
  imageUrl: "https://example.com/image.jpg",
  instructor: instructorObjectId, // ObjectId reference
  tag: tagObjectId, // ObjectId reference
});

console.log(course._id); // UUID v4 string, e.g., "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### Finding by UUID

```javascript
const courseId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const course = await Course.findOne({ _id: courseId })
  .populate("instructor")
  .populate("tag");
```

### Updating a Document

```javascript
const course = await Course.findOne({ _id: courseId });
if (!course) {
  throw new Error("Course not found");
}

course.title = "Updated Title";
await course.save();
```

### Deleting a Document

```javascript
const course = await Course.findOne({ _id: courseId });
if (course) {
  await course.remove();
}
```
