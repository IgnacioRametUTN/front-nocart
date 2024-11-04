import { Modal, Button } from 'react-bootstrap';

interface ModalConfirmProps {
  show: boolean;
  title: string;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?  : 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'link';
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ show, title, text, onConfirm, onCancel, variant = "primary" }) => {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirm;
