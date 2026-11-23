import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export function Nosotros() {
  const [equipo, setEquipo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const fetchEquipo = async () => {
      setLoading(true);
      setError("");
      try {
        const snapshot = await getDocs(collection(db, "equipo"));
        if (!activo) return;

        const miembros = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEquipo(miembros);
      } catch (err) {
        if (!activo) return;
        setError("No se pudo cargar la información del equipo.");
      } finally {
        if (activo) setLoading(false);
      }
    };

    fetchEquipo();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <main className="main-container">
      <section className="seccion-nosotros">
        <h2 className="seccion-titulo">Nuestro Equipo</h2>
        <p className="subtitulo-seccion">
          Conocé a las personas detrás del proyecto y la gestión de la tienda.
        </p>

        {loading && (
          <div className="spinner-container">
            <div className="spinner" /> Cargando equipo...
          </div>
        )}

        {error && <p className="mensaje-error">{error}</p>}

        {!loading && !error && equipo.length === 0 && (
          <p className="estado-mensaje">
            Aún no hay miembros cargados en la colección <strong>equipo</strong> de Firestore.
          </p>
        )}

        {!loading && !error && equipo.length > 0 && (
          <div className="equipo-grid">
            {equipo.map((miembro) => (
              <article key={miembro.id} className="equipo-card">
                <img
                  src={miembro.foto || "https://placehold.co/200x200?text=Equipo"}
                  alt={miembro.nombre}
                  className="equipo-avatar"
                />
                <h3>{miembro.nombre}</h3>
                <p className="equipo-rol">{miembro.rol || "Integrante"}</p>
                {miembro.bio && <p className="equipo-bio">{miembro.bio}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}