# TaskFlow — Enterprise Task Management System

TaskFlow is a modern, responsive, and robust task management application designed for teams to organize, track, and collaborate on their daily workflows. Built with a robust React & TypeScript frontend and a powerful Node.js + Express backend, it serves as a fully featured internal business tool.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Database Architecture](#database-architecture)
6. [Environment Variables](#environment-variables)
7. [Setup & Installation](#setup--installation)
8. [Database Setup & Migrations](#database-setup--migrations)
9. [Running the Application](#running-the-application)
10. [API Documentation](#api-documentation)
11. [Assumptions Made](#assumptions-made)
12. [Author / Developer Information](#author--developer-information)

---

## Project Overview

TaskFlow goes beyond a standard todo app. It features a complete analytics dashboard, advanced server-side search, filtering, and sorting of tasks, dynamic comments, file attachments, and a comprehensive activity history log. It is split into:
* **Frontend**: A high-performance, single-page application built with React, Vite, Tailwind CSS, and Lucide React icons.
* **Backend**: An Express.js REST API using Prisma ORM with connection pooling to communicate with a PostgreSQL database.

---

## Key Features

### Core Requirements Implemented
* **Analytics Dashboard**: Get a bird's-eye view of your team's workload with live metrics on Total, Pending, In-Progress, Completed, Overdue tasks, and tasks assigned to the logged-in user.
* **Task Management**: Full CRUD operations for tasks, complete with assignments to team members, priority levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), status transitions (`Pending`, `InProgress`, `Completed`, `Blocked`), due dates, and rich markdown-friendly descriptions.
* **Task List & Server-Side Processing**: Tasks are rendered in a clean table view featuring server-side pagination, searching, sorting, and multi-filters (status, priority, assignee).
* **Task Details & Collaboration**: Deep-dive view of tasks where team members can exchange feedback using task comments/notes.
* **External API Integration**: Integrating `JSONPlaceholder` to dynamically fetch mock employee records for user suggestion updates, including custom timeout configuration (5s) and API rate-limit error handling.

### Optional Bonus Features Implemented
* 🔐 **Authentication & Authorization**: Secure JWT-based login and signup with Bcrypt password hashing.
* 👥 **Role-Based Access Control (RBAC)**: Distinguishes between `USER` and `ADMIN` roles. Only admins can delete tasks, manage user registers, assign/add users to teams, and view audit logs.
* 📝 **Task Activity History**: Every change to a task (status change, title change, priority adjustment) is tracked and logged in a task history timeline.
* 📎 **File Attachments**: Upload documents, mockups, or screenshots directly to a task using a multer-driven local upload mechanism.
* 📋 **Admin Audit Logging**: System-wide logging tracks crucial activities (user logins, signups, task edits, and admin deletions) with details like user-agent metadata and IP address tracking.
* 📖 **API Documentation**: An interactive API docs explorer built directly into the app (hosted at `http://localhost:5173/api-docs`).

---

## Tech Stack

### Frontend
* **Core**: React 19, TypeScript
* **Tooling**: Vite (for lightning-fast building and HMR)
* **Styling**: Tailwind CSS
* **Navigation**: React Router DOM (v7)
* **Icons & Notifications**: Lucide React, React Icons, and React Hot Toast

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Validation**: Zod
* **Database Client & ORM**: Prisma Client with PostgreSQL driver
* **Authentication**: JSON Web Tokens (JWT) & BcryptJS
* **File Uploads**: Multer

### Database
* **PostgreSQL** (Hosted via Serverless Neon DB connection pooling)

---

## Project Structure

TaskFlow separates concerns cleanly between the client and server. The directory layout is structured as follows:

```text
task-manager/
├── backend/
│   ├── config/             # Database connection pool and Prisma configurations
│   ├── controllers/        # Business logic controllers mapping to routes
│   ├── middleware/         # Auth guards, validation, upload & error handlers
│   ├── models/             # TypeScript type definitions and entities
│   ├── prisma/             # Schema definitions and migrations
│   ├── repositories/       # Prisma query abstraction layer (Data Access)
│   ├── routes/             # REST route mapping split by entity
│   ├── schemas/            # Zod validation schemas
│   ├── services/           # External API fetching and business workflows
│   ├── uploads/            # Local directory where attachments are stored
│   ├── utils/              # Common utility functions (errors, pagination)
│   └── index.ts            # Entrypoint file for Express server
│
├── frontend/
│   ├── src/
│   │   ├── api/            # API client modules mapped to backend routes
│   │   ├── assets/         # Static visual resources
│   │   ├── components/     # Reusable building blocks (UI & Layout)
│   │   │   ├── auth/       # Login/Signup forms
│   │   │   ├── layout/     # App frames, headers, sidebars
│   │   │   ├── task/       # Task forms, lists, history timelines
│   │   │   └── ui/         # Buttons, inputs, modals, tables, badges
│   │   ├── contexts/       # React Contexts (Auth and State wrappers)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Full page layout views
│   │   ├── types/          # Shared TypeScript typings
│   │   └── main.tsx        # React client entry point
│   ├── index.html
│   └── vite.config.ts
│
├── package.json            # Root configuration and backend runner commands
└── README.md               # Main instructions (This file)
```

---

## Database Architecture

The data models are built around the relational schema illustrated below:

* **User**: Holds account details, roles (`USER`/`ADMIN`), and metadata. Has a 1-to-many relationship with Tasks, Comments, and Audit Logs.
* **Task**: Stores Title, Description, Priority, Status, Due Date, and assignee reference. Cascades to associated Comments and Attachments.
* **Comment**: Message string linked to both a User and a Task.
* **Attachment**: Stores details (filename, path, size, and mime-type) of files uploaded for specific tasks.
* **TaskHistory**: Semi-structured log recording user-performed operations on tasks.
* **AuditLog**: Security log capturing logins, signups, and admin actions.

---

## Environment Variables

To run TaskFlow, configure the following environmental settings:

### Backend Configuration (`backend/.env` or root `.env`)
Create a `.env` file inside the root and/or `backend` folder:
```env
# PostgreSQL connection string with pooling / ssl options
DATABASE_URL="postgresql://neondb_owner:password@ep-host-name-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Server JWT token configurations
JWT_SECRET="taskflow-jwt-secret-key-change-in-production-2026"
JWT_EXPIRES_IN="7d"

# Optional: port configuration (defaults to 3000)
PORT=3000
```

---

## Setup & Installation

Follow these steps to configure and boot TaskFlow on your local development machine:

### 1. Prerequisites
Ensure you have the following installed:
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* A running **PostgreSQL** instance (or a Neon DB cloud database URL)

### 2. Clone and Install Dependencies
Install all package dependencies in both the root folder (which configures the backend) and the frontend directory:

```bash
# Install root (backend) dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## Database Setup & Migrations

Prisma handles migrations and client generation for PostgreSQL database mappings. 

1. Ensure the `DATABASE_URL` in `.env` points to your active Postgres database.
2. Generate the Prisma local typings and client:
   ```bash
   npx prisma generate
   ```
3. Push/apply existing migrations to initialize the tables:
   ```bash
   npx prisma db push
   ```
   *(Alternatively, for local dev tracking, run `npx prisma migrate dev --name init`)*

---

## Running the Application

Both backend and frontend must run concurrently. You can start them in separate terminals:

### Start the Backend Server
From the project root:
```bash
npm run dev:backend
```
The backend API server launches at: **`http://localhost:3000`**

### Start the Frontend Client
From the `frontend` folder:
```bash
npm run dev
```
The Vite client application launches at: **`http://localhost:5173`**

---

## API Documentation

TaskFlow includes detailed, interactive API Documentation accessible directly through the web application interface:
* Link: **`http://localhost:5173/api-docs`**

For quick reference, the core REST endpoints are outlined below:

### Authentication
* `POST /api/auth/signup` - Register a new user account.
* `POST /api/auth/login` - Authenticate and retrieve a JWT access token.
* `GET /api/auth/me` - Fetch details of the currently logged-in user.

### Dashboard & Analytics
* `GET /api/dashboard` - Get summarized numerical task metrics.

### Task Management
* `GET /api/tasks` - Query tasks with optional sorting, search, paging, and filters.
* `GET /api/tasks/:id` - Fetch details for a specific task (includes comment history and files).
* `POST /api/tasks` - Create a new task.
* `PUT /api/tasks/:id` - Edit/modify task fields.
* `DELETE /api/tasks/:id` *(Admin Only)* - Remove a task permanently.

### Comments & Collaboration
* `GET /api/tasks/:taskId/comments` - Retrieve comments for a task.
* `POST /api/tasks/:taskId/comments` - Add a new text comment.
* `DELETE /api/tasks/:taskId/comments/:id` - Delete an existing comment.

### File Attachments
* `POST /api/tasks/:taskId/attachments` - Upload an attachment (multipart/form-data with `file` field).
* `DELETE /api/tasks/:taskId/attachments/:id` - Remove a uploaded file.

### Team & Users
* `GET /api/users` - List all users in the system.
* `POST /api/users` *(Admin Only)* - Add/register new users directly.
* `POST /api/users/add-to-team` *(Admin Only)* - Promote existing users to Team Member status.
* `PUT /api/users/:id` *(Admin Only)* - Modify user status or roles.
* `DELETE /api/users/:id` *(Admin Only)* - Remove a user.

### System Logging & Auditing
* `GET /api/history` - Retrieve task modifications timeline.
* `GET /api/audit-logs` *(Admin Only)* - Inspect system administrative logs.
* `GET /api/external/users` *(Admin Only)* - Access external integration mock users.

---

## Assumptions Made

During the implementation of TaskFlow, the following structural decisions and assumptions were made:

1. **Role Privileges**:
   * A default `USER` is authorized to create tasks, update fields on assigned tasks, upload attachments, and post comments.
   * Only `ADMIN` users possess the clearance to delete tasks, edit other users, promote users to the team, pull from external APIs, or audit system security logs.

2. **File Storage Isolation**:
   * File attachments are stored locally within the `backend/uploads/` directory on the server. In a production environment, this should be transitioned to a secure cloud-based block storage solution (like Amazon S3 or Google Cloud Storage).

3. **External Team Synced API**:
   * The external team fetch endpoint integrates with the public `JSONPlaceholder` API. It behaves as a readonly catalog of user information.

4. **Audit and Change logs**:
   * Task history is written automatically using repositories on successful task updates, inserts, and deletes, providing an immutable historical footprint of task progress.

---

## Author / Developer Information

This project was developed by:

* **Name**: Satnam Singh
* **Email**: [satnamkot8@gmail.com](mailto:satnamkot8@gmail.com)
* **Phone**: 77400-3662
* **WhatsApp**: [+91 77400-36662](https://wa.me/917740036662)
* **Location**: Moga, Punjab, India
