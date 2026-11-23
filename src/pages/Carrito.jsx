import { useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Trash2, Tag, CheckCircle } from "lucide-react";
import { db } from "../firebase/config";
import { useCarrito } from "../context/CarritoContext";

export function Carrito() {
  const {
    items,
    eliminarItem,
    vaciarCarrito,
    subtotal,
    cuponAplicado,
    setCuponAplicado,
    montoDescuento,
    totalFinal,
  } = useCarrito();

  const [codigoInput, setCodigoInput] = useState("");
  const [cuponMsg, setCuponMsg] = useState({ tipo: "", texto: "" });
  const [validandoCupon, setValidandoCupon] = useState(false);
  const [compraFinalizada, setCompraFinalizada] = useState(false);

  const handleAplicarCupon = async (e) => {
    e.preventDefault();
    const limpio = codigoInput.trim().toUpperCase();
    if (!limpio) {
      setCuponMsg({ tipo: "error", texto: "Ingresá un código de cupón." });
      return;
    }

    setValidandoCupon(true);
    setCuponMsg({ tipo: "", texto: "" });

    try {
      const q = query(collection(db, "cupones"), where("codigo", "==", limpio));
      const snap = await getDocs(q);

      if (snap.empty) {
        setCuponAplicado(null);
        setCuponMsg({ tipo: "error", texto: "El cupón ingresado no existe." });
        return;
      }

      const docCupon = snap.docs[0].data();
      const descuentoNum = Number(docCupon.descuento);

      if (!descuentoNum || descuentoNum <= 0 || descuentoNum > 100) {
        setCuponMsg({ tipo: "error", texto: "El cupón tiene un porcentaje inválido." });
        return;
      }

      setCuponAplicado({
        id: snap.docs[0].id,
        codigo: docCupon.codigo,
        descuento: descuentoNum,
      });
      setCuponMsg({
        tipo: "ok",
        texto: `Cupón ${docCupon.codigo} aplicado (${descuentoNum}% OFF).`,
      });
      setCodigoInput("");
    } catch (err) {
      setCuponMsg({ tipo: "error", texto: "Error al consultar el cupón en Firestore." });
    } finally {
      setValidandoCupon(false);
    }
  };

  const handleFinalizarCompra = () => {
    vaciarCarrito();
    setCuponMsg({ tipo: "", texto: "" });
    setCompraFinalizada(true);
  };

  if (compraFinalizada) {
    return (
      <main className="main-container">
        <div className="card-aviso">
          <CheckCircle size={40} />
          <h2>¡Compra registrada con éxito!</h2>
          <p>Gracias por probar el flujo de compra del carrito.</p>
          <Link to="/productos" className="btn-primario">
            Seguir explorando productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main-container">
      <h2 className="seccion-titulo">Tu Carrito de Compras</h2>

      {items.length === 0 ? (
        <div className="card-aviso">
          <p>Tu carrito está vacío.</p>
          <Link to="/productos" className="btn-primario">
            Ir a Productos
          </Link>
        </div>
      ) : (
        <div className="carrito-layout">
          <div className="carrito-items">
            {items.map((item) => (
              <div key={item.id} className="carrito-item">
                <img
                  src={item.imagen || "https://placehold.co/100x100?text=Prod"}
                  alt={item.nombre}
                />
                <div className="carrito-item-info">
                  <h3>{item.nombre}</h3>
                  <p>
                    Precio unitario: ${item.precio.toLocaleString("es-AR")} | Cantidad:{" "}
                    <strong>{item.cantidad}</strong>
                  </p>
                  <p className="carrito-item-subtotal">
                    Subtotal: ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                  </p>
                </div>
                <button
                  onClick={() => eliminarItem(item.id)}
                  className="btn-peligro"
                  aria-label={`Eliminar ${item.nombre}`}
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            ))}
          </div>

          <aside className="carrito-resumen">
            <h3>Resumen del pedido</h3>

            <form onSubmit={handleAplicarCupon} className="cupon-form">
              <label htmlFor="cupon-input">
                <Tag size={15} /> Código de cupón
              </label>
              <div className="cupon-row">
                <input
                  id="cupon-input"
                  type="text"
                  placeholder="Ej: DESCUENTO10"
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value)}
                />
                <button type="submit" className="btn-secundario" disabled={validandoCupon}>
                  {validandoCupon ? "..." : "Aplicar"}
                </button>
              </div>
              {cuponMsg.texto && (
                <p className={cuponMsg.tipo === "error" ? "mensaje-error" : "mensaje-ok"}>
                  {cuponMsg.texto}
                </p>
              )}
              {cuponAplicado && (
                <button
                  type="button"
                  onClick={() => setCuponAplicado(null)}
                  className="btn-link"
                >
                  Quitar cupón ({cuponAplicado.codigo})
                </button>
              )}
            </form>

            <div className="resumen-lineas">
              <div>
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString("es-AR")}</span>
              </div>
              {cuponAplicado && (
                <div className="descuento-linea">
                  <span>Descuento ({cuponAplicado.descuento}%)</span>
                  <span>-${montoDescuento.toLocaleString("es-AR")}</span>
                </div>
              )}
              <div className="total-linea">
                <strong>Total</strong>
                <strong>${totalFinal.toLocaleString("es-AR")}</strong>
              </div>
            </div>

            <div className="carrito-acciones">
              <button onClick={handleFinalizarCompra} className="btn-primario btn-full">
                Confirmar compra
              </button>
              <button onClick={vaciarCarrito} className="btn-secundario btn-full">
                Vaciar carrito
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}