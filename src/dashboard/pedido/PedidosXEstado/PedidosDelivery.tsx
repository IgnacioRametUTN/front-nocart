import { useEffect, useState } from "react";
import { Accordion, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import PedidoFull from "../../../entities/DTO/Pedido/PedidoFull";
import PedidoService from "../../../services/PedidoService";
import { Estado } from "../../../entities/enums/Estado";
import { useAuth0Extended } from "../../../Auth/Auth0ProviderWithNavigate";

export const PedidosDelivery = () => {
  const [pedidos, setPedidos] = useState<PedidoFull[]>([]);
  const [loadingPedidoId, setLoadingPedidoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {activeSucursal} = useAuth0Extended();

  const fetchPedidos = async () => {
    try {
      const pedidos = await PedidoService.obtenerPedidosXEstado(
        Estado.EnDelivery,
        activeSucursal
      );
      setPedidos(pedidos);
    } catch (error) {
      console.error(error);
      setError("Error al obtener los pedidos.");
    }
  };

  const actualizarEstado = async (id: number) => {
    try {
      setLoadingPedidoId(id); // Mostrar indicador de carga para este pedido
      await PedidoService.actualizarEstado(id, Estado.Entregado);
      fetchPedidos(); // Recargar los pedidos
    } catch (error) {
      console.error(error);
      setError("Error al actualizar el estado del pedido.");
    } finally {
      setLoadingPedidoId(null); // Ocultar indicador de carga
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [activeSucursal]);

  return (
    <>
      <h1>Pedidos En Delivery</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {pedidos.length > 0 ? (
        pedidos.map((pedido, index) => (
          <Accordion
            style={{ maxWidth: "80%" }}
            key={pedido.id}
            className="gap-3"
          >
            <Accordion.Item eventKey={String(index)}>
              <Accordion.Header className="mx-">
                <div className="d-flex justify-content-between px-5 w-100">
                  <div>{pedido.id}</div>
                  <div>
                    {pedido.fechaPedido
                      ? new Date(pedido.fechaPedido).toLocaleDateString()
                      : "Fecha No disponible"}
                  </div>
                  <div>
                    {pedido.domicilio ? (
                      <>
                        <p>
                          Calle: {pedido.domicilio.calle} Número:{" "}
                          {pedido.domicilio.numero}
                        </p>
                      </>
                    ) : (
                      <p>Dirección no disponible</p>
                    )}
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
                  {pedido.detallePedidos.map((detalle, index) => (
                    <ListGroup.Item
                      as="li"
                      key={index}
                    >{`${detalle.articulo.denominacion}: ${detalle.cantidad} ${detalle.articulo.unidadMedida?.denominacion} = $${detalle.articulo.precioVenta}`}</ListGroup.Item>
                  ))}
                </ListGroup>
                <Button
                  variant="success"
                  className="mt-3"
                  onClick={() => actualizarEstado(pedido.id)}
                  disabled={loadingPedidoId === pedido.id}
                >
                  {loadingPedidoId === pedido.id ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Marcar como Entregado"
                  )}
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))
      ) : (
        <p>No hay pedidos en delivery</p>
      )}
    </>
  );
};
