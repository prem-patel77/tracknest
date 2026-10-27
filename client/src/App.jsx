import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs/new" element={<AddJob />} />
      <Route path="/jobs/:id/edit" element={<EditJob />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<h1>404 - Page not found</h1>} />
    </Routes>
  );
}

export default App;