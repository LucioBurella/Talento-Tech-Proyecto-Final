import { Link } from "react-router-dom";
import { ItemListContainer } from "../components/ItemListContainer";

export function Inicio() {
  return (
    <main className="main-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Equipate al mejor precio</h1>
          <p>
            Descubrí nuestras ofertas destacadas y administrá el catálogo completo con
            sincronización en tiempo real en Firestore.
          </p>
          <Link to="/productos" className="btn-primario">
            Ver todos los productos
          </Link>
        </div>
      </section>

      <ItemListContainer soloOfertas={true} titulo="Productos en Oferta" />
    </main>
  );
}