import { EditableField } from '@/utils/requiredFields';
import { X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

interface FileUploadProps {
  onFilesAdded: (files: File[],) => void;
  isLoading: boolean;
  field: EditableField;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded, isLoading, field }) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onInputChange = useCallback((newFiles: File[]) => {
    if (newFiles.length > 0) {
      setFiles(newFiles);
      updateFileInput(newFiles);
      onFilesAdded(newFiles);
    }
  }, [onFilesAdded]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onInputChange(acceptedFiles);
  }, [onInputChange]);

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateFileInput = (updatedFiles: File[]) => {
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onInputChange(selectedFiles);
    } else {
      updateFileInput(files);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    onFileDialogCancel: () => { }
  });

  return (
    <>
      <div className='flex  sm:flex-row flex-col items-center justify-center'>
        <div className='inline-flex justify-start w-1/2 sm:w-full items-center'>
          <input
            type="file"
            name={field.name}
            multiple={true}
            ref={fileInputRef}
            required={field.required}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            className="mt-1 rounded-md p-2 mb-1 cursor-pointer
      peer invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500
      "/>

          <button
            onClick={clearFileInput}
            className="flex items-center space-x-1 hover:text-red-500
            mt-1 rounded-md mb-1"
            title={"Eliminar archivo"}
          >
            {<X size={18} />}
          </button>

        </div>

        {isLoading &&
          <div className="w-1/2 sm:w-full flex justify-center items-center">
            <p className="my-1 p-2">
              Cargando<span className="dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mx-4 px-4">
              <div className="bg-blue-400 h-full animate-progress"></div>
            </div>
          </div>
        }
      </div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 rounded p-4  flex-col items-center justify-center text-center cursor-pointer
                 hover:border-blue-500 focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="p-8 mb-2 text-gray-500">Suelta los archivos aquí...</p>
        ) : (
          <div className="flex flex-col items-center">
            <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="mb-2 text-gray-500">
              Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUpload;