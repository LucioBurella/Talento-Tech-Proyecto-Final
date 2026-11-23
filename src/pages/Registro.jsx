import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Registro() {
  const { register, authError, setAuthError } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (password.length < 6) {
      setAuthError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setSubmitting(true);
    const res = await register(email.trim(), password, nombre);
    setSubmitting(false);

    if (res.ok) {
      navigate("/");
    }
  };

  return (
    <main className="main-container auth-wrapper">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Crear Cuenta</h2>

        <label>
          Nombre
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Contraseña (mín. 6 caracteres)
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {authError && <p className="mensaje-error">{authError}</p>}

        <button type="submit" className="btn-primario btn-full" disabled={submitting}>
          {submitting ? "Creando cuenta..." : "Registrarme"}
        </button>

        <p className="auth-switch">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </main>
  );
}