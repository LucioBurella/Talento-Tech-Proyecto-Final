import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { totalUnidades } = useCarrito();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          TechStore
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>

          {isAdmin && (
            <NavLink to="/admin" className="nav-admin">
              <ShieldCheck size={16} /> Gestión
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          <Link to="/carrito" className="btn-carrito">
            <ShoppingCart size={18} />
            <span>Carrito ({totalUnidades})</span>
          </Link>

          {user ? (
            <>
              <Link to="/perfil" className="btn-perfil">
                <User size={16} />
                <span>{user.displayName || user.email}</span>
              </Link>
              <button onClick={handleLogout} className="btn-secundario" title="Cerrar sesión">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primario">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}