# Justo-Global-auth-api

**Instructions**
### **1. Setup & Running the Server**
1. **Start the server:**
   - Run `npm install` installing the dependencies.
   - Run `npm start` to start the server.
   - The server will run on: `http://localhost:3000`.

### **2. Automatically Seeded Data (Users)**
On server startup, the following **test users** are seeded into the database:
- **Username:** `user@example.com`
- **Password:** `password`

- **Username:** `admin@example.com`
- **Password:** `password`

### **3. Exposed Endpoints**
#### **3.1 POST /api/auth/login**
- **Request Payload (JSON):**
  {
    "username": "user@example.com",
    "password": "password"
  }
- **Response (JSON):**
  {
    "token": "<JWT-token>"
  }

#### **3.2 POST /api/link/generate**
Generates a one-time link for a user to authenticate.
- **Request Payload (JSON):**
  {
    "username": "user@example.com",
    "password": "password"
  }
- **Response (JSON):**
  {
    "message": "Link generated successfully",
    "link": "http://localhost:3000/api/link/verify-link?token=<unique-token>"
  }

#### **3.3 GET /api/link/verify-link?token=<token>**
Verifies the one-time link token and provides a JWT token for the user.
- **URL:** `http://localhost:3000/api/link/verify-link?token=<unique-token>`
  - Replace `<unique-token>` with the token generated from the `/api/link/generate` endpoint.
- **Response (JSON):**
  {
    "message": "Link verified successfully",
    "token": "<JWT-token>"
  }

#### **3.4 GET /api/time**
This endpoint returns the current server time, but it requires a valid JWT token in the `Authorization` header.
- **URL:** `http://localhost:3000/api/time`
- **Authorization Header:**
  - Key: `Authorization`
- **Response (JSON):**
  {
    "current_time": "2025-02-21T12:34:56.789Z"
  }

#### **3.5 POST /api/admin/kickout**
This endpoint allows an admin to kick out a user, which invalidates their token(s).
- **Request Payload (JSON):**
  {
    "username": "user@example.com"
  }
- **Response (JSON):**
  {
    "message": "User has been kicked out"
  }
