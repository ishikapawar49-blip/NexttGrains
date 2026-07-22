import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {

  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("adminUser"));

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "admin") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;