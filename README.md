# 🛡️ NestJS Advanced Auth Template

An enterprise-grade authentication and authorization boilerplate built with NestJS, TypeScript, and [PostgreSQL/MongoDB]. Designed for high performance, strict typing, and scalable security.

## ✨ Core Features
* **JWT Authentication:** Secure stateless session management.
* **Refresh Token Rotation:** Prevent token hijacking with secure rotation.
* **Role-Based Access Control (RBAC):** Granular permission guards (Admin, User, Manager).
* **Password Hashing:** Industry-standard Bcrypt integration.
* **Strict Validation:** Request payload validation using `class-validator` and `class-transformer`.
* **Centralized Error Handling:** Global exception filters for consistent API responses.

## 🛠️ Tech Stack
* **Framework:** NestJS (Express under the hood)
* **Language:** TypeScript
* **Database & ORM:** [e.g., Prisma / TypeORM / Mongoose]
* **Security:** Passport.js, JWT, Helmet

## 🚀 Quick Start

### 1. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=3000
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_EXPIRES_IN="15m"
```
### 2. Installation & Running
```Bash
pnpm install
pnpm run build
pnpm run start:dev
```

## API Endpoint
| Method | Route              | Description                     | Auth Required |
| ------ | ------------------ | ------------------------------- | ------------- |
| POST   | /api/auth/register | Register a new user             | ❌             |
| POST   | /api/auth/login    | Authenticate and receive tokens | ❌             |
| POST   | /api/auth/refresh  | Get new access token            | ✅ (Refresh)   |
| GET    | /api/users/profile | Get current user data           | ✅ (Access)    |
