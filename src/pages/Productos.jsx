import { ItemListContainer } from "../components/ItemListContainer";

export function Productos() {
  return (
    <main className="main-container">
      <ItemListContainer soloOfertas={false} titulo="Todos los Productos" />
    </main>
  );
}