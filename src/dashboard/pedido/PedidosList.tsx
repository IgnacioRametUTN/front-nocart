import { useEffect, useState } from "react";
import PedidoFull from "../../entities/DTO/Pedido/PedidoFull";
import PedidoService from "../../services/PedidoService";
import { Accordion, Container, ListGroup } from "react-bootstrap";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";

export const PedidosList = () => {
  const [pedidos, setPedidos] = useState<PedidoFull[]>();
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const {activeSucursal} = useAuth0Extended();
  const fetchPedidos = async () => {
    try {
      const pedidos = await PedidoService.obtenerPedidos(fecha, activeSucursal);
      setPedidos(pedidos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [fecha]);

  return (
    <>
      <h1>Lista de Pedidos</h1>
      <Container className="mb-2">
        Pedidos del:{" "}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </Container>
      {pedidos ? (
        pedidos.map((pedido, index) => (
          <Accordion style={{ maxWidth: "80%" }} key={index} className="gap-3">
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
                      ? pedido.cliente.nombre + pedido.cliente.apellido
                      : "Cliente no disponible"
                  } `}</div>
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
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))
      ) : (
        <p>No hay Pedidos este dia</p>
      )}
    </>
  );
};
