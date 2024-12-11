'use client';

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import { useAuth } from "@/context/context";
import Popup from "./Popup";

export default function Logout() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const activeWallet = useActiveWallet();
    const { disconnect } = useDisconnect();

    const disconnectWallet = () => {
        console.log("Active wallet:", activeWallet);
        if (activeWallet) disconnect(activeWallet);

        console.log("Entered the disconnect function with auth:", isAuthenticated);
        logout();
        setIsPopupOpen(false); // Cerrar el popup después de confirmar
    }

    const handleCancel = () => {
        setIsPopupOpen(false); // Cerrar el popup después de cancelar
    }

    return (
        <>
            {isPopupOpen &&
                <div className="fixed flex justify-center items-center h-screen">
                    <Popup
                        isOpen={isPopupOpen}
                        message="¿Realmente desea salir de la aplicación?"
                        onConfirm={disconnectWallet}
                        onCancel={handleCancel}
                    />
                </div>
            }
            < button
                className="relative bottom-2 left-2 flex items-center gap-2 hover:bg-gray-200 transition-colors duration-300
                ease-in-out py-2 px-4 rounded-lg"
                onClick={() => setIsPopupOpen(true)}
            >
                <LogOut />
                <span> Cerrar sesión</span>
            </button >
        </>
    )
}