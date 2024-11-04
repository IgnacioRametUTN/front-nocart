import React, { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

interface SnackbarContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

type SnackbarType = "error" | "success";

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("error");

  const showError = (errorMessage: string) => {
    setMessage(errorMessage);
    setType("error");
    setShow(true);
  };

  const showSuccess = (successMessage: string) => {
    setMessage(successMessage);
    setType("success");
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <SnackbarContext.Provider value={{ showError, showSuccess }}>
      {children}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999999, // Asegura que el snackbar esté encima de otros elementos
        }}
      >
        <Toast
          show={show}
          onClose={handleClose}
          bg={type === "error" ? "danger" : "success"}
          autohide
          delay={2800}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {type === "error" ? "Error" : "Éxito"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar debe usarse dentro de SnackbarProvider");
  }
  return context;
};
