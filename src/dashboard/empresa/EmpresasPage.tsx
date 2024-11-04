import React, { useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import EmpresaList from "./EmpresaList";
import AddEmpresaForm from "./AddEmpresaForm";
import { Empresa } from "../../entities/DTO/Empresa/Empresa";

const EmpresasPage: React.FC = () => {
  const [refreshEmpresas, setRefreshEmpresas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState<Empresa>(new Empresa());

  const handleAddEmpresa = () => {
    setRefreshEmpresas(!refreshEmpresas);
    setShowModal(false); // Ocultar el modal después de agregar o editar una empresa
    setEmpresaEditando(new Empresa()); // Limpiar el estado de edición
  };

  const handleShowModal = (empresa: Empresa) => {
    setEmpresaEditando(empresa);
    setShowModal(true); // Mostrar el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Ocultar el modal
  };

  return (
    <Container>
      <h1>Gestión de Empresas</h1>
      <Row className="mb-3">
        <Col>
          <Button onClick={() => handleShowModal(new Empresa())}>Agregar Empresa</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <EmpresaList
            refresh={refreshEmpresas}
            onEditEmpresa={handleShowModal}
          />
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {empresaEditando ? "Editar Empresa" : "Agregar Empresa"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEmpresaForm
            onAddEmpresa={handleAddEmpresa}
            empresa={empresaEditando}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmpresasPage;
