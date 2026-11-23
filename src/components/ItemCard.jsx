import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";

export function ItemCard({ producto }) {
  const { agregarItem } = useCarrito();
  const [agregado, setAgregado] = useState(false);

  const sinStock = Number(producto.stock) <= 0;

  const handleAgregar = () => {
    const res = agregarItem(producto, 1);
    if (res.ok) {
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1200);
    }
  };

  return (
    <article className="item-card">
      {producto.oferta && <span className="badge-oferta">OFERTA</span>}

      <div className="item-img-wrapper">
        <img
          src={producto.imagen || "https://placehold.co/300x200?text=Sin+Imagen"}
          alt={producto.nombre}
          loading="lazy"
        />
      </div>

      <div className="item-body">
        <h3>{producto.nombre}</h3>
        {producto.descripcion && <p className="item-desc">{producto.descripcion}</p>}
        <p className="item-precio">${Number(producto.precio).toLocaleString("es-AR")}</p>
        <p className="item-stock">
          {sinStock ? "Sin stock disponible" : `Stock: ${producto.stock} u.`}
        </p>

        <button
          onClick={handleAgregar}
          disabled={sinStock}
          className="btn-primario btn-full"
        >
          <ShoppingCart size={16} />
          <span>{sinStock ? "Agotado" : agregado ? "¡Agregado!" : "Agregar al carrito"}</span>
        </button>
      </div>
    </article>
  );
}