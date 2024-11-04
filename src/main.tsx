import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { BrowserRouter } from "react-router-dom";
import { Auth0ProviderWithNavigate } from "./Auth/Auth0ProviderWithNavigate";
import { SnackbarProvider } from "./hooks/SnackBarProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
