import {  useEffect, useState } from "react";
import { Accordion, Button, ListGroup, Alert, Spinner } from "react-bootstrap";
import PedidoFull from "../../../entities/DTO/Pedido/PedidoFull";
import PedidoService from "../../../services/PedidoService";
import { Estado } from "../../../entities/enums/Estado";
import { TipoEnvio } from "../../../entities/enums/TipoEnvio";
import { useAuth0Extended } from "../../../Auth/Auth0ProviderWithNavigate";

export const PedidosCajero = () => {
  const [pedidos, setPedidos] = useState<PedidoFull[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingPedidoId, setLoadingPedidoId] = useState<number | null>(null);
  const {activeSucursal} = useAuth0Extended();
  const fetchPedidos = async () => {
    try {
      const pedidosEnProceso = await PedidoService.obtenerPedidosXEstado(
        Estado.EnProceso,
        activeSucursal
      );
      const pedidosPendientes = await PedidoService.obtenerPedidosXEstado(
        Estado.Pendiente,
        activeSucursal
      );
      setPedidos([...pedidosEnProceso, ...pedidosPendientes]);
    } catch (error) {
      console.error(error);
      setError("Error al obtener los pedidos.");
    }
  };

  const actualizarEstado = async (id: number, nuevoEstado: Estado) => {
    try {
      setLoadingPedidoId(id); // Mostrar indicador de carga para este pedido
      await PedidoService.actualizarEstado(id, nuevoEstado);
      fetchPedidos(); // Recargar los pedidos
    } catch (error) {
      console.error(error);
      setError("Error al actualizar el estado del pedido.");
    } finally {
      setLoadingPedidoId(null); // Ocultar indicador de carga
    }
  };

  const rechazarPedido = async (id: number) => {
    try {
      setLoadingPedidoId(id); // Mostrar indicador de carga para este pedido
      await PedidoService.actualizarEstado(id, Estado.Rechazado);
      fetchPedidos(); // Recargar los pedidos
    } catch (error) {
      console.error(error);
      setError("Error al rechazar el pedido.");
    } finally {
      setLoadingPedidoId(null); // Ocultar indicador de carga
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [activeSucursal]);

  return (
    <>
      <h1>Pedidos En Caja</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {pedidos.length > 0 ? (
        pedidos.map((pedido) => (
          <Accordion
            style={{ maxWidth: "100%" }}
            key={pedido.id}
            className="mb-3"
          >
            <Accordion.Item eventKey={String(pedido.id)}>
              <Accordion.Header>
                <div className="d-flex justify-content-between px-3 w-100">
                  <div>{pedido.id}</div>
                  <div>
                    {pedido.fechaPedido
                      ? new Date(pedido.fechaPedido).toLocaleDateString()
                      : "Fecha No disponible"}
                  </div>
                  <div>
                    {pedido.tipoEnvio
                      ? pedido.tipoEnvio
                      : "Tipo de envío no disponible"}
                  </div>
                  <div>{pedido.total}</div>
                  <div>{`Cliente: ${
                    pedido.cliente
                      ? pedido.cliente.nombre + " " + pedido.cliente.apellido
                      : "Cliente no disponible"
                  }`}</div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <ListGroup as="ol" numbered>
                  {pedido.detallePedidos.map((detalle) => (
                    <ListGroup.Item
                      as="li"
                      key={detalle.articulo.id}
                    >{`${detalle.articulo.denominacion}: ${detalle.cantidad} ${detalle.articulo.unidadMedida?.denominacion} = $${detalle.articulo.precioVenta}`}</ListGroup.Item>
                  ))}
                </ListGroup>
                <div className="d-flex justify-content-between mt-3">
                  {pedido.estado === Estado.EnProceso && (
                    <>
                      <Button
                        variant="danger"
                        onClick={() => rechazarPedido(pedido.id)}
                        disabled={loadingPedidoId === pedido.id}
                        aria-label={`Rechazar pedido ${pedido.id}`}
                      >
                        {loadingPedidoId === pedido.id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Rechazar Pedido"
                        )}
                      </Button>
                      <Button
                        variant="success"
                        onClick={() =>
                          actualizarEstado(pedido.id, Estado.Preparacion)
                        }
                        disabled={loadingPedidoId === pedido.id}
                        aria-label={`Aceptar pedido ${pedido.id}`}
                      >
                        {loadingPedidoId === pedido.id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Aceptar Pedido"
                        )}
                      </Button>
                    </>
                  )}
                  {pedido.estado === Estado.Pendiente &&
                    pedido.tipoEnvio === TipoEnvio.Delivery && (
                      <Button
                        variant="warning"
                        onClick={() =>
                          actualizarEstado(pedido.id, Estado.EnDelivery)
                        }
                        disabled={loadingPedidoId === pedido.id}
                        aria-label={`Marcar pedido ${pedido.id} como En Delivery`}
                      >
                        {loadingPedidoId === pedido.id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Marcar como En Delivery"
                        )}
                      </Button>
                    )}
                  {pedido.estado === Estado.Pendiente &&
                    pedido.tipoEnvio === TipoEnvio.TakeAway && (
                      <Button
                        variant="success"
                        onClick={() =>
                          actualizarEstado(pedido.id, Estado.Entregado)
                        }
                        disabled={loadingPedidoId === pedido.id}
                        aria-label={`Marcar pedido ${pedido.id} como Entregado`}
                      >
                        {loadingPedidoId === pedido.id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Marcar como Entregado"
                        )}
                      </Button>
                    )}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))
      ) : (
        <p>No hay pedidos disponibles</p>
      )}
    </>
  );
};
