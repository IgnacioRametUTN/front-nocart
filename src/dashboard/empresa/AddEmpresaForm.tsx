import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { EmpresaService } from "../../services/EmpresaService";
import { Empresa } from "../../entities/DTO/Empresa/Empresa";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import { Imagen } from "../../entities/DTO/Imagen";
import { useSnackbar } from "../../hooks/SnackBarProvider";

interface AddEmpresaFormProps {
  onAddEmpresa: () => void;
  empresa: Empresa;
}

const AddEmpresaForm: React.FC<AddEmpresaFormProps> = ({
  onAddEmpresa,
  empresa,
}) => {
  const [currentEmpresa, setCurrentEmpresa] = useState<Empresa>(empresa);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showError, showSuccess } = useSnackbar();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "cuil") {
      // Validamos que el valor sea mayor o igual a cero antes de actualizar
      const newValue = parseInt(value, 10);
      if (!isNaN(newValue) && newValue >= 0) {
        setCurrentEmpresa({ ...currentEmpresa, [name]: newValue.toString() });
      }
    } else {
      setCurrentEmpresa({ ...currentEmpresa, [name]: value });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let response: Empresa;
      if (currentEmpresa && currentEmpresa.id) {
        response = await EmpresaService.update(currentEmpresa.id, {
          ...currentEmpresa,
          imagenes: currentEmpresa.imagenes.filter(
            (imagen) => !imagen.url.includes("blob")
          ),
        });
      } else {
        response = await EmpresaService.create({
          ...currentEmpresa,
          imagenes: currentEmpresa.imagenes.filter(
            (imagen) => !imagen.url.includes("blob")
          ),
        });
      }

      if (response && files.length > 0) {
        await EmpresaService.uploadFiles(response.id, files);
      }
      if (response) {
        showSuccess("Empresa guardada exitosamente");
        setTimeout(() => {
          setIsLoading(false);
          onAddEmpresa();
        }, 1500);
      } else {
        showError("No se pudo guardar la empresa");
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
      setIsLoading(false);
    }
  };
  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setCurrentEmpresa((prev) => ({
      ...prev,
      imagenes: newImages,
    }));
  };

  return (
    <div>
      <h2>{currentEmpresa ? "Editar Empresa" : "Agregar Empresa"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={currentEmpresa.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="razonSocial">
          <Form.Label>Razón Social</Form.Label>
          <Form.Control
            type="text"
            name="razonSocial"
            value={currentEmpresa.razonSocial}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="cuil">
          <Form.Label>CUIL</Form.Label>
          <Form.Control
            type="number"
            name="cuil"
            value={currentEmpresa.cuil}
            onChange={handleChange}
            min="1"
            required
          />
        </Form.Group>
        <br></br>
        <ImagenCarousel
          imagenesExistentes={currentEmpresa.imagenes}
          onFilesChange={handleFileChange}
          onImagenesChange={handleImagenesChange}
        />
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="sm" />
              {currentEmpresa ? " Actualizando..." : " Agregando..."}
            </>
          ) : currentEmpresa ? (
            "Actualizar"
          ) : (
            "Agregar"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default AddEmpresaForm;
