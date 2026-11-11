import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DemoLogin from "./pages/DemoLogin";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import PageLoader from "./components/PageLoader";

// Statistics pulls in the big chart library (recharts), so it is only downloaded
// when the user opens that page. This keeps the first page load small.
const Statistics = lazy(() => import("./pages/Statistics"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Logs in as the demo user and opens the dashboard (link for resumes) */}
      <Route path="/demo" element={<DemoLogin />} />
      {/* Pages below need a logged-in user and share the sidebar/navbar Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs/new" element={<AddJob />} />
        <Route path="/jobs/:id/edit" element={<EditJob />} />
        <Route
          path="/statistics"
          element={
            <Suspense fallback={<PageLoader />}>
              <Statistics />
            </Suspense>
          }
        />
        <Route path="/profile" element={<Profile />} />
        {/* Any other URL: the 404 page, shown inside the layout so the sidebar stays */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
