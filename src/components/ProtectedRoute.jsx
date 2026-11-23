import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <main className="main-container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <span>Verificando sesión...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;