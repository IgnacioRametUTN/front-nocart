import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { ArticuloInsumo } from "../../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { BsTrashFill } from "react-icons/bs";
import { Categoria } from "../../../entities/DTO/Categoria/Categoria";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import { UnidadMedida } from "../../../entities/DTO/UnidadMedida/UnidadMedida";
import FiltroProductos from "../FiltroArticulo";
import GenericButton from "../../../components/generic/buttons/GenericButton";
import { FaSave } from "react-icons/fa";
import { useAuth0Extended } from "../../../Auth/Auth0ProviderWithNavigate";

interface AgregarInsumosProps {
  show: boolean;
  onHide: () => void;
  title: string;
  handleSave: (articulosInsumo: ArticuloInsumo[]) => void;
  articulosExistentes: ArticuloInsumo[];
  categorias: Categoria[];
  unidadesMedida: UnidadMedida[];
}
export const AgregarInsumosModal = ({
  show,
  onHide,
  title,
  handleSave,
  articulosExistentes,
  categorias,
  unidadesMedida,
}: AgregarInsumosProps) => {
  const [listaFiltrada, setListaFiltrada] = useState<ArticuloInsumo[]>([]);

  const [articulosAgregados, setArticulosAgregados] = useState<
    ArticuloInsumo[]
  >(articulosExistentes ? articulosExistentes : []);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>();
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] =
    useState<number>();
  const [searchedDenominacion, setSearchedDenominacion] = useState<string>();

  const { activeSucursal } = useAuth0Extended();

  const fetchDataArticulosInsumo = async (
    idCategoria?: number,
    idUnidadMedida?: number,
    denominacion?: string
  ) => {
    const articulos =
      await ArticuloInsumoService.obtenerArticulosInsumosFiltrados(
        activeSucursal,
        idCategoria,
        idUnidadMedida,
        denominacion
      );
    setListaFiltrada(articulos);
    setArticulosAgregados([...articulosAgregados]);
  };

  useEffect(() => {
    fetchDataArticulosInsumo();
  }, []);

  const handleClick = (articulo: ArticuloInsumo) => {
    if (articulosAgregados.find((selected) => selected.id === articulo.id)) {
      setArticulosAgregados(
        articulosAgregados.filter((art) => art.id !== articulo.id)
      );
    } else {
      setArticulosAgregados([...articulosAgregados, articulo]);
    }
  };

  const handleChangeCategoria = (id: number) => {
    setCategoriaSeleccionada(id > 0 ? id : undefined);
  };

  const handleChangeUnidadMedida = (id: number) => {
    setUnidadMedidaSeleccionada(id > 0 ? id : undefined);
  };

  const handleChangeText = (denominacion: string) => {
    setSearchedDenominacion(denominacion ? denominacion : undefined);
  };
  useEffect(() => {
    fetchDataArticulosInsumo(
      categoriaSeleccionada,
      unidadMedidaSeleccionada,
      searchedDenominacion
    );
  }, [categoriaSeleccionada, unidadMedidaSeleccionada, searchedDenominacion]);

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2></h2>

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
              <th>Unidad de Medida</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.map((articulo) => {
              const agregado = articulosAgregados.find(
                (selected) => selected.id === articulo.id
              );
              return (
                <tr key={articulo.id} className="text-center">
                  <td>{articulo.id}</td>
                  <td>{articulo.denominacion}</td>
                  <td>{articulo.unidadMedida?.denominacion}</td>
                  <td>{articulo.categoria?.denominacion}</td>
                  <td>
                    <GenericButton
                      color={agregado ? "#D32F2F" : "#50C878"}
                      size={20}
                      icon={agregado ? BsTrashFill : FaSave}
                      onClick={() => handleClick(articulo)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => handleSave(articulosAgregados)}
        >
          Guardar
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
