# User Provisioning System API

##  Overview
This project is a RESTful API for a **User Provisioning System** that manages users, roles, and their access permissions within an organization. The API supports **CRUD operations**, role assignments, **search functionality**, and **pagination**.

---

##  Features
- **User Management**: Create, update, delete, and retrieve users.
- **Role Management**: Define roles and manage them.
- **User Role Assignment**: Assign and remove roles from users.
- **Search & Filtering**: Search users by **name** or **email**.
- **Pagination**: Retrieve users and roles with paginated responses.
- **Soft Deletion**: Users are marked as **Inactive** instead of being removed from the database.
- **Validation & Error Handling**: Ensures valid inputs and provides meaningful HTTP status codes.

---

##  Technologies Used
- Backend: Node.js with Express.js
- Database: MongoDB with Mongoose
- API Testing: Postman

---
![alt text](Untitled_Diagram.drawio_(1)[1].png)
---

##  Installation & Setup

```sh
cd user-provisioning-api
```

###  Install Dependencies
```sh
npm install
```

###  Setup Environment Variables
Create a `.env` file in the root directory and configure the MongoDB connection:
```env
MONGO_URI=mongodb://localhost:27017/user_provisioning
PORT=5000
```

###  Start the Server
```sh
npm start
```

The API will be running on: **`http://localhost:5000`

---

##  API Endpoints

###  **User Management APIs**
| Method | Endpoint            | Description                      |
|--------|---------------------|----------------------------------|
| POST   | `/users`            | Create a new user               |
| GET    | `/users`            | Get all users (with pagination) |
| GET    | `/users/{id}`       | Get user by ID                  |
| PUT    | `/users/{id}`       | Update user details             |
| DELETE | `/users/{id}`       | Soft delete user (Inactive)     |

###  **Role Management APIs**
| Method | Endpoint        | Description       |
|--------|---------------|------------------|
| POST   | `/roles`      | Add a new role   |
| GET    | `/roles`      | List all roles (with pagination) |
| GET    | `/roles/{id}` | Get role by ID   |
| PUT    | `/roles/{id}` | Update role      |
| DELETE | `/roles/{id}` | Delete role      |

###  **User Role Assignment APIs**
| Method | Endpoint          | Description                     |
|--------|------------------|---------------------------------|
| POST   | `/user-roles`    | Assign a role to a user        |
| GET    | `/user-roles`    | List user-role assignments     |
| DELETE | `/user-roles/{id}` | Remove a role assignment     |

###  **Search & Filtering**
- **Search Users by Name or Email:**
  ```sh
  GET /users?search=john
  ```
- **Filter Users by Status:**
  ```sh
  GET /users?status=Active
  ```

###  Pagination
- **Paginate Users:**
  ```sh
  GET /users?page=1&limit=5
  ```
- **Paginate Roles:**
  ```sh
  GET /roles?page=1&limit=5
  ```

---

##  Project Structure
```plaintext
/user-provisioning-api
│── models/        # Database models (User, Role, UserRole)
│── routes/        # Express API routes
│── config/        # Configuration files
│── controllers/   # Business logic handlers
│── .env           # Environment variables
│── index.js       # Entry point of the application
│── README.md      # API Documentation
```

---

##  API Testing (Postman Collection)
- Import the provided **Postman collection** to test API endpoints.
- Run the following command to start the server before testing:
  ```sh
  npm start
  ```

---

##  Error Handling & Status Codes
| Status Code | Description |
|------------|--------------------------------|
| 201        | Created Successfully |
| 200        | Request Successful |
| 400        | Bad Request (Invalid input) |
| 404        | Not Found (User/Role not found) |
| 500        | Internal Server Error |

---
