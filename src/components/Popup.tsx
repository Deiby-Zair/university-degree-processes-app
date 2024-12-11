import React, { useEffect, useRef } from 'react';

interface PopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Establecer el foco en el popup cuando se abre
      popupRef.current?.focus();
    }
  }, [isOpen]);


  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      onConfirm();
    }
  }

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center
          bg-gray-800 bg-opacity-50 z-50 w-screen h-screen"
          ref={popupRef}
          onKeyDown={handleKeyDown}
          tabIndex={0} // Para que el div sea enfocable y pueda capturar eventos de teclado
        >
          <div className="bg-white rounded-lg p-6 max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Advertencia</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onCancel ? onCancel : onConfirm}>
                &times;
              </button>
            </div>

            <p className="mt-4">{message}</p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                onClick={onConfirm}
              >
                Aceptar
              </button>
              {onCancel &&
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={onCancel}
                >
                  Cancelar
                </button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Popup;
