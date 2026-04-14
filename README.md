# Task Management Backend

A complete backend API for a Task Management (To-Do List) application using Node.js, Express.js, and MongoDB.

## Features
- ✅ Create, Read, Update, and Delete tasks
- ✅ Mark tasks as completed (with protection against re-completion)
- ✅ Pagination support with configurable page size
- ✅ Filter tasks by completed status
- ✅ Optional fields: dueDate and category
- ✅ Consistent response structure `{ success, message, data }`
- ✅ Comprehensive error handling with proper HTTP status codes
- ✅ Input validation and sanitization
- ✅ Clean and modular project architecture

## Technologies Used
- **Node.js** & **Express.js** for the API framework
- **MongoDB** & **Mongoose** for the database
- **dotenv** for environment variables
- **cors** for Cross-Origin Resource Sharing
- **nodemon** for development auto-reload

## Project Structure
```text
src/
├── controllers/       # API endpoint logic
├── middlewares/       # Error handling middleware
├── models/            # Mongoose schemas
├── routes/            # Express route definitions
├── utils/             # Validation utilities
├── app.js             # Express app configuration
└── server.js          # Entry point and database connection
```

## Setup Instructions

### Prerequisites
- **Node.js** (v14+)
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** or **yarn**

### Installation
1. **Navigate** to the project directory:
   ```bash
   cd "Task Management Backend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and configure:
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/task-manager
   ```

4. **Start MongoDB** (if local):
   - **Windows**:
     ```bash
     mongod
     ```
   - **macOS/Linux**:
     ```bash
     brew services start mongodb-community
     ```
   - Or use **MongoDB Atlas** (cloud) and update `MONGO_URI`

5. **Start the Server**:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```
   Server runs at `http://localhost:3000`

## API Endpoints

All responses follow this JSON format:
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { ... } // or null
}
```

### 1. Create a Task
**POST** `/tasks`

**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, and bread",
  "dueDate": "2026-05-15T10:00:00Z",
  "category": "Shopping"
}
```

**Notes**:
- `title` is required and cannot be empty
- `description` is optional
- `dueDate` and `category` are optional

**Response** (201):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, and bread",
    "completed": false,
    "dueDate": "2026-05-15T10:00:00Z",
    "category": "Shopping",
    "createdAt": "2026-04-14T10:00:00Z",
    "updatedAt": "2026-04-14T10:00:00Z"
  }
}
```

### 2. Get All Tasks
**GET** `/tasks`

**Query Parameters** (optional):
- `page` - Page number (default: 1)
- `limit` - Tasks per page (default: 10)
- `completed` - Filter by status: `true`, `false`, or omit for all

**Examples**:
- `/tasks` - Get all tasks (page 1, 10 per page)
- `/tasks?page=2&limit=5` - Get page 2 with 5 tasks
- `/tasks?completed=false` - Get only incomplete tasks
- `/tasks?page=1&limit=10&completed=true` - Completed tasks

**Response** (200):
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [ ... ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

### 3. Update a Task
**PATCH** `/tasks/:id`

**Request Body** (any fields to update):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2026-05-20T10:00:00Z",
  "category": "Work"
}
```

**Notes**:
- Only provided fields will be updated
- `title` cannot be empty if updated
- ID must be a valid MongoDB ObjectId

**Response** (200):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": { ... }
}
```

### 4. Mark Task as Completed
**PATCH** `/tasks/:id/complete`

**Notes**:
- Cannot mark an already completed task as completed again
- Returns 400 error if already completed

**Response** (200):
```json
{
  "success": true,
  "message": "Task marked as completed",
  "data": { ... }
}
```

### 5. Delete a Task
**DELETE** `/tasks/:id`

**Notes**:
- Permanently deletes the task
- Returns 404 if task doesn't exist

**Response** (200):
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, invalid ID, etc.)
- `404` - Not Found (task doesn't exist, route not found)
- `500` - Internal Server Error

**Error Response Example**:
```json
{
  "success": false,
  "message": "Task title is required and cannot be empty",
  "data": null
}
```

## Testing

### Using Postman
1. Import the endpoints described above
2. Set request URL to `http://localhost:3000/tasks`
3. Test each endpoint with sample data

### Using cURL
```bash
# Create task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Task description"}'

# Get all tasks
curl http://localhost:3000/tasks

# Get incomplete tasks
curl "http://localhost:3000/tasks?completed=false"

# Update task
curl -X PATCH http://localhost:3000/tasks/[TASK_ID] \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Mark as completed
curl -X PATCH http://localhost:3000/tasks/[TASK_ID]/complete

# Delete task
curl -X DELETE http://localhost:3000/tasks/[TASK_ID]
```

Replace `[TASK_ID]` with actual MongoDB ObjectId from created tasks.

## Task Data Model

```javascript
{
  _id: ObjectId,
  title: String,              // Required, non-empty
  description: String,        // Optional
  completed: Boolean,         // Default: false
  dueDate: Date,              // Optional
  category: String,           // Optional, default: "General"
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-updated
}
```

## Development Notes

- **Timestamps**: `createdAt` and `updatedAt` are automatically managed by Mongoose
- **ID Validation**: All endpoints validate MongoDB ObjectIds
- **Empty Title Check**: Prevents creation/update of tasks with empty titles
- **Completion Protection**: Cannot mark already completed tasks as complete again
- **Pagination**: Default 10 items per page, maximum retrievable with custom page/limit
- **Sorting**: Tasks are sorted by `createdAt` in descending order (newest first)

## Future Enhancements

- User authentication and authorization
- Task priorities
- Recurring tasks
- Task attachments
- Comments on tasks
- Real-time notifications
