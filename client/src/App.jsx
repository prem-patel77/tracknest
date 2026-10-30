import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Pages below need a logged-in user */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/jobs/new" element={<ProtectedRoute><AddJob /></ProtectedRoute>} />
      <Route path="/jobs/:id/edit" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<h1>404 - Page not found</h1>} />
    </Routes>
  );
}

export default App;