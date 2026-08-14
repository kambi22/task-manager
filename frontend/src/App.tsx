import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import TeamPage from "./pages/TeamPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected app routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for sidebar nav items */}
            <Route
              path="/projects"
              element={<ComingSoon title="Projects" />}
            />
            <Route
              path="/calendar"
              element={<ComingSoon title="Calendar" />}
            />
            <Route
              path="/analytics"
              element={<ComingSoon title="Analytics" />}
            />
            <Route
              path="/settings"
              element={<ComingSoon title="Settings" />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Simple placeholder for unimplemented pages
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="text-5xl mb-4">🚧</div>
      <h1 className="text-xl font-semibold text-[var(--text-secondary)]">{title}</h1>
      <p className="text-sm text-[var(--text-muted)] mt-1">
        This feature is coming soon.
      </p>
    </div>
  );
}
