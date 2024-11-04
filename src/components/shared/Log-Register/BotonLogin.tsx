import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from './LoginPage';

const BotonLogin: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleRegister = () => {
    navigate("/registro");
  };

  
  const showButton = location.pathname === "/";

  return (
    <>
      {showButton && (
        <>
          <Button variant="primary" className="btn btn-outline-light w-100" onClick={handleLoginModalOpen}>
            Login
          </Button>
          <Button variant="secondary" className="btn btn-outline-light w-100" onClick={handleRegister}>
            Registro
          </Button>
        </>
      )}

      {/* Modal de Login */}
      <Modal show={showLoginModal} onHide={handleLoginModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login closeModal={handleLoginModalClose} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BotonLogin;
