import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import PedidoFull from "../../entities/DTO/Pedido/PedidoFull";
import ModalConfirm from "../../components/modals/ModalConfirm";
import { createPreferenceMP } from "../../services/MPService";
import { DetallePedido } from "../../entities/DTO/Pedido/DetallePedido";
import { Articulo } from "../../entities/DTO/Articulo/Articulo";
import PedidoService from "../../services/PedidoService";
import { Cliente } from "../../entities/DTO/Cliente/Cliente";
import Usuario from "../../entities/DTO/Usuario/Usuario";
import { Promocion } from "../../entities/DTO/Promocion/Promocion";
import PromocionService from "../../services/PromocionService";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";

interface CartContextType {
  pedido: PedidoFull;
  promocionesAplicadas: PromocionAplicada[];
  agregarAlCarrito: (producto: Articulo | undefined) => void;
  quitarDelCarrito: (index: number) => void;
  vaciarCarrito: () => void;
  handleCompra: () => Promise<void>;
  handleCantidadChange: (index: number, cantidad: number) => void;
  error: string;
  preferenceId: string;
}

interface PromocionAplicada {
  promocionId: number;
  denominacion: string;
  vecesAplicada: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [promocionesAplicadas, setPromocionesAplicadas] = useState<
    PromocionAplicada[]
  >([]);
  const [pedido, setPedido] = useState<PedidoFull>(new PedidoFull());
  const { activeSucursal } = useAuth0Extended();
  const [error, setError] = useState<string>("");
  const { user, isAuthenticated } = useAuth0();
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    text: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  let promocionesAplicadas2: PromocionAplicada[] = [];
  let totalPedido: number = 0;
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [promociones, setPromociones] = useState<Promocion[]>([]);

  const [, setMsjPedido] = useState<string>("");

  const fetchPromociones = async () => {
    setPromociones(
      await PromocionService.getAllBySucursal(Number(activeSucursal))
    );
  };

  useEffect(() => {
    if (activeSucursal) {
      fetchPromociones();
    }
  }, [activeSucursal]);

  const agregarAlCarrito = (articulo: Articulo | undefined) => {
    if (articulo) {
      const nuevoPedido = { ...pedido };
      const detalleExistente = nuevoPedido.detallePedidos.find(
        (detalle) => detalle.articulo?.id === articulo.id
      );

      if (detalleExistente) {
        detalleExistente.cantidad++;
        detalleExistente.subTotal =
          articulo.precioVenta * detalleExistente.cantidad;
      } else {
        const nuevoDetalle = new DetallePedido();
        nuevoDetalle.articulo = articulo;
        nuevoDetalle.cantidad = 1;
        nuevoDetalle.subTotal = articulo.precioVenta;
        nuevoPedido.detallePedidos.push(nuevoDetalle);
      }
      //Verificar Promocion
      // Sumar el precio del artículo al total
      totalPedido = nuevoPedido.detallePedidos.reduce(
        (acc, detalle) => acc + detalle.articulo.precioVenta * detalle.cantidad,
        0
      );
      nuevoPedido.total = totalPedido;

      setPedido(nuevoPedido);
      promocionesAplicadas2 = [];
      setPromocionesAplicadas([]);
      aplicarPromociones2(
        nuevoPedido,
        calcularPromocionesAplicables(nuevoPedido)
      );
      setPreferenceId("");
      setError("");
    }
  };

  function calcularPromocionesAplicables(pedido: PedidoFull): Promocion[] {
    const promocionesAplicables: Promocion[] = [];
    //1. revisar si hay promociones aplicables
    for (let promocion of promociones) {
      let contador = 0;

      //Todas las promociones
      for (let detallePromocion of promocion.detallesPromocion) {
        //Detalles de una promocion
        for (let detallePedido of pedido.detallePedidos) {
          if (
            detallePedido.articulo.id === detallePromocion.articulo.id &&
            detallePedido.cantidad >= detallePromocion.cantidad
          ) {
            contador++;
            if (contador == promocion.detallesPromocion.length) {
              let cantidadAplicada = Math.floor(
                detallePedido.cantidad / detallePromocion.cantidad
              );
              for (let i = 0; i < cantidadAplicada; i++) {
                promocionesAplicables.push(promocion); //Se agrega tantas veces se pueda aplicar
              }
            }
          }
        }
      }
    }

    return promocionesAplicables;
  }

  function aplicarPromociones2(
    pedidoACalcular: PedidoFull,
    promociones: Promocion[]
  ) {
    const pedidoConPromo: PedidoFull = JSON.parse(
      JSON.stringify(pedidoACalcular)
    );
    if (promociones.length > 0) {
      let promo = getMejorPromocion(promociones);

      const precioProductosPromoNormal = promo.detallesPromocion.reduce(
        (acc, detallePromo) => {
          return (
            acc + detallePromo.cantidad * detallePromo.articulo.precioVenta
          );
        },
        0
      );

      let total =
        totalPedido - precioProductosPromoNormal + promo.precioPromocional;
      totalPedido = total;
      actualizarTotal(total);

      restarProductos(promo, pedidoConPromo.detallePedidos);
      actualizarPromocionesAplicadas(promo);
      aplicarPromociones2(
        pedidoConPromo,
        calcularPromocionesAplicables(pedidoConPromo)
      );
    }
  }

  function actualizarTotal(total: number) {
    setPedido((prev) => ({
      ...prev,
      total: total,
    }));
  }
  function actualizarPromocionesAplicadas(promocion: Promocion) {
    const promoAplicada = promocionesAplicadas2.find(
      (promoAplicada) => promoAplicada.promocionId === promocion.id
    );

    if (promoAplicada) {
      // Si la promoción ya ha sido aplicada, incrementar vecesAplicada
      promoAplicada.vecesAplicada += 1;
    } else {
      // Si no existe, crear una nueva entrada
      promocionesAplicadas2.push({
        promocionId: promocion.id,
        denominacion: promocion.denominacion,
        vecesAplicada: 1,
      });
    }
    setPromocionesAplicadas([...promocionesAplicadas2]);
  }
  function restarProductos(
    promocion: Promocion,
    detallesPedido: DetallePedido[]
  ) {
    promocion.detallesPromocion.forEach((detallePromocion) => {
      detallesPedido.forEach((detallePedido, index) => {
        if (detallePedido.articulo.id === detallePromocion.articulo.id) {
          detallePedido.cantidad -= detallePromocion.cantidad;
          if (detallePedido.cantidad <= 0) {
            detallesPedido.splice(index, 1);
          }
        }
      });
    });
  }

  function getMejorPromocion(promociones: Promocion[]): Promocion {
    let promocion = promociones[0];
    let mayorGanancia: number = promociones[0].precioPromocional;

    for (let promoActual of promociones) {
      if (mayorGanancia < promoActual.precioPromocional) {
        mayorGanancia = promoActual.precioPromocional;
        promocion = promoActual;
      }
    }

    return promocion;
  }

  // const aplicarPromociones = () => {
  //   let total = 0;
  //   const nuevoPedido = { ...pedido };
  //   for (let i = 0; i < nuevoPedido.detallePedidos.length; i++) {
  //     total += nuevoPedido.detallePedidos[i].articulo.precioVenta*nuevoPedido.detallePedidos[i].cantidad
  //   }
  //   nuevoPedido.total=total

  //   const nuevasPromocionesAplicadas: PromocionAplicada[] = [];

  //   // Reiniciamos el total del pedido ya que lo recalculará con los descuentos aplicados.
  //   let contador = 0;
  //   nuevoPedido.detallePedidos.forEach(detalle => {
  //     // Inicialmente se establece el subTotal sin promoción
  //     detalle.subTotal = detalle.articulo.precioVenta * detalle.cantidad;

  //     // Aplicar todas las promociones activas a los detalles del pedido
  //     promociones.forEach(promo => {

  //       promo.detallesPromocion.forEach(detallePromo => {
  //         // Verifica que el artículo tiene una promoción aplicable
  //         if (detallePromo.articulo.id === detalle.articulo.id) {

  //           const cantidadNecesaria = detallePromo.cantidad;
  //           if (detalle.cantidad >= cantidadNecesaria) {
  //             contador += 1;
  //             if (contador == promo.detallesPromocion.length) {

  //               const vecesAplicable = Math.floor(detalle.cantidad / cantidadNecesaria);
  //               let precioNormalacc = 0;
  //               for (let i = 0; i < promo.detallesPromocion.length; i++) {
  //                 precioNormalacc += promo.detallesPromocion[i].articulo.precioVenta * promo.detallesPromocion[i].cantidad

  //               }
  //               // Aplicar precio promocional multiplicado por las veces aplicables.

  //               const ahorroPromocional = precioNormalacc - promo.precioPromocional;
  //               //detalle.subTotal -= ahorroPromocional;
  //               // Actualización o inclusión de la información de promoción aplicada

  //               nuevasPromocionesAplicadas.push({
  //                 promocionId: promo.id,
  //                 denominacion: promo.denominacion,
  //                 vecesAplicada: vecesAplicable,
  //                 ahorroTotal: ahorroPromocional
  //               });

  //             }
  //           }
  //         }
  //       });
  //     });

  //   });
  //   let ahorroTotal = 0;
  //     for (let i = 0; i < nuevasPromocionesAplicadas.length; i++) {
  //       ahorroTotal += nuevasPromocionesAplicadas[i].ahorroTotal

  //     }
  //     if (ahorroTotal < 0) {
  //       if (nuevasPromocionesAplicadas.length > 0) {

  //         nuevoPedido.total += -(ahorroTotal)

  //       }
  //     } else {
  //       if (nuevasPromocionesAplicadas.length > 0) {
  //         nuevoPedido.total -= ahorroTotal
  //       }

  //     }
  //   setPedido(nuevoPedido);
  //   setPromocionesAplicadas(nuevasPromocionesAplicadas);
  // };

  const quitarDelCarrito = (index: number) => {
    const detalle = pedido.detallePedidos[index];
    if (detalle.articulo && detalle.articulo.precioVenta) {
      detalle.cantidad--;
      if (detalle.cantidad <= 0) {
        pedido.detallePedidos.splice(index, 1);
      } else {
        detalle.subTotal = detalle.articulo.precioVenta * detalle.cantidad;
      }
      pedido.total -= detalle.articulo.precioVenta;
      setPedido({ ...pedido });

      setPreferenceId("");
    }
  };

  const handleCantidadChange = (index: number, cantidad: number) => {
    setPedido((prevPedido) => {
      const newPedido = { ...prevPedido };
      const detalle = newPedido.detallePedidos[index];
      if (!cantidad || cantidad <= 0) {
        setError("La cantidad debe ser mayor que 0");
        return newPedido;
      }
      if (detalle && detalle.articulo && detalle.articulo.precioVenta) {
        const subtotalDetalle = detalle.articulo.precioVenta * cantidad;
        const cambioSubtotal = subtotalDetalle - detalle.subTotal;
        detalle.subTotal = subtotalDetalle;
        newPedido.total += cambioSubtotal;
        detalle.cantidad = cantidad;
        setError("");
      }
      return newPedido;
    });
    setPreferenceId("");
  };

  const vaciarCarrito = () => {
    setPedido(new PedidoFull());
    setPromocionesAplicadas([]);
    setPreferenceId("");
  };

  const handleCompra = async () => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para realizar una compra.");
      return;
    }

    if (pedido.detallePedidos.length === 0) {
      setError("El carrito debe tener al menos un producto.");
      return;
    } else {
      setError("");
    }

    setShowModal(true);
    setModalConfig({
      title: "Confirmar Compra",
      text: "¿Estás seguro de realizar la compra?",
      onConfirm: async () => {
        setShowModal(false);
        try {
          pedido.cliente = new Cliente();
          pedido.cliente.usuario = new Usuario();
          pedido.cliente.usuario.username = user?.email || "";

          const data = await PedidoService.agregarPedido({ ...pedido });
          if (data > 0) {
            await getPreferenceMP(data);
            setMsjPedido("Compra realizada con éxito");
          } else {
            setError("Error al realizar el pedido");
          }
        } catch (error) {
          setMsjPedido("Error al realizar el pedido");
          console.error(error);
        }
      },
      onCancel: () => setShowModal(false),
    });
  };

  const getPreferenceMP = async (pedidoId: number) => {
    try {
      const pedidoFull: PedidoFull = {
        id: pedidoId,
        alta: true,
        horaEstimadaFinalizacion: "",
        total: pedido.total,
        totalCosto: pedido.totalCosto,
        estado: pedido.estado,
        tipoEnvio: pedido.tipoEnvio,
        formaPago: pedido.formaPago,
        fechaPedido: pedido.fechaPedido,
        domicilio: pedido.domicilio,
        detallePedidos: pedido.detallePedidos,
        cliente: pedido.cliente,
        sucursal: pedido.sucursal,
      };

      const response = await createPreferenceMP(pedidoFull);
      if (response) {
        setPreferenceId(response.id);
      }
    } catch (error) {
      setMsjPedido("Error al crear la preferencia de pago");
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        pedido,
        promocionesAplicadas: promocionesAplicadas,
        agregarAlCarrito,
        quitarDelCarrito,
        vaciarCarrito,
        handleCompra,
        error,
        handleCantidadChange,
        preferenceId,
      }}
    >
      {children}
      <ModalConfirm
        show={showModal}
        title={modalConfig.title}
        text={modalConfig.text}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
      />
    </CartContext.Provider>
  );
};
