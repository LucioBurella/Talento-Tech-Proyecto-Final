import { createContext, useContext, useMemo, useState } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cuponAplicado, setCuponAplicado] = useState(null); // ej: { codigo: "DESC10", descuento: 10 }

  const agregarItem = (producto, cantidad = 1) => {
    const stockDisponible = Number(producto.stock ?? 0);
    if (stockDisponible <= 0) return { ok: false, msg: "Producto sin stock" };

    setItems((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        const nuevaCantidad = Math.min(existente.cantidad + cantidad, stockDisponible);
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: nuevaCantidad } : item
        );
      }
      const cantidadInicial = Math.min(cantidad, stockDisponible);
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          stock: stockDisponible,
          imagen: producto.imagen || "",
          cantidad: cantidadInicial,
        },
      ];
    });

    return { ok: true };
  };

  const eliminarItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setItems([]);
    setCuponAplicado(null);
  };

  const totalUnidades = useMemo(
    () => items.reduce((acc, item) => acc + item.cantidad, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [items]
  );

  const montoDescuento = useMemo(() => {
    if (!cuponAplicado) return 0;
    const porcentaje = Number(cuponAplicado.descuento || 0);
    return (subtotal * porcentaje) / 100;
  }, [subtotal, cuponAplicado]);

  const totalFinal = Math.max(0, subtotal - montoDescuento);

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarItem,
        eliminarItem,
        vaciarCarrito,
        totalUnidades,
        subtotal,
        cuponAplicado,
        setCuponAplicado,
        montoDescuento,
        totalFinal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}