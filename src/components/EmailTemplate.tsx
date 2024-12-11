import * as React from 'react';

export interface EmailTemplateProps {
  notificationOption?: string
  firstName: string;
  lastName?: string;
  documentTitle?: string;
  uploadDate?: string;
  uploadedBy?: string;
  documentType?: string;
  documentLink?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  notificationOption,
  firstName,
  lastName,
  documentTitle,
  uploadDate,
  uploadedBy,
  documentType,
  documentLink
}) => {

  const getTemplate = (option: string | undefined) => {
    switch (option) {
      case 'newProcess':
        return (
          <div className="font-sans text-gray-800">
            <h1 className="text-2xl font-bold text-green-600">
              Hola, {firstName} {lastName}!
            </h1>

            <p className="mt-4">
              Te informamos que has sido añadido al proceso de grado {documentTitle}.
            </p>

            <p className="mt-4 font-semibold">Detalles del proceso:</p>
            <ul className="list-disc list-inside">
              <li><strong>Título:</strong> {documentTitle}</li>
              <li><strong>Programa:</strong> {documentType}</li>
              <li><strong>Fecha de Creacion:</strong> {uploadDate}</li>
              <li><strong>Creado por:</strong> {uploadedBy}</li>
            </ul>

            <p className="mt-6 text-sm">
              Si tienes alguna duda o necesitas asistencia, no dudes en ponerte en contacto con el equipo de soporte.
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Este es un mensaje automático, por favor no respondas a este correo.
            </p>
          </div>

        );


      default:
        return (
          <div className="font-sans text-gray-800">
            <h1 className="text-2xl font-bold text-green-600">
              Hola, {firstName} {lastName}!
            </h1>

            <p className="mt-4">
              Te informamos que has recibido una nueva notificación relacionada con el proceso de grado {documentTitle}.
            </p>

            <p className="mt-4 font-semibold">Detalles del documento:</p>
            <ul className="list-disc list-inside">
              <li><strong>Título:</strong> {documentTitle}</li>
              <li><strong>Programa:</strong> {documentType}</li>
              <li><strong>Fecha de Subida:</strong> {uploadDate}</li>
              <li><strong>Subido por:</strong> {uploadedBy}</li>
            </ul>

            <p className="mt-4">
              Puedes acceder al documento desde el siguiente enlace:
            </p>
            <a
              href={documentLink}
              className="text-green-600 hover:underline"
            >
              Ver Documento
            </a>

            <p className="mt-6 text-sm">
              Si tienes alguna duda o necesitas asistencia, no dudes en ponerte en contacto con el equipo de soporte.
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Este es un mensaje automático, por favor no respondas a este correo.
            </p>
          </div>
        )
    }
  }


  return (
    <>
      {getTemplate(notificationOption)}
    </>
  )
}
