import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Dropdown,
  DropdownButton,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import "./styles.css";
import { SucursalFormModal } from "./SucursalFormModal";

interface SucursalListProps {
  sucursales: Sucursal[];
  handleSubmit: (sucursal: Sucursal, files: File[]) => Promise<void>;
  onHide: (show: boolean) => void;
  handleStatusChange: (sucursal: Sucursal, activo: boolean) => void;
  handleClickModal: (sucursal: Sucursal) => void;
}

const SucursalList: React.FC<SucursalListProps> = ({
  handleSubmit,
  onHide,
  handleStatusChange,
  sucursales,
  handleClickModal,
}) => {
  const [error] = useState<string | null>(null);
  const { selectSucursal, activeSucursal } = useAuth0Extended();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div>
      {error && <p>{error}</p>}
      <Row>
        {sucursales.map((sucursal) => (
          <Col key={sucursal.id} sm={12} md={6} lg={4} className="mb-4">
            <Card
              onClick={() => selectSucursal(sucursal.id)}
              className={
                activeSucursal == String(sucursal.id) ? "selected-card" : ""
              }
              style={{ backgroundColor: sucursal.alta ? "white" : "darkgrey" }}
            >
              <Card.Img
                variant="top"
                src={
                  sucursal.imagenes[0]
                    ? sucursal.imagenes[0].url
                    : "https://via.placeholder.com/150"
                }
              />
              <Card.Body>
                <Card.Title>{sucursal.nombre}</Card.Title>
                <Card.Text>
                 
                  <strong>Horario Apertura:</strong> {sucursal.horarioApertura}{" "}
                  <br />
                  <strong>Horario Cierre:</strong> {sucursal.horarioCierre}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickModal(sucursal);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={sucursal.alta ? "Alta" : "Baja"}
                    variant={sucursal.alta ? "success" : "danger"}
                    className="ml-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dropdown.Item
                      onClick={() => handleStatusChange(sucursal, true)}
                    >
                      Alta
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleStatusChange(sucursal, false)}
                    >
                      Baja
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para editar la sucursal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Sucursal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SucursalFormModal
            sucursal={new Sucursal()}
            handleSubmit={handleSubmit}
            onHide={() => onHide(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SucursalList;
