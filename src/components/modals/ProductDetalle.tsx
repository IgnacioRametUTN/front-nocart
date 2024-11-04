// src/components/ProductModal/ProductModal.tsx

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Product {
  name: string;
  description: string;
  imageUrl: string;
}

interface ProductDetalleProps {
  product: Product | null;
  show: boolean;
  handleClose: () => void;
}

const ProductDetalleProps: React.FC<ProductDetalleProps> = ({ product, show, handleClose }) => {
  if (!product) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={product.imageUrl} alt={product.name} className="img-fluid mb-3" />
        <p>{product.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetalleProps;
