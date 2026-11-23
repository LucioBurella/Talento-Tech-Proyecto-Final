import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Perfil() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <main className="main-container">
      <section className="card-aviso perfil-card">
        <h2>Mi Perfil</h2>
        <p>
          <strong>Nombre:</strong> {user?.displayName || "Usuario registrado"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Rol:</strong> {isAdmin ? "Administrador" : "Cliente"}
        </p>

        <div className="perfil-acciones">
          {isAdmin && (
            <Link to="/admin" className="btn-primario">
              Ir al Panel de Gestión
            </Link>
          )}
          <button onClick={logout} className="btn-peligro">
            Cerrar sesión
          </button>
        </div>
      </section>
    </main>
  );
}