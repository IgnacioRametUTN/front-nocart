import { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "../../../components/generic/buttons/GenericButton";
import { ModalType } from "../../../components/enums/ModalType";
import ArticuloInsumoModal from "./ArticuloInsumoModal";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { ArticuloInsumo } from "../../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { FaSave } from "react-icons/fa";
import FiltroProductos from "../FiltroArticulo";
import { Categoria } from "../../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../../entities/DTO/UnidadMedida/UnidadMedida";

interface TableProps {
  categorias: Categoria[];
  unidadesMedida: UnidadMedida[];
  articulosInsumo: ArticuloInsumo[];
  handleSubmit: (art: ArticuloInsumo, files: File[]) => Promise<void>;
  handleDelete: (idArt: number) => Promise<void>;
  onFileChange?: (newFiles: File[]) => void;
  handleChangeCategoria: (categoria: number) => void;
  handleChangeUnidadMedida: (unidadMedida: number) => void;
  handleChangeText: (denominacion: string) => void;
}

const ArticuloInsumoTable = ({
  categorias,
  unidadesMedida,
  articulosInsumo,
  handleSubmit,
  handleDelete,
  handleChangeCategoria,
  handleChangeText,
  handleChangeUnidadMedida,
}: TableProps) => {
  //Entidades de la Tabla
  const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>();

  //Estados de Selección

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [titulo, setTitulo] = useState("");

  const handleClick = (
    titulo: string,
    art: ArticuloInsumo,
    modal: ModalType
  ) => {
    setTitulo(titulo);
    setModalType(modal);
    setArticuloInsumo(art);
    setShowModal(true);
  };

  return (
    <div className="container">
      <FiltroProductos
        categorias={categorias}
        unidadesMedida={unidadesMedida}
        handleChangeText={handleChangeText}
        handleChangeCategoria={handleChangeCategoria}
        handleChangeUnidadMedida={handleChangeUnidadMedida}
      />
      <Table hover>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Unidad de Medida</th>
            <th>Stock Actual / Stock Maximo</th>
            <th>Costo</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {articulosInsumo.map((articulo) => (
            <tr key={articulo.id} className="text-center ">
              <td className={articulo.alta ? "" : "bg-secondary"}>
                {articulo.id}
              </td>
              <td className={articulo.alta ? "" : "bg-secondary"}>
                {articulo.denominacion}
              </td>
              <td className={articulo.alta ? "" : "bg-secondary"}>
                {articulo.categoria?.denominacion}
              </td>
              <td className={articulo.alta ? "" : "bg-secondary"}>
                {articulo.unidadMedida?.denominacion}
              </td>
              <td
                className={articulo.alta ? "" : "bg-secondary"}
              >{`${articulo.stockActual.toFixed(2)} / ${
                articulo.stockMaximo
              }`}</td>
              <td className={articulo.alta ? "" : "bg-secondary"}>
                {" "}
                {articulo.precioCompra}
              </td>
              <td className={articulo.alta ? "" : "bg-secondary"}>
                <Button
                  color="#FBC02D"
                  size={23}
                  icon={BsFillPencilFill}
                  onClick={() =>
                    handleClick("Editar Articulo", articulo, ModalType.UPDATE)
                  }
                />
              </td>
              <td className={articulo.alta ? "" : "bg-secondary"}>
                <Button
                  color={articulo.alta ? "#D32F2F" : "#50C878"}
                  size={23}
                  icon={articulo.alta ? BsTrashFill : FaSave}
                  onClick={() =>
                    handleClick(
                      "Alta/Baja Articulo",
                      articulo,
                      ModalType.DELETE
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showModal && (
        <ArticuloInsumoModal
          onHide={() => setShowModal(false)}
          articulo={articuloInsumo}
          modalType={modalType}
          titulo={titulo}
          handleSubmit={handleSubmit}
          unidadesMedida={unidadesMedida}
          categorias={categorias}
          handleDelete={handleDelete}
          // onFileChange={onFileChange}
        />
      )}
    </div>
  );
};

export default ArticuloInsumoTable;
