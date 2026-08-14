import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { PageHeader } from "../components/layout/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import {
  Play,
  Send,
  Lock,
  Unlock,
  Clock,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  Terminal,
  Activity,
  Layers,
  FileText,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  FileUp,
} from "lucide-react";

interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
  example?: string;
}

interface Endpoint {
  id: string;
  group: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth: "public" | "authenticated";
  roles?: string[];
  pathParams?: EndpointParam[];
  queryParams?: EndpointParam[];
  bodyTemplate?: string;
  response200: string;
  responseError?: { status: number; message: string; description: string }[];
}

const apiGroups = [
  "Authentication",
  "Dashboard",
  "Tasks",
  "Comments",
  "Attachments",
  "Users & Team",
  "Task History",
  "Audit Logs",
  "External API",
];

const endpoints: Endpoint[] = [
  // --- AUTHENTICATION ---
  {
    id: "auth-signup",
    group: "Authentication",
    name: "User Signup",
    method: "POST",
    path: "/auth/signup",
    description: "Register a new user account. Defaults to the USER role.",
    auth: "public",
    bodyTemplate: JSON.stringify(
      {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "securepassword123",
        role: "USER",
      },
      null,
      2
    ),
    response200: JSON.stringify(
      {
        message: "User registered successfully",
        user: {
          id: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
          name: "Jane Doe",
          email: "jane@example.com",
          role: "USER",
          isTeamMember: false,
          createdAt: "2026-08-14T08:00:00.000Z",
        },
      },
      null,
      2
    ),
  },
  {
    id: "auth-login",
    group: "Authentication",
    name: "User Login",
    method: "POST",
    path: "/auth/login",
    description: "Authenticate a user and retrieve a JWT token.",
    auth: "public",
    bodyTemplate: JSON.stringify(
      {
        email: "jane@example.com",
        password: "securepassword123",
      },
      null,
      2
    ),
    response200: JSON.stringify(
      {
        message: "Login successful",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
          name: "Jane Doe",
          email: "jane@example.com",
          role: "USER",
          isTeamMember: false,
        },
      },
      null,
      2
    ),
  },
  {
    id: "auth-me",
    group: "Authentication",
    name: "Get Current Profile",
    method: "GET",
    path: "/auth/me",
    description: "Retrieve profile details of the currently authenticated session.",
    auth: "authenticated",
    response200: JSON.stringify(
      {
        user: {
          id: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
          name: "Jane Doe",
          email: "jane@example.com",
          role: "USER",
          isTeamMember: false,
          createdAt: "2026-08-14T08:00:00.000Z",
        },
      },
      null,
      2
    ),
  },

  // --- DASHBOARD ---
  {
    id: "dashboard-stats",
    group: "Dashboard",
    name: "Get Dashboard Statistics",
    method: "GET",
    path: "/dashboard",
    description: "Retrieve high-level numbers for cards (total, pending, overdue, etc.).",
    auth: "authenticated",
    response200: JSON.stringify(
      {
        stats: {
          total: 12,
          pending: 4,
          inProgress: 3,
          completed: 4,
          blocked: 1,
          urgent: 2,
          high: 3,
          medium: 5,
          low: 2,
          overdue: 1,
          assignedToMe: 5,
        },
      },
      null,
      2
    ),
  },

  // --- TASKS ---
  {
    id: "tasks-list",
    group: "Tasks",
    name: "List Tasks",
    method: "GET",
    path: "/tasks",
    description: "Retrieve a paginated, filterable list of tasks.",
    auth: "authenticated",
    queryParams: [
      { name: "status", type: "string", required: false, description: "Filter by status: Pending, InProgress, Completed, Blocked" },
      { name: "priority", type: "string", required: false, description: "Filter by priority: LOW, MEDIUM, HIGH, URGENT" },
      { name: "assignee", type: "string (UUID)", required: false, description: "Filter by assigned user's ID" },
      { name: "search", type: "string", required: false, description: "Search term for task titles" },
      { name: "page", type: "number", required: false, description: "Page number (defaults to 1)", defaultValue: "1" },
      { name: "limit", type: "number", required: false, description: "Records per page (defaults to 20, max 100)", defaultValue: "20" },
      { name: "sortBy", type: "string", required: false, description: "Sort field: title, status, priority, dueDate, createdAt, updatedAt", defaultValue: "createdAt" },
      { name: "sortOrder", type: "string", required: false, description: "Sort ordering: asc, desc", defaultValue: "desc" },
    ],
    response200: JSON.stringify(
      {
        tasks: [
          {
            id: "c8a4f89d-7dbb-4fa8-b223-38827fa6d309",
            title: "Setup database indexes",
            description: "Optimize PostgreSQL indexes for faster task search.",
            status: "InProgress",
            priority: "HIGH",
            dueDate: "2026-08-20T12:00:00.000Z",
            assignedTo: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
            createdAt: "2026-08-14T07:00:00.000Z",
            updatedAt: "2026-08-14T07:30:00.000Z",
            assignee: {
              name: "Jane Doe",
              email: "jane@example.com",
            },
          },
        ],
        pagination: {
          total: 12,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      },
      null,
      2
    ),
  },
  {
    id: "tasks-get",
    group: "Tasks",
    name: "Get Task By ID",
    method: "GET",
    path: "/tasks/:id",
    description: "Fetch full details of a specific task, including attachments and comments.",
    auth: "authenticated",
    pathParams: [
      { name: "id", type: "string (UUID)", required: true, description: "Task UUID" },
    ],
    response200: JSON.stringify(
      {
        task: {
          id: "c8a4f89d-7dbb-4fa8-b223-38827fa6d309",
          title: "Setup database indexes",
          description: "Optimize PostgreSQL indexes for faster task search.",
          status: "InProgress",
          priority: "HIGH",
          dueDate: "2026-08-20T12:00:00.000Z",
          assignedTo: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
          createdAt: "2026-08-14T07:00:00.000Z",
          updatedAt: "2026-08-14T07:30:00.000Z",
          assignee: {
            id: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
            name: "Jane Doe",
            email: "jane@example.com",
          },
          attachments: [],
          comments: [],
        },
      },
      null,
      2
    ),
  },
  {
    id: "tasks-create",
    group: "Tasks",
    name: "Create Task",
    method: "POST",
    path: "/tasks",
    description: "Create a new task.",
    auth: "authenticated",
    bodyTemplate: JSON.stringify(
      {
        title: "Write API Documentation",
        description: "Document all REST endpoints and build playground.",
        status: "Pending",
        priority: "HIGH",
        assignedTo: null,
        dueDate: "2026-08-18T18:30:00.000Z",
      },
      null,
      2
    ),
    response200: JSON.stringify(
      {
        message: "Task created successfully",
        task: {
          id: "d094b8e2-881c-4395-8854-9fa0f4e3c9a0",
          title: "Write API Documentation",
          description: "Document all REST endpoints and build playground.",
          status: "Pending",
          priority: "HIGH",
          assignedTo: null,
          dueDate: "2026-08-18T18:30:00.000Z",
          createdAt: "2026-08-14T08:10:00.000Z",
          updatedAt: "2026-08-14T08:10:00.000Z",
        },
      },
      null,
      2
    ),
  },
  {
    id: "tasks-update",
    group: "Tasks",
    name: "Update Task",
    method: "PUT",
    path: "/tasks/:id",
    description: "Update details of an existing task.",
    auth: "authenticated",
    pathParams: [
      { name: "id", type: "string (UUID)", required: true, description: "Task UUID" },
    ],
    bodyTemplate: JSON.stringify(
      {
        status: "InProgress",
        priority: "URGENT",
      },
      null,
      2
    ),
    response200: JSON.stringify(
      {
        message: "Task updated successfully",
        task: {
          id: "d094b8e2-881c-4395-8854-9fa0f4e3c9a0",
          title: "Write API Documentation",
          description: "Document all REST endpoints and build playground.",
          status: "InProgress",
          priority: "URGENT",
          assignedTo: null,
          dueDate: "2026-08-18T18:30:00.000Z",
          createdAt: "2026-08-14T08:10:00.000Z",
          updatedAt: "2026-08-14T08:12:00.000Z",
        },
      },
      null,
      2
    ),
  },
  {
    id: "tasks-delete",
    group: "Tasks",
    name: "Delete Task",
    method: "DELETE",
    path: "/tasks/:id",
    description: "Hard delete a task. Destructive action.",
    auth: "authenticated",
    roles: ["ADMIN"],
    pathParams: [
      { name: "id", type: "string (UUID)", required: true, description: "Task UUID" },
    ],
    response200: JSON.stringify(
      {
        message: "Task deleted successfully",
      },
      null,
      2
    ),
  },

  // --- COMMENTS ---
  {
    id: "comments-list",
    group: "Comments",
    name: "List Task Comments",
    method: "GET",
    path: "/tasks/:taskId/comments",
    description: "Get all comments left on a specific task.",
    auth: "authenticated",
    pathParams: [
      { name: "taskId", type: "string (UUID)", required: true, description: "Task UUID" },
    ],
    response200: JSON.stringify(
      {
        comments: [
          {
            id: "4cf51532-6a77-440e-b83b-3bc7155a0139",
            taskId: "d094b8e2-881c-4395-8854-9fa0f4e3c9a0",
            userId: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
            comment: "Draft documentation is ready.",
            createdAt: "2026-08-14T08:15:00.000Z",
            user: {
              name: "Jane Doe",
              email: "jane@example.com",
            },
          },
        ],
      },
      null,
      2
    ),
  },
  {
    id: "comments-create",
    group: "Comments",
    name: "Add Comment",
    method: "POST",
    path: "/tasks/:taskId/comments",
    description: "Post a new comment on a specific task.",
    auth: "authenticated",
    pathParams: [
      { name: "taskId", type: "string (UUID)", required: true, description: "Task UUID" },
    ],
    bodyTemplate: JSON.stringify(
      {
        comment: "Working on implementing the API Docs page now.",
      },
      null,
      2
    ),
    response200: JSON.stringify(
      {
        message: "Comment added successfully",
        comment: {
          id: "5fa2f231-155e-4bbd-9ea8-2fa5c15e8da1",
          taskId: "d094b8e2-881c-4395-8854-9fa0f4e3c9a0",
          userId: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
          comment: "Working on implementing the API Docs page now.",
          createdAt: "2026-08-14T08:20:00.000Z",
        },
      },
      null,
      2
    ),
  },
  {
    id: "comments-delete",
    group: "Comments",
    name: "Delete Comment",
    method: "DELETE",
    path: "/tasks/:taskId/comments/:id",
    description: "Delete a comment by its ID.",
    auth: "authenticated",
    pathParams: [
      { name: "taskId", type: "string (UUID)", required: true, description: "Task UUID" },
      { name: "id", type: "string (UUID)", required: true, description: "Comment UUID" },
    ],
    response200: JSON.stringify(
      {
        message: "Comment deleted successfully",
      },
      null,
      2
    ),
  },

  // --- ATTACHMENTS ---
  {
    id: "attachments-upload",
    group: "Attachments",
    name: "Upload Attachment",
    method: "POST",
    path: "/tasks/:taskId/attachments",
    description: "Upload a file and attach it to a task. Must be sent as multipart/form-data.",
    auth: "authenticated",
    pathParams: [
      { name: "taskId", type: "string (UUID)", required: true, description: "Task UUID" },
    ],
    bodyTemplate: "[Multipart Form Data: Attach file field 'file']",
    response200: JSON.stringify(
      {
        message: "File uploaded successfully",
        attachment: {
          id: "67a3f892-db5e-4a62-9a3d-c12e9b048fa1",
          taskId: "d094b8e2-881c-4395-8854-9fa0f4e3c9a0",
          name: "api-spec.json",
          path: "/uploads/api-spec-1723623600000.json",
          size: 4820,
          createdAt: "2026-08-14T08:30:00.000Z",
        },
      },
      null,
      2
    ),
  },
  {
    id: "attachments-delete",
    group: "Attachments",
    name: "Delete Attachment",
    method: "DELETE",
    path: "/tasks/:taskId/attachments/:id",
    description: "Remove and delete an attachment from a task.",
    auth: "authenticated",
    pathParams: [
      { name: "taskId", type: "string (UUID)", required: true, description: "Task UUID" },
      { name: "id", type: "string (UUID)", required: true, description: "Attachment UUID" },
    ],
    response200: JSON.stringify(
      {
        message: "Attachment deleted successfully",
      },
      null,
      2
    ),
  },

  // --- USERS & TEAM ---
  {
    id: "users-list",
    group: "Users & Team",
    name: "List Users",
    method: "GET",
    path: "/users",
    description: "Get all registered users in the database.",
    auth: "authenticated",
    response200: JSON.stringify(
      {
        users: [
          {
            id: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
            name: "Jane Doe",
            email: "jane@example.com",
            role: "USER",
            isTeamMember: true,
            createdAt: "2026-08-14T08:00:00.000Z",
          },
        ],
      },
      null,
      2
    ),
  },
  {
    id: "users-create",
    group: "Users & Team",
    name: "Create User",
    method: "POST",
    path: "/users",
    description: "Register a new user directly. Restricted to administrators.",
    auth: "authenticated",
    roles: ["ADMIN"],
    bodyTemplate: JSON.stringify(
      {
        name: "Bob Smith",
        email: "bob@example.com",
        role: "USER",
        isTeamMember: true,
      },
      null,
      2
    ),
    response200: JSON.stringify(
      {
        message: "User created successfully",
        user: {
          id: "c8fa5d20-b0ff-4cfc-8ff1-daef1b2390f1",
          name: "Bob Smith",
          email: "bob@example.com",
          role: "USER",
          isTeamMember: true,
          createdAt: "2026-08-14T08:40:00.000Z",
        },
      },
      null,
      2
    ),
  },
  {
    id: "users-add-to-team",
    group: "Users & Team",
    name: "Add Users To Team",
    method: "POST",
    path: "/users/add-to-team",
    description: "Bulk add multiple users to the development/active team. Restricted to administrators.",
    auth: "authenticated",
    roles: ["ADMIN"],
    bodyTemplate: JSON.stringify(
      {
        userIds: ["c8fa5d20-b0ff-4cfc-8ff1-daef1b2390f1"],
      },
      null,
      2
    ),
    response200: JSON.stringify(
      {
        message: "Users added to team successfully",
        updatedCount: 1,
      },
      null,
      2
    ),
  },
  {
    id: "users-update",
    group: "Users & Team",
    name: "Update User Profile",
    method: "PUT",
    path: "/users/:id",
    description: "Edit role or team-member status of a user. Restricted to administrators.",
    auth: "authenticated",
    roles: ["ADMIN"],
    pathParams: [
      { name: "id", type: "string (UUID)", required: true, description: "User UUID" },
    ],
    bodyTemplate: JSON.stringify(
      {
        name: "Bob J. Smith",
        role: "ADMIN",
        isTeamMember: true,
      },
      null,
      2
    ),
    response200: JSON.stringify(
      {
        message: "User updated successfully",
        user: {
          id: "c8fa5d20-b0ff-4cfc-8ff1-daef1b2390f1",
          name: "Bob J. Smith",
          email: "bob@example.com",
          role: "ADMIN",
          isTeamMember: true,
          createdAt: "2026-08-14T08:40:00.000Z",
        },
      },
      null,
      2
    ),
  },
  {
    id: "users-delete",
    group: "Users & Team",
    name: "Delete User",
    method: "DELETE",
    path: "/users/:id",
    description: "Hard delete a user from the application. Restricted to administrators.",
    auth: "authenticated",
    roles: ["ADMIN"],
    pathParams: [
      { name: "id", type: "string (UUID)", required: true, description: "User UUID" },
    ],
    response200: JSON.stringify(
      {
        message: "User deleted successfully",
      },
      null,
      2
    ),
  },

  // --- TASK HISTORY ---
  {
    id: "history-list",
    group: "Task History",
    name: "Get Task History Logs",
    method: "GET",
    path: "/history",
    description: "Retrieve a paginated tracking history of changes made to tasks.",
    auth: "authenticated",
    queryParams: [
      { name: "action", type: "string", required: false, description: "Filter by action: CREATE, UPDATE, DELETE" },
      { name: "taskId", type: "string (UUID)", required: false, description: "Filter by task ID" },
      { name: "userId", type: "string (UUID)", required: false, description: "Filter by acting user ID" },
      { name: "page", type: "number", required: false, description: "Page number (defaults to 1)", defaultValue: "1" },
      { name: "limit", type: "number", required: false, description: "Items per page (defaults to 15)", defaultValue: "15" },
    ],
    response200: JSON.stringify(
      {
        history: [
          {
            id: "a92e10c1-2ba6-4554-ba5f-bfaef028e932",
            taskId: "d094b8e2-881c-4395-8854-9fa0f4e3c9a0",
            taskTitle: "Write API Documentation",
            userId: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
            userName: "Jane Doe",
            action: "CREATE",
            details: {
              message: "Task created.",
            },
            createdAt: "2026-08-14T08:10:00.000Z",
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      },
      null,
      2
    ),
  },

  // --- AUDIT LOGS ---
  {
    id: "audit-logs-list",
    group: "Audit Logs",
    name: "List Audit Logs",
    method: "GET",
    path: "/audit-logs",
    description: "Retrieve system security audit logs (Logins, user changes). Restricted to administrators.",
    auth: "authenticated",
    roles: ["ADMIN"],
    queryParams: [
      { name: "userId", type: "string (UUID)", required: false, description: "Filter by target user ID" },
      { name: "action", type: "string", required: false, description: "Filter by action type (LOGIN, LOGOUT, CREATE_USER, etc.)" },
      { name: "search", type: "string", required: false, description: "Search IP or description details" },
      { name: "page", type: "number", required: false, description: "Page number", defaultValue: "1" },
      { name: "limit", type: "number", required: false, description: "Items per page", defaultValue: "20" },
    ],
    response200: JSON.stringify(
      {
        logs: [
          {
            id: "7bf310ea-7359-450f-a185-c081e280ffef",
            userId: "e9b5f543-8557-41ab-85b5-7cfa5a278912",
            userName: "Jane Doe",
            action: "LOGIN",
            details: "User logged in.",
            ipAddress: "127.0.0.1",
            userAgent: "Mozilla/5.0...",
            createdAt: "2026-08-14T08:00:00.000Z",
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      },
      null,
      2
    ),
  },

  // --- EXTERNAL API ---
  {
    id: "external-users",
    group: "External API",
    name: "Fetch External Users",
    method: "GET",
    path: "/external/users",
    description: "Fetch mock users from the public JSONPlaceholder API. Demonstrates external integration capability. Restricted to administrators.",
    auth: "authenticated",
    roles: ["ADMIN"],
    response200: JSON.stringify(
      [
        {
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          address: {
            street: "Kulas Light",
            suite: "Apt. 556",
            city: "Gwenborough",
            zipcode: "92998-3874",
            geo: {
              lat: "-37.3159",
              lng: "81.1496",
            },
          },
          phone: "1-770-736-8031 x56442",
          website: "hildegard.org",
          company: {
            name: "Romaguera-Crona",
            catchPhrase: "Multi-layered client-server neural-net",
            bs: "harness real-time e-markets",
          },
        },
      ],
      null,
      2
    ),
  },
];

// Helper function to colorize and format raw JSON
function syntaxHighlight(json: string) {
  if (typeof json !== "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match) {
      let cls = "text-amber-500 dark:text-amber-300"; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-blue-500 dark:text-blue-400 font-medium"; // key
        } else {
          cls = "text-emerald-600 dark:text-emerald-400"; // string
        }
      } else if (/true|false/.test(match)) {
        cls = "text-violet-600 dark:text-violet-400 font-semibold"; // boolean
      } else if (/null/.test(match)) {
        cls = "text-rose-500 dark:text-rose-400 font-semibold"; // null
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

export default function ApiDocsPage() {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string>("Authentication");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[0]);
  const [activeTab, setActiveTab] = useState<"docs" | "playground">("docs");

  // Playground state
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});
  const [queryParamValues, setQueryParamValues] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string>("");
  const [playgroundResponse, setPlaygroundResponse] = useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    duration: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync playground fields when selected endpoint changes
  useEffect(() => {
    const paths: Record<string, string> = {};
    selectedEndpoint.pathParams?.forEach((p) => {
      paths[p.name] = p.defaultValue || "";
    });
    setPathParamValues(paths);

    const queries: Record<string, string> = {};
    selectedEndpoint.queryParams?.forEach((q) => {
      queries[q.name] = q.defaultValue || "";
    });
    setQueryParamValues(queries);

    setRequestBody(selectedEndpoint.bodyTemplate || "");
    setPlaygroundResponse(null);
    setAttachmentFile(null);
  }, [selectedEndpoint]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "POST":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PUT":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const executePlaygroundRequest = async () => {
    setLoading(true);
    setPlaygroundResponse(null);
    const startTime = performance.now();

    try {
      // 1. Substitute Path Parameters
      let finalUrl = selectedEndpoint.path;
      if (selectedEndpoint.pathParams) {
        selectedEndpoint.pathParams.forEach((param) => {
          const val = pathParamValues[param.name];
          finalUrl = finalUrl.replace(`:${param.name}`, val || `:${param.name}`);
        });
      }

      // 2. Build Query Parameters
      const finalParams: Record<string, any> = {};
      if (selectedEndpoint.queryParams) {
        selectedEndpoint.queryParams.forEach((param) => {
          const val = queryParamValues[param.name];
          if (val !== undefined && val !== "") {
            finalParams[param.name] = val;
          }
        });
      }

      // 3. Prepare Body Data
      let finalData: any = undefined;
      const headers: Record<string, string> = {};

      if (selectedEndpoint.id === "attachments-upload") {
        const formData = new FormData();
        if (attachmentFile) {
          formData.append("file", attachmentFile);
        }
        finalData = formData;
        // Content-Type is set automatically by axios when using FormData
      } else if (["POST", "PUT"].includes(selectedEndpoint.method) && requestBody) {
        try {
          finalData = JSON.parse(requestBody);
        } catch (err: any) {
          throw new Error(`Invalid JSON body: ${err.message}`);
        }
      }

      // 4. Run HTTP call
      const res = await axiosClient({
        method: selectedEndpoint.method,
        url: finalUrl,
        params: finalParams,
        data: finalData,
        headers,
      });

      const endTime = performance.now();
      setPlaygroundResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers as any,
        data: res.data,
        duration: Math.round(endTime - startTime),
      });
    } catch (error: any) {
      const endTime = performance.now();
      setPlaygroundResponse({
        status: error.response?.status || 500,
        statusText: error.response?.statusText || "Error occurred",
        headers: error.response?.headers || {},
        data: error.response?.data || { message: error.message },
        duration: Math.round(endTime - startTime),
      });
    } finally {
      setLoading(false);
    }
  };

  const groupEndpoints = endpoints.filter((e) => e.group === selectedGroup);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="REST API Documentation"
        subtitle="Explore and test TaskFlow system endpoints interactively"
      />

      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-6 items-start w-full">
        {/* Left Side: API Group Selector & Endpoints */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-4">
          <div className="bg-[var(--bg-elevated)] p-4 rounded-3xl border border-[var(--border-subtle)] backdrop-blur-xl">
            <h2 className="text-xs font-semibold text-[var(--text-muted)] tracking-wider uppercase mb-3 px-1">
              API Groups
            </h2>
            <div className="space-y-1">
              {apiGroups.map((group) => {
                const isActive = selectedGroup === group;
                return (
                  <button
                    key={group}
                    onClick={() => {
                      setSelectedGroup(group);
                      const groupFirst = endpoints.find((e) => e.group === group);
                      if (groupFirst) setSelectedEndpoint(groupFirst);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[var(--bg-active)] text-[var(--text-primary)] font-semibold shadow-sm border border-[var(--border-glass)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span>{group}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-glass)] text-[var(--text-muted)] font-mono">
                      {endpoints.filter((e) => e.group === group).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--bg-elevated)] p-4 rounded-3xl border border-[var(--border-subtle)] backdrop-blur-xl">
            <h2 className="text-xs font-semibold text-[var(--text-muted)] tracking-wider uppercase mb-3 px-1">
              Endpoints
            </h2>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {groupEndpoints.map((ep) => {
                const isSelected = selectedEndpoint.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-blue-500/10 text-[var(--text-primary)] border-blue-500/30 shadow-md shadow-blue-500/5"
                        : "bg-transparent text-[var(--text-muted)] border-transparent hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    <div className="font-semibold text-xs text-[var(--text-primary)] truncate">
                      {ep.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px]">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold border leading-none ${getMethodBadge(
                          ep.method
                        )}`}
                      >
                        {ep.method}
                      </span>
                      <span className="truncate tracking-wide text-[var(--text-muted)]">
                        {ep.path}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Endpoint Console */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Header Card */}
          <div className="bg-[var(--bg-elevated)] p-6 rounded-3xl border border-[var(--border-subtle)] backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-3 py-1 text-xs font-bold border rounded-xl ${getMethodBadge(
                    selectedEndpoint.method
                  )}`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-semibold tracking-wide text-[var(--text-primary)]">
                  {selectedEndpoint.path}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedEndpoint.auth === "public" ? (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <Unlock size={11} />
                    <span>Public</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    <Lock size={11} />
                    <span>Requires JWT</span>
                  </div>
                )}
                {selectedEndpoint.roles && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                    <AlertTriangle size={11} />
                    <span>{selectedEndpoint.roles.join(", ")} Only</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                {selectedEndpoint.name}
              </h2>
              <p className="text-xs text-[var(--text-muted)] tracking-wide">
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Quick user role notice */}
            {selectedEndpoint.roles && user?.role !== "ADMIN" && (
              <div className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <span>
                  <strong>Note:</strong> Your current account role is{" "}
                  <strong>{user?.role || "USER"}</strong>. The playground request to this admin-only endpoint will likely return a 403 Forbidden.
                </span>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-subtle)] gap-4 pt-2">
              <button
                onClick={() => setActiveTab("docs")}
                className={`pb-2.5 text-xs font-semibold relative cursor-pointer ${
                  activeTab === "docs"
                    ? "text-blue-400"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                Documentation
                {activeTab === "docs" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("playground")}
                className={`pb-2.5 text-xs font-semibold relative flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "playground"
                    ? "text-blue-400"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <Terminal size={12} />
                <span>Interactive Playground</span>
                {activeTab === "playground" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />
                )}
              </button>
            </div>

            {/* TAB CONTENT: DOCUMENTATION */}
            {activeTab === "docs" && (
              <div className="space-y-6 pt-2 animate-fade-in">
                {/* Path Parameters */}
                {selectedEndpoint.pathParams && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Path Parameters
                    </h3>
                    <div className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-card)]">
                      <table className="w-full text-left text-xs divide-y divide-[var(--border-subtle)]">
                        <thead className="bg-[var(--bg-hover)] font-semibold text-[var(--text-secondary)]">
                          <tr>
                            <th className="p-3">Parameter</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Required</th>
                            <th className="p-3">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
                          {selectedEndpoint.pathParams.map((p) => (
                            <tr key={p.name} className="hover:bg-[var(--bg-hover)]">
                              <td className="p-3 font-mono text-blue-400 font-semibold">:{p.name}</td>
                              <td className="p-3 text-[11px] font-mono text-[var(--text-muted)]">{p.type}</td>
                              <td className="p-3">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  Yes
                                </span>
                              </td>
                              <td className="p-3 text-[11px] text-[var(--text-muted)]">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Query Parameters */}
                {selectedEndpoint.queryParams && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Query Parameters
                    </h3>
                    <div className="border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-card)]">
                      <table className="w-full text-left text-xs divide-y divide-[var(--border-subtle)]">
                        <thead className="bg-[var(--bg-hover)] font-semibold text-[var(--text-secondary)]">
                          <tr>
                            <th className="p-3">Parameter</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Required</th>
                            <th className="p-3">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
                          {selectedEndpoint.queryParams.map((q) => (
                            <tr key={q.name} className="hover:bg-[var(--bg-hover)]">
                              <td className="p-3 font-mono text-blue-400 font-semibold">{q.name}</td>
                              <td className="p-3 text-[11px] font-mono text-[var(--text-muted)]">{q.type}</td>
                              <td className="p-3 text-[11px] text-[var(--text-muted)]">
                                {q.required ? (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-500/10 text-[var(--text-muted)] border border-slate-500/10">
                                    No
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-[11px] text-[var(--text-muted)]">
                                {q.description}
                                {q.defaultValue && (
                                  <div className="text-[10px] text-amber-400/80 mt-0.5">
                                    Default: <code className="font-mono">{q.defaultValue}</code>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Request Body Specification */}
                {selectedEndpoint.bodyTemplate && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Request Body (JSON)
                    </h3>
                    <div className="relative group">
                      <button
                        onClick={() => handleCopy(selectedEndpoint.bodyTemplate || "", "bodyTemplate")}
                        className="absolute right-3 top-3 p-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-hover-strong)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all opacity-0 group-hover:opacity-100"
                        title="Copy schema template"
                      >
                        {copiedId === "bodyTemplate" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                      <pre
                        className="text-xs font-mono overflow-auto p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] max-h-72"
                        dangerouslySetInnerHTML={{
                          __html: syntaxHighlight(selectedEndpoint.bodyTemplate),
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Standard Success Response */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between">
                    <span>Example Success Response (200 / 201)</span>
                    <span className="text-[10px] text-emerald-400 lowercase font-medium bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-sans tracking-normal">
                      application/json
                    </span>
                  </h3>
                  <div className="relative group">
                    <button
                      onClick={() => handleCopy(selectedEndpoint.response200, "resp200")}
                      className="absolute right-3 top-3 p-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-hover-strong)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all opacity-0 group-hover:opacity-100"
                      title="Copy response body"
                    >
                      {copiedId === "resp200" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                    <pre
                      className="text-xs font-mono overflow-auto p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] max-h-80"
                      dangerouslySetInnerHTML={{
                        __html: syntaxHighlight(selectedEndpoint.response200),
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PLAYGROUND */}
            {activeTab === "playground" && (
              <div className="space-y-6 pt-2 animate-fade-in">
                {/* Authorization notice */}
                {selectedEndpoint.auth === "authenticated" && (
                  <div className="flex items-center justify-between gap-3 text-[11px] text-blue-400 bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-400" />
                      <span>
                        <strong>Session JWT Token</strong> will be attached automatically in the{" "}
                        <code className="font-mono bg-blue-500/10 px-1 rounded text-blue-300">Authorization</code> header.
                      </span>
                    </div>
                  </div>
                )}

                {/* Destructive Warning Badge */}
                {["PUT", "DELETE"].includes(selectedEndpoint.method) && (
                  <div className="flex items-center gap-2.5 text-[11px] text-amber-500 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                    <AlertTriangle size={15} className="flex-shrink-0" />
                    <span>
                      <strong>Warning:</strong> This playground runs against your live local database. Submitting this request will persist actual modifications.
                    </span>
                  </div>
                )}

                {/* Form Fields for Params */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Parameter Column: Path & Queries */}
                  <div className="space-y-4">
                    {/* Path Params Inputs */}
                    {selectedEndpoint.pathParams && selectedEndpoint.pathParams.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                          Path Params
                        </h4>
                        <div className="space-y-2 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-subtle)]">
                          {selectedEndpoint.pathParams.map((p) => (
                            <div key={p.name} className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-[var(--text-secondary)] font-mono">
                                :{p.name} <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={pathParamValues[p.name] || ""}
                                onChange={(e) =>
                                  setPathParamValues({
                                    ...pathParamValues,
                                    [p.name]: e.target.value,
                                  })
                                }
                                placeholder={`Enter ${p.name}`}
                                className="w-full text-xs p-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                              />
                              <span className="text-[10px] text-[var(--text-muted)]">
                                {p.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Query Params Inputs */}
                    {selectedEndpoint.queryParams && selectedEndpoint.queryParams.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                          Query Params
                        </h4>
                        <div className="space-y-2 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-subtle)] max-h-72 overflow-y-auto">
                          {selectedEndpoint.queryParams.map((q) => (
                            <div key={q.name} className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-[var(--text-secondary)]">
                                {q.name} {q.required && <span className="text-rose-500">*</span>}
                              </label>
                              <input
                                type="text"
                                value={queryParamValues[q.name] || ""}
                                onChange={(e) =>
                                  setQueryParamValues({
                                    ...queryParamValues,
                                    [q.name]: e.target.value,
                                  })
                                }
                                placeholder={q.defaultValue ? `${q.description} (default: ${q.defaultValue})` : q.description}
                                className="w-full text-xs p-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attachment Upload Input */}
                    {selectedEndpoint.id === "attachments-upload" && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                          Attachment File
                        </h4>
                        <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] flex flex-col items-center justify-center gap-3">
                          <FileUp size={24} className="text-blue-400" />
                          <label className="cursor-pointer text-xs font-semibold text-blue-400 hover:underline">
                            Choose File
                            <input
                              type="file"
                              onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                              className="hidden"
                            />
                          </label>
                          {attachmentFile && (
                            <span className="text-[11px] text-[var(--text-primary)] font-semibold truncate max-w-xs bg-[var(--bg-input)] px-2.5 py-1 rounded-xl border border-[var(--border-subtle)]">
                              {attachmentFile.name} ({(attachmentFile.size / 1024).toFixed(1)} KB)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Parameter Column: Body Editor */}
                  {selectedEndpoint.bodyTemplate && selectedEndpoint.id !== "attachments-upload" && (
                    <div className="space-y-2 flex flex-col h-full">
                      <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Request Body (JSON)
                      </h4>
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        placeholder="Enter JSON Body..."
                        rows={11}
                        className="w-full font-mono text-xs p-3.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 resize-none h-full"
                      />
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={executePlaygroundRequest}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer animate-pulse"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Send Request</span>
                      </>
                    )}
                  </button>
                </div>

                {/* PLAYGROUND RESPONSE OUTPUT PANEL */}
                {playgroundResponse && (
                  <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)] animate-slide-up">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-subtle)]">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[var(--text-secondary)]">Response Status:</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded border ${
                            playgroundResponse.status >= 200 && playgroundResponse.status < 300
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {playgroundResponse.status} {playgroundResponse.statusText}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-medium">
                        <Clock size={12} />
                        <span>{playgroundResponse.duration} ms</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">
                        Response Body
                      </h5>
                      <div className="relative group">
                        <button
                          onClick={() =>
                            handleCopy(
                              JSON.stringify(playgroundResponse.data, null, 2),
                              "playResp"
                            )
                          }
                          className="absolute right-3 top-3 p-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-hover-strong)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all opacity-0 group-hover:opacity-100"
                          title="Copy response body"
                        >
                          {copiedId === "playResp" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                        <pre
                          className="text-xs font-mono overflow-auto p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] max-h-96"
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(JSON.stringify(playgroundResponse.data, null, 2)),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
