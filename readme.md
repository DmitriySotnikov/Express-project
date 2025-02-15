# Project Name

A Node.js project built with Express, MySQL, and TypeScript. The project includes JWT authentication with support for multiple device logins using a `deviceId` parameter. It also provides full CRUD functionality for user authentication and file management.

## Features

- **Authentication**:
  - Supports login across multiple devices using `deviceId`.
  - Implements secure JWT-based authentication.
- **File Management**:
  - Full CRUD functionality for file operations.
  - File upload support using `form-data`.
- Built with **Node.js**, **Express**, **MySQL**, **Mysql2**, **Joi**, **Webpack**, **Bcrypt**, and **TypeScript**.

## Prerequisites

To run this project, you need:

1. **MySQL**: Install MySQL locally and configure the connection in the project settings.
2. **Node.js**: Make sure Node.js is installed on your system.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-folder>

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Create a database in MySQL:

Example SQL:

```sql
CREATE DATABASE node_mysql_api;

```

4. Run database migrations:

   ```bash
   npm run migrate

   ```

## Running the Project

- **Development Mode**

   ```bash 
   npm run dev 

   ```
    

- **Production Mode**

1. Build the project:

   ```bash
   npm run build

   ```

2. Start the production server:

   ```bash
   npm run start

   ```

## API Endpoints

- **Authentication**:

- `/api/auth/login`: Login with email and password.

Request Body:

```json
{
  "login": "+7900000000000",
  "password": "QWERTY12345",
  "deviceId": "1234567890"
}
```

- `/api/auth/register`: Register a new user.

Request Body:

```json
{
  "login": "+7900000000000",
  "password": "QWERTY12345",
  "deviceId": "1234567890"
}
```

## File Management

- **Upload File**:

  - `/api/file/upload`: Upload a file.

  1. Send the request using form-data.

  2. Include the file under the key file.

  - **List Files**:

  - `/api/file/list`: List files.

  1. limit: Number of records per page.

  2. page: The current page number.

## Additional Notes

The project supports authentication on multiple devices by passing a unique deviceId parameter in the authentication requests. This allows users to remain logged in on different devices without conflicts.
The refresh token is automatically attached to the cookie upon login. It contains information about the user and deviceId.
