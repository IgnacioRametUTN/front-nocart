import React, { useState, useRef } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Button, Container } from "react-bootstrap";
import "./ImageCarousel.css"; // Importa el archivo CSS
import ModalConfirm from "../../modals/ModalConfirm";
import { Imagen } from "../../../entities/DTO/Imagen";

interface Props {
  imagenesExistentes: Imagen[];
  onFilesChange: (nuevasImagenes: File[]) => void;
  onImagenesChange: (newImages: Imagen[]) => void; // Actualizar estado en Componente padre
}

const ImagenCarousel: React.FC<Props> = ({
  imagenesExistentes,
  onFilesChange,
  onImagenesChange,
}) => {
  const [index, setIndex] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  //Encargado de simular la apertura de "Seleccionar Archivo" por defecto
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAgregarImagenButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      onFilesChange(newFiles);
      const newImages: Imagen[] = newFiles.map((file) => ({
        id: 0,
        alta: true,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      onFilesChange(newFiles);
      onImagenesChange([...imagenesExistentes, ...newImages]);
    }
  };

  const handleDelete = (index: number) => {
    const updatedImages = imagenesExistentes.filter((_, i) => i !== index);
    setIndex(0);
    onImagenesChange(updatedImages); // Notifica al padre
  };

  return (
    <>
      <Container className="mb-2">
        <Button onClick={handleAgregarImagenButton}>Agregar Imagen</Button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Container>
      <Container>
        {imagenesExistentes.length !== 0 ? (
          <>
            <Carousel
              variant="dark"
              interval={null}
              fade={false}
              slide={false}
              onSelect={(activeIndex) => setIndex(activeIndex)}
              activeIndex={index}
            >
              {imagenesExistentes.map((imagen, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block custom-image"
                    src={imagen.url}
                    alt={imagen.name}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <Container className="d-flex justify-content-between">
              <Button
                className="button"
                variant="danger"
                onClick={() => {
                  setShowConfirmModal(true);
                }}
              >
                Eliminar
              </Button>
            </Container>
          </>
        ) : (
          <p>No hay imagenes guardadas</p>
        )}
      </Container>
      <ModalConfirm
        title="Eliminar Imagen"
        text="¿Estás seguro de que quieres eliminar esta imagen?"
        show={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => {
          handleDelete(index);
          setShowConfirmModal(false);
        }}
        variant="danger"
      />
    </>
  );
};

export default ImagenCarousel;
