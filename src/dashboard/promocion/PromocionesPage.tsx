import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { BsTrashFill, BsPencilSquare } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { Promocion } from "../../entities/DTO/Promocion/Promocion";
import PromocionService from "../../services/PromocionService";
import CustomButton from "../../components/generic/buttons/GenericButton";
import GenericButton from "../../components/generic/buttons/GenericButton";
import { FaSave } from "react-icons/fa";

import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import { PromocionFormModal } from "./PromocionFormModal";
import DeleteModalPromocion from "./DeleteModalPromocion";
import { useSnackbar } from "../../hooks/SnackBarProvider";

export default function PromotionTable() {
  const [currentPromocion, setCurrentPromocion] = useState<Promocion>(
    new Promocion()
  );
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [title, setTitle] = useState("");
  const {showError, showSuccess} = useSnackbar();

  const { activeSucursal } = useAuth0Extended();

  //Logica del modal
  const handleClick = (id: number) => {
    if (id === 0) {
      setCurrentPromocion(new Promocion());
    } else {
      setCurrentPromocion(promociones.filter((promos) => id === promos.id)[0]);
    }
    setShowFormModal(!showFormModal);
  };

  const handleClickEliminar = (newTitle: string, promo: Promocion) => {
    setTitle(newTitle);
    setShowDeleteModal(true);
    setCurrentPromocion(promo);
  };

  const handleEliminar = async (id: number) => {
    try {
      await PromocionService.delete(Number(activeSucursal), id);
      setShowDeleteModal(false);
      fetchPromotions();
      showSuccess("Promocion eliminada con exito");
    } catch (error) {
      if(error instanceof Error) {
        showError(error.message);
      }
    }
  };

  const fetchPromotions = async () => {
    const promotionsFiltered = await PromocionService.getAllBySucursal(
      Number(activeSucursal)
    );
    setPromociones(promotionsFiltered);
  };

  useEffect(() => {
    fetchPromotions();
  }, [activeSucursal]);

  const handleSubmit = async (

    promocion: Promocion,
    files: File[]

  
  ): Promise<void> => {
    try {
      

      let response: Promocion;
      console.log(promocion.sucursales)
      promocion.detallesPromocion.forEach(detalle => {
        detalle.articulo.categoria.subCategorias=[]

      
      });
     
     

      if (promocion.id !== 0) {
        response = await PromocionService.update(promocion.id, {
          ...promocion,
          imagenes: promocion.imagenes.filter(
            (imagen) => !imagen.url.includes("blob")
          ),
        });
      } else {
        response = await PromocionService.create(activeSucursal, {
          ...promocion,
          imagenes: promocion.imagenes.filter(
            (imagen) => !imagen.url.includes("blob")
          ),
        });
      }
      if (response && files.length > 0) {
        const responseImagenes = await PromocionService.uploadFiles(
          response.id,
          files
        );
        if (responseImagenes) {
          response.imagenes = responseImagenes;
        }
      }

      setPromociones((prev) => {
        // Si el artículo tiene un id, significa que es una actualización
        if (prev.some((art) => art.id === response.id)) {
          return prev.map((art) => (art.id === response.id ? response : art));
        } else {
          // Si no tiene id, es un nuevo artículo, lo añadimos a la lista
          return [...prev, response];
        }
      });
      fetchPromotions();
    } catch (error) {
      throw error;
    }
  };
  return (
    <div className="container">
      <CustomButton
        className="mt-4 mb-3"
        color="#4CAF50"
        size={25}
        icon={CiCirclePlus}
        text="Nueva Promoción"
        onClick={() => handleClick(0)}
      />
      <Table hover>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Denominación</th>
            <th>Fecha Desde</th>
            <th>Fecha Hasta</th>
            <th>Hora Desde</th>
            <th>Hora Hasta</th>
            <th>Tipo Promocion</th>
            <th>Precio Promocional</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {promociones.map((promotion) => (
            <tr
              key={promotion.id}
              className="text-center"
              style={{
                backgroundColor: !promotion.alta ? "#d3d3d3" : "inherit",
              }}
            >
              <td>{promotion.id}</td>
              <td>{promotion.denominacion}</td>
              <td>{new Date(promotion.fechaDesde).toLocaleDateString()}</td>
              <td>{new Date(promotion.fechaHasta).toLocaleDateString()}</td>
              <td>{promotion.horaDesde}</td>
              <td>{promotion.horaHasta}</td>
              <td>{promotion.tipoPromocion}</td>
              <td>${promotion.precioPromocional.toFixed(2)}</td>
              <td>
                <GenericButton
                  color="#007bff"
                  size={23}
                  icon={BsPencilSquare}
                  onClick={() => handleClick(promotion.id)}
                />
              </td>
              <td>
                <GenericButton
                  color={promotion.alta ? "#D32F2F" : "#50C878"}
                  size={23}
                  icon={promotion.alta ? BsTrashFill : FaSave}
                  onClick={() =>
                    handleClickEliminar(
                      promotion.alta
                        ? "Dar de Baja Promoción"
                        : "Dar de Alta Promoción",
                      promotion
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showFormModal && (
        <PromocionFormModal
          promocion={currentPromocion}
          handleSubmit={handleSubmit}
          onHide={() => handleClick(1)}
        />
      )}

      {showDeleteModal && (
        <DeleteModalPromocion
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          title={title}
          handleDelete={handleEliminar}
          promo={currentPromocion}
        />
      )}
    </div>
  );
}