import { CiCirclePlus } from "react-icons/ci";
import ArticuloInsumoTable from "./ArticuloInsumoTable";
import { ModalType } from "../../../components/enums/ModalType";
import Button from "../../../components/generic/buttons/GenericButton";
import { useEffect, useState } from "react";
import { Categoria } from "../../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../../entities/DTO/UnidadMedida/UnidadMedida";
import { ArticuloInsumo } from "../../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { CategoriaService } from "../../../services/CategoriaService";
import UnidadMedidaService from "../../../services/UnidadMedidaServices";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import ArticuloInsumoModal from "./ArticuloInsumoModal";
import { useAuth0Extended } from "../../../Auth/Auth0ProviderWithNavigate";

export default function ArticuloInsumoPage() {
  //Estados
  const [showModalCrear, setShowModalCrear] = useState<boolean>(false);
  const { activeSucursal } = useAuth0Extended();

  //Estados Listas Entidades
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [articulosInsumo, setArticuloInsumo] = useState<ArticuloInsumo[]>([]);

  //Estados de Selección
  const [categoria, setCategoria] = useState<number>();
  const [unidadMedida, setUnidadMedida] = useState<number>();
  const [searchedDenominacion, setSearchedDenominacion] = useState<string>();

  // Estado para manejar los archivos
  // const [, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const categorias = await CategoriaService.obtenerCategorias(
        activeSucursal
      );
      setCategorias(categorias);
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchUnidadadMedida = async () => {
      const unidadesMedida = await UnidadMedidaService.getAll();
      setUnidadesMedida(unidadesMedida);
    };

    fetchUnidadadMedida();
  }, []);

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
    setArticuloInsumo(articulos);
  };

  useEffect(() => {
    fetchDataArticulosInsumo();
  }, []);

  useEffect(() => {
    fetchDataArticulosInsumo(categoria, unidadMedida, searchedDenominacion);
  }, [categoria, unidadMedida, searchedDenominacion]);

  const handleSaveUpdate = async (art: ArticuloInsumo, files: File[]) => {
    console.log(art.categoria);
   
    try {
      
      let response: ArticuloInsumo;
      console.log(art.categoria);
      art.categoria.subCategorias=[]

      if (art.id === 0) {
        
        // Artículo nuevo
        response = await ArticuloInsumoService.crearArticuloInsumo(
          {
            ...art,
            imagenes: art.imagenes.filter(
              (imagen) => !imagen.url.includes("blob")
              
            ),
          },
          activeSucursal
        );
      } else {
        // Actualizar artículo
        response = await ArticuloInsumoService.actualizarArticuloInsumo(
          art.id,
          {
            ...art,
            imagenes: art.imagenes.filter(
              (imagen) => !imagen.url.includes("blob")
            ),
          }
        );
      }

      if (response) {
        setArticuloInsumo((prevArticulos) => [
          ...prevArticulos.filter((a) => a.id !== art.id),
          response,
        ]);
        fetchDataArticulosInsumo();
      }
      // Si el artículo se creó o actualizó correctamente, proceder a subir los archivos
      if (response.id) {
        await ArticuloInsumoService.uploadFiles(response.id, files);
        fetchDataArticulosInsumo();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (artId: number) => {
    try {
      const response = await ArticuloInsumoService.eliminarArticuloInsumoById(
        artId
      );

      if (response) {
        setArticuloInsumo((prevArticulos) =>
          prevArticulos.filter((a) => a.id !== artId)
        ); // Filtra el articulo eliminado
        fetchDataArticulosInsumo(); // Llama a fetchDataArticulosInsumo después de actualizar el estado
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const handleChangeCategoria = (id: number) => {
    setCategoria(id > 0 ? id : undefined);
  };

  const handleChangeUnidadMedida = (id: number) => {
    setUnidadMedida(id > 0 ? id : undefined);
  };

  const handleChangeText = (denominacion: string) => {
    setSearchedDenominacion(denominacion ? denominacion : undefined);
  };

  return (
    <>
      <Button
        className="mt-4 mb-3"
        color="#4CAF50"
        size={25}
        icon={CiCirclePlus}
        text="Nuevo Ingrediente"
        onClick={() => setShowModalCrear(true)}
      />

      <ArticuloInsumoTable
        categorias={categorias}
        unidadesMedida={unidadesMedida}
        articulosInsumo={articulosInsumo}
        handleSubmit={handleSaveUpdate}
        handleDelete={handleDelete}
        // onFileChange={handleFileChange}
        handleChangeCategoria={handleChangeCategoria}
        handleChangeUnidadMedida={handleChangeUnidadMedida}
        handleChangeText={handleChangeText}
      />

      {showModalCrear && (
        <ArticuloInsumoModal
          onHide={() => setShowModalCrear(false)}
          articulo={undefined}
          modalType={ModalType.CREATE}
          titulo="Crear Articulo Insumo"
          handleSubmit={handleSaveUpdate}
          handleDelete={handleDelete}
          unidadesMedida={unidadesMedida}
          categorias={categorias}
          // onFileChange={handleFileChange} // Pasar el manejador de archivos
        />
      )}
    </>
  );
}
