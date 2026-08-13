import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import TeamPage from "./pages/TeamPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/team" element={<TeamPage />} />

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
    </BrowserRouter>
  );
}

// Simple placeholder for unimplemented pages
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="text-5xl mb-4">🚧</div>
      <h1 className="text-xl font-semibold text-slate-300">{title}</h1>
      <p className="text-sm text-slate-500 mt-1">
        This feature is coming soon.
      </p>
    </div>
  );
}
