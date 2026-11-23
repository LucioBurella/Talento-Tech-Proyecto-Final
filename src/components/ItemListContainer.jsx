import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { ItemCard } from "./ItemCard";

export function ItemListContainer({ soloOfertas = false, titulo }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const fetchProductos = async () => {
      setLoading(true);
      setError("");
      try {
        const productosRef = collection(db, "productos");
        const consulta = soloOfertas
          ? query(productosRef, where("oferta", "==", true))
          : productosRef;

        const snapshot = await getDocs(consulta);
        if (!activo) return;

        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(lista);
      } catch (err) {
        if (!activo) return;
        setError("No se pudieron cargar los productos. Verificá tu conexión o permisos de Firestore.");
      } finally {
        if (activo) setLoading(false);
      }
    };

    fetchProductos();
    return () => {
      activo = false;
    };
  }, [soloOfertas]);

  return (
    <section className="seccion-catalogo">
      {titulo && <h2 className="seccion-titulo">{titulo}</h2>}

      {loading && <div className="spinner-container"><div className="spinner" /> Cargando productos...</div>}

      {error && <p className="mensaje-error">{error}</p>}

      {!loading && !error && productos.length === 0 && (
        <p className="estado-mensaje">
          {soloOfertas
            ? "No hay productos en oferta en este momento."
            : "Todavía no hay productos cargados en el catálogo."}
        </p>
      )}

      {!loading && !error && productos.length > 0 && (
        <div className="productos-grid">
          {productos.map((prod) => (
            <ItemCard key={prod.id} producto={prod} />
          ))}
        </div>
      )}
    </section>
  );
}