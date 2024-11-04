import React, { useEffect, useState } from "react";
import { Container, ListGroup, Button, Dropdown } from "react-bootstrap";
import { BsFillPencilFill } from "react-icons/bs";
import UnidadMedidaModal from "./UnidadMedidaModal";
import "./UnidadesMedidaList.css";
import UnidadMedidaService from "../../services/UnidadMedidaServices";
import { UnidadMedida } from "../../entities/DTO/UnidadMedida/UnidadMedida";
import GenericButton from "../../components/generic/buttons/GenericButton";

export const UnidadesMedidaList = () => {
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [clickedUnidad, setClickedUnidad] = useState<number>(0);
  const [modalShow, setModalShow] = useState(false);
  const [editing, setEditing] = useState<boolean>(false);

  const fetchUnidadesMedida = async () => {
    try {
      const unidades = await UnidadMedidaService.getAll();
      setUnidades(unidades);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    event.stopPropagation();
    setClickedUnidad(id);
    setEditing(true);
    setModalShow(true);
  };

  const handleStatusChange = async (unidad: UnidadMedida, alta: boolean) => {
    try {
      const updatedUnidad = { ...unidad, alta };
      await UnidadMedidaService.update(unidad.id, updatedUnidad);
      setUnidades((prevUnidades) =>
        prevUnidades.map((u) => (u.id === unidad.id ? updatedUnidad : u))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const renderUnidadesMedida = (unidades: UnidadMedida[]) => {
    return unidades.map((unidad, index) => (
      <ListGroup.Item
        key={unidad.id}
        className={`d-flex justify-content-between align-items-center ${
          unidad.alta ? "normal" : "baja"
        }`}
        style={{ backgroundColor: unidad.alta ? "white" : "#f2f2f2" }}
      >
        <span>
          {index + 1}. {unidad.denominacion}
        </span>
        <div className="d-flex gap-3">
          <GenericButton
            color={unidad.alta ? "#4CAF50" : "#FBC02D"}
            size={20}
            icon={BsFillPencilFill}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              handleButtonClick(e, unidad.id)
            }
          />
          <Dropdown
            onSelect={(eventKey) =>
              handleStatusChange(unidad, eventKey === "alta")
            }
          >
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {unidad.alta ? "Alta" : "Baja"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="alta">Alta</Dropdown.Item>
              <Dropdown.Item eventKey="baja">Baja</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </ListGroup.Item>
    ));
  };

  return (
    <Container className="text-center">
      <h1>Lista de Unidades de Medida</h1>
      <div className="d-flex justify-content-center my-3">
        <Button
          onClick={() => {
            setClickedUnidad(0);
            setEditing(false);
            setModalShow(true);
          }}
        >
          Crear Unidad de Medida
        </Button>
      </div>
      <ListGroup>
        {unidades.length > 0 ? (
          renderUnidadesMedida(unidades)
        ) : (
          <p>No hay unidades de medida</p>
        )}
      </ListGroup>
      <UnidadMedidaModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          fetchUnidadesMedida();
        }}
        editing={editing}
        id={clickedUnidad}
      />
    </Container>
  );
};
