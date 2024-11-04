import { useEffect, useState } from "react";
import { ProductServices } from "../../../services/ProductServices";
import { Table } from "react-bootstrap";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { ArticuloManufacturado } from "../../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import { Categoria } from "../../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../../services/CategoriaService";
import { UnidadMedida } from "../../../entities/DTO/UnidadMedida/UnidadMedida";
import UnidadMedidaServices from "../../../services/UnidadMedidaServices";
import GenericButton from "../../../components/generic/buttons/GenericButton";
import FiltroProductos from "../FiltroArticulo";

import ProductModal from "./ProductModal";
import { FaSave } from "react-icons/fa";
import "./tableProdict.css";
import { useAuth0Extended } from "../../../Auth/Auth0ProviderWithNavigate";
import { ArticuloManufacturadoModal } from "./ArticuloManufacturadoModal";
import { useSnackbar } from "../../../hooks/SnackBarProvider";

export default function ProductTable() {
  //Producto seleccionado que se va a pasar como prop al modal
  const [product, setProduct] = useState<ArticuloManufacturado>(
    new ArticuloManufacturado()
  );
  const [articulosManufacturados, setArticulosManufacturados] = useState<
    ArticuloManufacturado[]
  >([]);

  //const para manejar el estado del modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>();
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] =
    useState<number>();
  const [searchedDenominacion, setSearchedDenominacion] = useState<string>();

  const [currentArtManufacturado, setCurrentArtManufacturado] =
    useState<ArticuloManufacturado>(new ArticuloManufacturado());

  const { activeSucursal } = useAuth0Extended();
  const {showError, showSuccess} = useSnackbar();

  //Logica del modal
  const handleClick = (id: number) => {
    if (id === 0) {
      setCurrentArtManufacturado(new ArticuloManufacturado());
    } else {
      setCurrentArtManufacturado(
        articulosManufacturados.filter((art) => id === art.id)[0]
      );
    }
    setShowModal(!showModal);
  };

  const handleClickEliminar = (
    newTitle: string,
    prod: ArticuloManufacturado
  ) => {
    setTitle(newTitle);
    setProduct(prod);
    setShowDeleteModal(true);
  };

  //Variable que muestra el componente Loader
  const [, setIsLoading] = useState(true);

  //El useEffect se ejecuta cada vez que se renderice el componente

  const fetchProducts = async (
    idCategoria?: number,
    idUnidadMedida?: number,
    denominacion?: string
  ) => {
    const productsFiltered = await ProductServices.getAllFiltered(
      activeSucursal,
      idCategoria,
      idUnidadMedida,
      denominacion
    );
    setArticulosManufacturados(productsFiltered);
    setIsLoading(false);
  };
  const fetchCategorias = async () => {
    const categorias = await CategoriaService.obtenerCategorias(activeSucursal);
    setCategorias(categorias);
  };

  useEffect(() => {
    fetchCategorias();
    fetchProducts();
  }, [activeSucursal]);

  useEffect(() => {
    const fetchUnidadadMedida = async () => {
      const unidadesMedida = await UnidadMedidaServices.getAll();
      setUnidadesMedida(unidadesMedida);
    };

    fetchUnidadadMedida();
  }, []);

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
    fetchProducts(
      categoriaSeleccionada,
      unidadMedidaSeleccionada,
      searchedDenominacion
    );
  }, [categoriaSeleccionada, unidadMedidaSeleccionada, searchedDenominacion]);

  const handleDelete = async (id: number) => {
    try {
      await ProductServices.delete(id);
      setShowDeleteModal(false);
      fetchProducts();
      showSuccess("Estado cambiado correctamente");
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  };

  const handleSubmit = async (
    newArticuloManufacturado: ArticuloManufacturado,
    files: File[]
  ) => {
    try {
      let response: ArticuloManufacturado;
      if (newArticuloManufacturado.id === 0) {
        // Crear un nuevo ArticuloManufacturado
        response = await ProductServices.create(
          {
            ...newArticuloManufacturado,
            imagenes: newArticuloManufacturado.imagenes.filter(
              (imagen) => !imagen.url.includes("blob")
            ),
          },
          activeSucursal
        );
      } else {
        // Actualizar el ArticuloManufacturado existente
        response = await ProductServices.update(newArticuloManufacturado.id, {
          ...newArticuloManufacturado,
          imagenes: newArticuloManufacturado.imagenes.filter(
            (imagen) => !imagen.url.includes("blob")
          ),
        });
      }
      if (response) {
        const imagenes = await ProductServices.uploadFiles(response.id, files);
        response.imagenes = imagenes;
      }
      setArticulosManufacturados((prev) => {
        // Si el artículo tiene un id, significa que es una actualización
        if (prev.some((art) => art.id === response.id)) {
          return prev.map((art) => (art.id === response.id ? response : art));
        } else {
          // Si no tiene id, es un nuevo artículo, lo añadimos a la lista
          return [...prev, response];
        }
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container">
      <GenericButton
        className="mt-4 mb-3"
        color="#4CAF50"
        size={25}
        icon={CiCirclePlus}
        text="Nuevo Producto"
        onClick={() => handleClick(0)}
      />

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
            <th>Tiempo de Cocina</th>
            <th>Precio Venta</th>
            <th>Categoria</th>

            <th>Estado</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {articulosManufacturados.map((product) => (
            <tr key={product.id} className={"text-center"}>
              <td className={product.alta ? "" : "bg-secondary"}>
                {product.id}
              </td>
              <td className={product.alta ? "" : "bg-secondary"}>
                {product.denominacion}
              </td>
              <td className={product.alta ? "" : "bg-secondary"}>
                {product.tiempoEstimadoMinutos} min
              </td>
              <td className={product.alta ? "" : "bg-secondary"}>
                $ {product.precioVenta}
              </td>
              <td className={product.alta ? "" : "bg-secondary"}>
                {product.categoria?.denominacion}
              </td>
              <td className={product.alta ? "" : "bg-secondary"}>
                {product.alta ? "Activo" : "Inactivo"}
              </td>
              <td className={product.alta ? "" : "bg-secondary"}>
                <GenericButton
                  color="#FBC02D"
                  size={23}
                  icon={BsFillPencilFill}
                  onClick={() => handleClick(product.id)}
                />
              </td>
              <td className={product.alta ? "" : "bg-secondary"}>
                <GenericButton
                  color={product.alta ? "#D32F2F" : "#50C878"}
                  size={23}
                  icon={product.alta ? BsTrashFill : FaSave}
                  onClick={() =>
                    handleClickEliminar("Alta/Baja Articulo", product)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showDeleteModal && (
        <ProductModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          title={title}
          handleDelete={handleDelete}
          product={product}
        />
      )}

      {showModal && (
        <ArticuloManufacturadoModal
          handleSubmit={handleSubmit}
          categorias={categorias}
          unidadesMedida={unidadesMedida}
          readOnly={true}
          articuloManufacturado={currentArtManufacturado}
          onHide={() => handleClick(1)}
        />
      )}
    </div>
  );
}
