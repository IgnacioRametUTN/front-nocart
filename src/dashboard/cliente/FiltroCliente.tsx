import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

interface FiltroClientesProps {
  handleChangeNombre: (nombre: string) => void;
  handleChangeApellido: (apellido: string) => void;
}

export default function FiltroClientes({ handleChangeNombre, handleChangeApellido }: FiltroClientesProps) {
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleChangeNombre(nombre);
    handleChangeApellido(apellido);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row>
        <Col md={5}>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group controlId="apellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button type="submit" variant="primary">Buscar</Button>
        </Col>
      </Row>
    </Form>
  );
}
