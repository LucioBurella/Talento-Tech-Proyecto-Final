import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!email.trim() || !password.trim()) {
      setAuthError("Completá correo y contraseña.");
      return;
    }

    setSubmitting(true);
    const res = await login(email.trim(), password);
    setSubmitting(false);

    if (res.ok) {
      navigate("/");
    }
  };

  return (
    <main className="main-container auth-wrapper">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Iniciar Sesión</h2>

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
          Contraseña
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
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="auth-switch">
          ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
        </p>
      </form>
    </main>
  );
}