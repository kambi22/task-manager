# Task Management System - Manual Test Plan

This document outlines step-by-step manual test procedures for verifying all completed features of the Task Management System against [assignment.md](file:///d:/Freelace/MyProjects/task-manager/assignment.md).

---

## Pre-requisites & Setup
1. **Start Backend**: `npm run dev:backend` (Runs on `http://localhost:3000`)
2. **Start Frontend**: `npm run dev` (Runs on `http://localhost:5173`)
3. **Database**: PostgreSQL with running Prisma migrations & seeds (`npx prisma db seed`)

---

## Test Suite 1: Dashboard Overview (Section 1)

### TC-1.1: Verify Metric Cards
- **Objective**: Ensure all 5 required dashboard metrics render with accurate counts.
- **Steps**:
  1. Navigate to `http://localhost:5173/` (Dashboard).
  2. Inspect top metrics grid.
- **Expected Results**:
  - Displays **Total Tasks**, **Pending**, **In Progress**, **Completed**, and **Overdue** count cards with vibrant glassmorphic gradients.

### TC-1.2: Recent Tasks List
- **Objective**: Verify recent tasks are displayed on the dashboard.
- **Steps**:
  1. Scroll down on the Dashboard page to the "Recent Tasks" section.
  2. Click any task row.
- **Expected Results**:
  - Displays up to 5 recent tasks.
  - Clicking a row opens the slide-over **Task Detail** drawer.

---

## Test Suite 2: Task Management & CRUD (Section 2 & 8)

### TC-2.1: Create Task
- **Objective**: Verify task creation functionality.
- **Steps**:
  1. Navigate to `/tasks`.
  2. Click **Create Task** button.
  3. Fill in fields:
     - Title: `Test API Integration Task`
     - Description: `Testing full CRUD lifecycle`
     - Status: `Pending`
     - Priority: `High`
     - Assigned User: Select `Satnam Singh` (or any available user)
     - Due Date: Select future date
  4. Click **Create Task**.
- **Expected Results**:
  - Success toast message `"Task created successfully"`.
  - Modal closes, task table updates, total task count increments by 1.

### TC-2.2: Edit Task
- **Objective**: Verify editing an existing task.
- **Steps**:
  1. Locate `Test API Integration Task` in the tasks table.
  2. Click the **Edit** action button (pencil icon).
  3. Change status to `In Progress` and priority to `Urgent`.
  4. Click **Save Changes**.
- **Expected Results**:
  - Success toast message `"Task updated successfully"`.
  - Task row updates immediately reflecting new status badge (`In Progress`) and priority badge (`Urgent`).

### TC-2.3: Task Detail View & Comments (Notes)
- **Objective**: Test detailed view drawer and adding notes/comments.
- **Steps**:
  1. Click **View Details** (eye icon) on any task.
  2. Verify task metadata (Status, Priority, Assignee, Due Date, Created/Updated dates) is displayed in drawer.
  3. Scroll to the **Comments & Notes** section.
  4. Type a comment: `"Initial investigation completed."` and select comment author.
  5. Click **Post Comment**.
- **Expected Results**:
  - Drawer opens smoothly from right.
  - Comment posts instantly and appears under comments list with author name & timestamp.

### TC-2.4: Delete Task with Confirmation
- **Objective**: Verify destructive task deletion with safety modal.
- **Steps**:
  1. Click the **Delete** action button (trash icon) on a task.
  2. Observe confirmation modal window.
  3. Click **Cancel** -> Task remains unaffected.
  4. Click Delete again, then click **Delete Task** -> Confirmation proceeds.
- **Expected Results**:
  - Modal warns with clear destructive warning text.
  - Task is deleted from backend PostgreSQL database and disappears from UI.

---

## Test Suite 3: Task List Filtering, Search, & Pagination (Section 3 & 4)

### TC-3.1: Search Functionality
- **Objective**: Verify search filters task list by title or description.
- **Steps**:
  1. In `/tasks`, type a keyword into the Search bar (e.g., `Shopify` or `API`).
  2. Observe table update after 300ms debounce.
- **Expected Results**:
  - Table only displays tasks containing search string in title or description.

### TC-3.2: Status Filter
- **Objective**: Verify filtering tasks by status.
- **Steps**:
  1. Select **Filter by Status** -> `Completed`.
- **Expected Results**:
  - Backend API query parameter `?status=Completed` is invoked.
  - Table displays only Completed tasks.

### TC-3.3: Priority Filter
- **Objective**: Verify filtering tasks by priority.
- **Steps**:
  1. Select **Priority** -> `Urgent`.
- **Expected Results**:
  - Table displays only Urgent priority tasks.

### TC-3.4: Assignee Filter (No Project Filter)
- **Objective**: Verify Assignee filter works and non-spec Project Filter is absent.
- **Steps**:
  1. Observe filters row: Confirm **no "Filter by Project"** dropdown exists.
  2. Select **All Assignees** dropdown -> Choose a team member.
- **Expected Results**:
  - API parameter `?assignee={user_id}` filters tasks assigned to that user.

### TC-3.5: Sorting & Pagination
- **Objective**: Verify table sorting headers and page navigation.
- **Steps**:
  1. Click header column `Priority` -> Toggles sorting asc/desc.
  2. Click header column `Due Date` -> Toggles sorting asc/desc.
  3. Scroll to bottom -> Click `Next` page button if total tasks > page limit.
- **Expected Results**:
  - Table sorts records dynamically via backend `sortBy` and `sortOrder` query params.
  - Pagination correctly requests requested page data.

---

## Test Suite 4: Team Directory & External API Integration (Section 7)

### TC-4.1: Internal Team Directory
- **Objective**: Verify local user directory and adding team members.
- **Steps**:
  1. Navigate to `/team`.
  2. Verify internal team members grid renders.
  3. Click **Add Member** -> Enter name `Alex Rivera`, email `alex@example.com`, role `USER` -> Submit.
- **Expected Results**:
  - New user added to local PostgreSQL database and displayed in grid.

### TC-4.2: External API Integration (JSONPlaceholder API)
- **Objective**: Verify External API fetching with timeout & error handling.
- **Steps**:
  1. On `/team` page, click **Explore External Directory**.
  2. Observe external users panel loading from `https://jsonplaceholder.typicode.com/users` (backend `/api/external/users`).
  3. Click **Import Member** on any external user card (e.g. `Leanne Graham`).
- **Expected Results**:
  - External users load with username, email, and company details.
  - Clicking Import Member creates local user record and updates button state to "In Team".

---

## Summary Matrix

| Section | Requirement | Status | Verification Method |
| :--- | :--- | :--- | :--- |
| **1. Dashboard** | Total, Pending, In Progress, Completed, Overdue counts | ✅ PASSED | Manual TC-1.1, TC-1.2 |
| **2. Task Management** | Full CRUD, Priority, Due Date, Status, Comments | ✅ PASSED | Manual TC-2.1 to TC-2.4 |
| **3. Task List** | Search, Status, Priority, Assignee Filter, Sort, Paginate | ✅ PASSED | Manual TC-3.1 to TC-3.5 |
| **4. Backend REST API** | Express endpoints, Validation, Errors, HTTP status codes | ✅ PASSED | Integration test & Swagger/Postman |
| **5. Database** | PostgreSQL schema with Users, Tasks, Comments | ✅ PASSED | Prisma Migration & DB Connect |
| **6. Reusable Code** | Component system (Button, Modal, Table, Badges, etc.) | ✅ PASSED | Architectural Audit |
| **7. External API** | GET /api/external/users with timeout & error handling | ✅ PASSED | Manual TC-4.2 |
| **8. Task Detail** | Slide-over drawer with edit & comment posting | ✅ PASSED | Manual TC-2.3 |
