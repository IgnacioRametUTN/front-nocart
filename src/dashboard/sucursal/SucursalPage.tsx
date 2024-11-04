import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import SucursalList from "./SucursalList";
import { useNavigate } from "react-router-dom";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import { SucursalFormModal } from "./SucursalFormModal";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";
import SucursalService from "../../services/SucursalService";
import { useSnackbar } from "../../hooks/SnackBarProvider";

const SucursalesPage: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [currentSucursal, setCurrentSucursal] = useState<Sucursal>(
    new Sucursal()
  );
  const [showFormModal, setShowFormModal] = useState(false);
  const { activeEmpresa } = useAuth0Extended();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  if (!activeEmpresa) {
    navigate("/empresas");
  }

  const getSucursales = async () => {
    try {
      const data = await SucursalService.fetchSucursalesByActiveEmpresa(
        Number(activeEmpresa)
      );
      setSucursales(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getSucursales();
  }, [activeEmpresa]);

  const handleSubmit = async (sucursal: Sucursal, files: File[]) => {
    try {
      let response: Sucursal;
      if (sucursal.id !== 0) {
        response = await SucursalService.update(sucursal.id, {
          ...sucursal,
          imagenes: sucursal.imagenes.filter(
            (imagen) => !imagen.url.includes("blob")
          ),
        });
      } else {
        response = await SucursalService.create(activeEmpresa, {
          ...sucursal,
          imagenes: sucursal.imagenes.filter(
            (imagen) => !imagen.url.includes("blob")
          ),
        });
      }
      if (response && files.length > 0) {
        const responseImagenes = await SucursalService.uploadFiles(
          response.id,
          files
        );
        if (responseImagenes) {
          response.imagenes = responseImagenes;
        }
      }
      setSucursales((prev) => {
        if (prev.some((s) => s.id === response.id)) {
          return prev.map((s) => (s.id === response.id ? response : s));
        } else {
          return [...prev, response];
        }
      });
      getSucursales();
    } catch (error) {
      console.error("Error guardando la sucursal:", error);
      throw error; // Importante: para que la promesa sea rechazada si hay un error
    }
  };

  const handleClickModal = (sucursal: Sucursal) => {
    setShowFormModal(true);
    setCurrentSucursal(sucursal);
  };

  const handleStatusChange = async (sucursal: Sucursal, status: boolean) => {
    try {
      if (sucursal && status != sucursal.alta) {
        const updatedSucursal = await SucursalService.bajaSucursal(
          sucursal.id,
          status
        );
        if (updatedSucursal) {
          setSucursales(
            sucursales.map((s) => (s.id === sucursal.id ? updatedSucursal : s))
          );
          showSuccess("Se ha cambiado el estado de la sucursal correctamente");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message)
      }
    }
  };
  return (
    <>
      <Container>
        <h1>Gestión de Sucursales</h1>
        <Button onClick={() => handleClickModal(new Sucursal())}>
          Agregar Sucursal
        </Button>
        <Row className="my-3">
          <Col>
            <SucursalList
              sucursales={sucursales}
              handleSubmit={handleSubmit}
              handleClickModal={handleClickModal}
              onHide={() => setShowFormModal(true)}
              handleStatusChange={handleStatusChange}
            />
          </Col>
        </Row>
      </Container>
      {showFormModal && (
        <SucursalFormModal
          sucursal={currentSucursal}
          handleSubmit={handleSubmit}
          onHide={() => setShowFormModal(false)}
        />
      )}
    </>
  );
};

export default SucursalesPage;
