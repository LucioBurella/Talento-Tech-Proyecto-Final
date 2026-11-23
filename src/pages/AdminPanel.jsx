import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Pencil, Trash2, PlusCircle, XCircle, Tag } from "lucide-react";
import { db } from "../firebase/config";

const FORM_INICIAL = {
  nombre: "",
  precio: "",
  stock: "",
  imagen: "",
  descripcion: "",
  oferta: false,
};

export function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [loadingProd, setLoadingProd] = useState(true);
  const [errorProd, setErrorProd] = useState("");
  const [formProd, setFormProd] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [formError, setFormError] = useState("");
  const [guardandoProd, setGuardandoProd] = useState(false);

  const [cupones, setCupones] = useState([]);
  const [loadingCupones, setLoadingCupones] = useState(true);
  const [codigoCupon, setCodigoCupon] = useState("");
  const [descuentoCupon, setDescuentoCupon] = useState("");
  const [cuponError, setCuponError] = useState("");
  const [guardandoCupon, setGuardandoCupon] = useState(false);

  const cargarProductos = async () => {
    setLoadingProd(true);
    setErrorProd("");
    try {
      const snap = await getDocs(collection(db, "productos"));
      setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setErrorProd("Error al obtener productos de Firestore.");
    } finally {
      setLoadingProd(false);
    }
  };

  const cargarCupones = async () => {
    setLoadingCupones(true);
    try {
      const snap = await getDocs(collection(db, "cupones"));
      setCupones(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setCuponError("Error al obtener cupones.");
    } finally {
      setLoadingCupones(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCupones();
  }, []);

  const validarProducto = () => {
    if (!formProd.nombre.trim()) return "El nombre del producto es obligatorio.";
    const precioNum = Number(formProd.precio);
    if (isNaN(precioNum) || precioNum <= 0) return "El precio debe ser mayor a 0.";
    const stockNum = Number(formProd.stock);
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      return "El stock debe ser un número entero mayor o igual a 0.";
    }
    if (!formProd.imagen.trim()) return "La URL o ruta de la imagen es obligatoria.";
    if (formProd.imagen.toLowerCase().includes("imgbb.com")) {
      return "No se permiten enlaces de imgbb.com. Usá otra URL web o una ruta local.";
    }
    return "";
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    const errValidacion = validarProducto();
    if (errValidacion) {
      setFormError(errValidacion);
      return;
    }

    setFormError("");
    setGuardandoProd(true);

    const payload = {
      nombre: formProd.nombre.trim(),
      precio: Number(formProd.precio),
      stock: Number(formProd.stock),
      imagen: formProd.imagen.trim(),
      descripcion: formProd.descripcion.trim(),
      oferta: Boolean(formProd.oferta),
    };

    try {
      if (editandoId) {
        await updateDoc(doc(db, "productos", editandoId), payload);
        setEditandoId(null);
      } else {
        await addDoc(collection(db, "productos"), payload);
      }
      setFormProd(FORM_INICIAL);
      await cargarProductos();
    } catch (err) {
      setFormError("No se pudo guardar el producto en Firestore.");
    } finally {
      setGuardandoProd(false);
    }
  };

  const handleEditarClick = (prod) => {
    setEditandoId(prod.id);
    setFormError("");
    setFormProd({
      nombre: prod.nombre || "",
      precio: prod.precio ?? "",
      stock: prod.stock ?? "",
      imagen: prod.imagen || "",
      descripcion: prod.descripcion || "",
      oferta: Boolean(prod.oferta),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setFormProd(FORM_INICIAL);
    setFormError("");
  };

  const handleEliminarProducto = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que querés eliminar "${nombre}"?`)) return;
    try {
      await deleteDoc(doc(db, "productos", id));
      if (editandoId === id) handleCancelarEdicion();
      await cargarProductos();
    } catch (err) {
      setErrorProd("Error al eliminar el producto.");
    }
  };

  const handleCrearCupon = async (e) => {
    e.preventDefault();
    setCuponError("");

    const codigoLimpio = codigoCupon.trim().toUpperCase();
    const descNum = Number(descuentoCupon);

    if (!codigoLimpio) {
      setCuponError("Ingresá un código para el cupón.");
      return;
    }
    if (isNaN(descNum) || descNum <= 0 || descNum > 100) {
      setCuponError("El descuento debe ser entre 1% y 100%.");
      return;
    }
    if (cupones.some((c) => c.codigo === codigoLimpio)) {
      setCuponError("Ya existe un cupón con ese código.");
      return;
    }

    setGuardandoCupon(true);
    try {
      await addDoc(collection(db, "cupones"), {
        codigo: codigoLimpio,
        descuento: descNum,
      });
      setCodigoCupon("");
      setDescuentoCupon("");
      await cargarCupones();
    } catch (err) {
      setCuponError("Error al crear el cupón.");
    } finally {
      setGuardandoCupon(false);
    }
  };

  const handleEliminarCupon = async (id) => {
    try {
      await deleteDoc(doc(db, "cupones", id));
      await cargarCupones();
    } catch (err) {
      setCuponError("Error al eliminar el cupón.");
    }
  };

  return (
    <main className="main-container">
      <h2 className="seccion-titulo">Panel de Administración</h2>

      <section className="admin-section">
        <h3>{editandoId ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>

        <form onSubmit={handleSubmitProducto} className="admin-form">
          <div className="form-row">
            <label>
              Nombre *
              <input
                type="text"
                placeholder="Ej: Auriculares Inalámbricos"
                value={formProd.nombre}
                onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })}
              />
            </label>

            <label>
              Precio ($) *
              <input
                type="number"
                step="0.01"
                placeholder="Ej: 45000"
                value={formProd.precio}
                onChange={(e) => setFormProd({ ...formProd, precio: e.target.value })}
              />
            </label>

            <label>
              Stock *
              <input
                type="number"
                placeholder="Ej: 15"
                value={formProd.stock}
                onChange={(e) => setFormProd({ ...formProd, stock: e.target.value })}
              />
            </label>
          </div>

          <div className="form-row">
            <label className="campo-amplio">
              URL de Imagen (sin imgbb.com) o ruta local *
              <input
                type="text"
                placeholder="https://... o ../../images/producto.jpeg"
                value={formProd.imagen}
                onChange={(e) => setFormProd({ ...formProd, imagen: e.target.value })}
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formProd.oferta}
                onChange={(e) => setFormProd({ ...formProd, oferta: e.target.checked })}
              />
              <span>Producto en Oferta (oferta: true)</span>
            </label>
          </div>

          <label>
            Descripción
            <input
              type="text"
              placeholder="Breve descripción del producto"
              value={formProd.descripcion}
              onChange={(e) => setFormProd({ ...formProd, descripcion: e.target.value })}
            />
          </label>

          {formError && <p className="mensaje-error">{formError}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primario" disabled={guardandoProd}>
              <PlusCircle size={16} />
              <span>
                {guardandoProd
                  ? "Guardando..."
                  : editandoId
                  ? "Guardar Cambios"
                  : "Crear Producto"}
              </span>
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={handleCancelarEdicion}
                className="btn-secundario"
              >
                <XCircle size={16} />
                <span>Cancelar Edición</span>
              </button>
            )}
          </div>
        </form>

        <h3>Listado de Productos ({productos.length})</h3>
        {loadingProd && <p className="estado-mensaje">Cargando listado...</p>}
        {errorProd && <p className="mensaje-error">{errorProd}</p>}

        {!loadingProd && productos.length === 0 && (
          <p className="estado-mensaje">No hay productos registrados.</p>
        )}

        {!loadingProd && productos.length > 0 && (
          <div className="admin-lista">
            {productos.map((prod) => (
              <div key={prod.id} className="admin-item">
                <img
                  src={prod.imagen || "https://placehold.co/80x80?text=Img"}
                  alt={prod.nombre}
                />
                <div className="admin-item-info">
                  <strong>{prod.nombre}</strong>
                  <span>
                    ${Number(prod.precio).toLocaleString("es-AR")} | Stock: {prod.stock} |{" "}
                    {prod.oferta ? "En Oferta" : "Precio regular"}
                  </span>
                </div>
                <div className="admin-item-acciones">
                  <button
                    onClick={() => handleEditarClick(prod)}
                    className="btn-secundario"
                  >
                    <Pencil size={15} />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleEliminarProducto(prod.id, prod.nombre)}
                    className="btn-peligro"
                  >
                    <Trash2 size={15} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <h3>
          <Tag size={18} /> Gestión de Cupones
        </h3>

        <form onSubmit={handleCrearCupon} className="admin-form">
          <div className="form-row">
            <label>
              Código del cupón
              <input
                type="text"
                placeholder="Ej: PROMO20"
                value={codigoCupon}
                onChange={(e) => setCodigoCupon(e.target.value)}
              />
            </label>

            <label>
              Descuento (%)
              <input
                type="number"
                placeholder="Ej: 20"
                value={descuentoCupon}
                onChange={(e) => setDescuentoCupon(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="btn-primario btn-alinear-form"
              disabled={guardandoCupon}
            >
              {guardandoCupon ? "Creando..." : "Crear Cupón"}
            </button>
          </div>
          {cuponError && <p className="mensaje-error">{cuponError}</p>}
        </form>

        {loadingCupones ? (
          <p className="estado-mensaje">Cargando cupones...</p>
        ) : cupones.length === 0 ? (
          <p className="estado-mensaje">No hay cupones activos.</p>
        ) : (
          <div className="cupones-lista">
            {cupones.map((c) => (
              <div key={c.id} className="cupon-chip">
                <span>
                  <strong>{c.codigo}</strong> — {c.descuento}% OFF
                </span>
                <button
                  onClick={() => handleEliminarCupon(c.id)}
                  className="btn-peligro"
                  title="Eliminar cupón"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}