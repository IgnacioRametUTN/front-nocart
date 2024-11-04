import { Route, Routes } from "react-router-dom";
import { CartProvider } from "../shop/carrito/ContextCarrito";
import Home from "../shop/home/Home";
import PrivateRoute from "./PrivateRoute";
import { Rol } from "../entities/enums/Rol";
import { MisPedidosList } from "../shop/Cliente/mipedido";
import { UnidadesMedidaList } from "../dashboard/unidad-medida/UnidadMedidaList";
import RegistroUsuarioCliente from "../components/shared/Log-Register/FormRegistro";
import ClienteFormulario from "../components/shared/Log-Register/ClienteFormulario";
import ArticuloInsumoPage from "../dashboard/articulos/insumos/ArticulosInsumosPage";
import { PedidosCajero } from "../dashboard/pedido/PedidosXEstado/PedidosCajero";
import { PedidosCocinero } from "../dashboard/pedido/PedidosXEstado/PedidosCocinero";
import { PedidosDelivery } from "../dashboard/pedido/PedidosXEstado/PedidosDelivery";
import { CategoriaPage } from "../dashboard/categoria/CategoriaPage";
import ClientTable from "../dashboard/cliente/ClientesList";
import FormularioDomicilio from "../components/shared/form-domicilio/FormDomicilio";
import EmpresasPage from "../dashboard/empresa/EmpresasPage";
import { PedidosList } from "../dashboard/pedido/PedidosList";

import PromocionesPage from "../dashboard/promocion/PromocionesPage";
import SucursalesPage from "../dashboard/sucursal/SucursalPage";
import FormularioCliente from "../shop/Cliente/FormularioCliente";

import UserList from "../dashboard/user/UserList";
import ProductTable from "../dashboard/articulos/manufacturados/ProductTable";
import { Reportes } from "../dashboard/reportes/Reportes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <CartProvider>
            <Home />
          </CartProvider>
        }
      />

      <Route
        path="/registro"
        element={<RegistroUsuarioCliente closeModal={() => console.log("")} />}
      />
      <Route path="/perfil" element={<ClienteFormulario />} />
      <Route path="/misPedidos" element={<MisPedidosList />} />
      <Route path="/formulario-cliente" element={<FormularioCliente />} />
      <Route
        path="/productos"
        element={
          <PrivateRoute
            element={ProductTable}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/unidadmedida"
        element={
          <PrivateRoute
            element={UnidadesMedidaList}
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin y Cocinero puede acceder
          />
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute
            element={UserList}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />

      <Route
        path="/ingredientes"
        element={
          <PrivateRoute
            element={ArticuloInsumoPage}
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/empresas"
        element={
          <PrivateRoute
            element={EmpresasPage}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/sucursales"
        element={
          <PrivateRoute
            element={SucursalesPage}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/sucursales/:id"
        element={
          <PrivateRoute
            element={SucursalesPage}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/reportes"
        element={
          <PrivateRoute
            element={Reportes} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/pedidos"
        element={
          <PrivateRoute
            element={PedidosList} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/clientes"
        element={
          <PrivateRoute
            element={ClientTable}
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/categorias"
        element={
          <PrivateRoute
            element={CategoriaPage} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/promociones"
        element={
          <PrivateRoute
            element={PromocionesPage} //Recordar cambiar
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin puede acceder
          />
        }
      />

      <Route
        path="/pedidos-cajero"
        element={
          <PrivateRoute
            element={PedidosCajero} //Recordar cambiar
            roles={[Rol.Admin, Rol.Cajero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/pedidos-cocinero"
        element={
          <PrivateRoute
            element={PedidosCocinero} //Recordar cambiar
            roles={[Rol.Admin, Rol.Cocinero]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/pedidos-delivery"
        element={
          <PrivateRoute
            element={PedidosDelivery} //Recordar cambiar
            roles={[Rol.Admin, Rol.Delivery]} // Solo admin puede acceder
          />
        }
      />
      <Route
        path="/Domicilio"
        element={
          <PrivateRoute
            element={FormularioDomicilio} //Recordar cambiar
            roles={[Rol.Admin]} // Solo admin puede acceder
          />
        }
      />
    </Routes>
  );
}
