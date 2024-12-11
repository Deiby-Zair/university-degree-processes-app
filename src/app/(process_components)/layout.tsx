'use client';

import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react'; // Importa los íconos

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Actualiza el estado de la pantalla grande cuando se redimensiona
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sincroniza el estado del sidebar con el tamaño de la pantalla
  useEffect(() => {
    if (isLargeScreen) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isLargeScreen]);

  // Cierra el sidebar si se hace clic fuera de él (solo en pantallas pequeñas)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen && !isLargeScreen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, isLargeScreen]); // Dependencias constantes

  return (
    <div className="relative flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? 'block' : 'hidden'
          } h-screen md:block fixed flex flex-col md:sticky inset-y-0 left-0 w-[300px] bg-white z-50 md:z-auto transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Button to close Sidebar */}
        <div className=" p-4 flex justify-end md:hidden">
          <button onClick={toggleSidebar} className="text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="h-full md:flex-grow">
          <Sidebar />
        </div>
      </div>

      <main
        className={`flex-1 h-full transition-all duration-300 ${isSidebarOpen && !isLargeScreen ? 'md:ml-[300px]' : 'md:ml-0'
          }`}
      >
        {/* Burger Menu for Mobile */}
        <div className="md:hidden p-4">
          <button onClick={toggleSidebar} className="text-gray-600">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};