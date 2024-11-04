import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import UnidadMedidaService from '../../services/UnidadMedidaServices';
import { UnidadMedida } from '../../entities/DTO/UnidadMedida/UnidadMedida';

function UnidadMedidaModal(props: { show: boolean, onHide: () => void, editing: boolean, id: number }) {
    const [error, setError] = useState<string>("");
    const [unidad, setUnidad] = useState<UnidadMedida>(new UnidadMedida());

    const fetchUnidadMedida = async (id: number) => {
        try {
            const data = await UnidadMedidaService.getOne(id);
            setUnidad(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (props.editing && props.id) {
            fetchUnidadMedida(props.id);
        } else {
            setUnidad(new UnidadMedida());
        }
    }, [props.editing, props.id]);
    
    const handleClose = () => {
        setUnidad(new UnidadMedida());
        setError(""); 
        props.onHide();
    };
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!unidad.denominacion || unidad.denominacion.trim() === "") {
            setError("La denominación no puede estar vacía.");
            return;
        }
        try {
            if (props.editing) {
                await UnidadMedidaService.update(props.id, unidad);
            } else {
                await UnidadMedidaService.create(unidad);
            }
            handleClose();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.editing ? 'Editar Unidad de Medida' : 'Crear Unidad de Medida'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="denominacion">
                        <Form.Label>Denominacion</Form.Label>
                        <Form.Control type="text" placeholder="Ingresar denominacion" onChange={(e) => setUnidad(prev => ({
                            ...prev,
                            denominacion: e.target.value
                        }))}
                            value={unidad.denominacion} 
                            required
                            />
                    </Form.Group>
                </Form>
                {error && <p className='text-danger'>{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.onHide}>Cerrar</Button>
                <Button onClick={handleSave}>{props.editing ? 'Guardar Cambios' : 'Crear'}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UnidadMedidaModal;
