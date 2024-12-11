'use client';

import { useState } from "react";
import { useActiveAccount, useSetActiveWallet } from "thirdweb/react";
import { getUserEmail } from "thirdweb/wallets/in-app";
import Image from "next/image";

import { JsonForm } from "./JsonForm";
import { useAuth } from "@/context/context";
import { client } from "@/utils/constants";
import { getUserRole } from "@/utils/contractInteract";
import { accountFields, initialAccount } from "@/utils/requiredFields";
import { createSmartWallet, connectSmartWallet, createAccount } from "@/utils/wallet";

export default function Login() {
    const { login, setCurrentRole } = useAuth();

    const [loadingStatus, setLoadingStatus] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [showCreateAccount, setShowCreateAccount] = useState<boolean>(false);
    const [userAccount, setUserAccount] = useState<Record<string, any>>({ ...initialAccount });

    const setActiveWallet = useSetActiveWallet();
    const activeAccount = useActiveAccount();

    const createUserAccount = async (newJson: Record<string, any>) => {
        if (activeAccount) {
            try {
                await createAccount(activeAccount, newJson);
                setCurrentRole(newJson.role);
                login();
            } catch (error) {
                console.error("Error creating user account:", error);
            }
        }
    };

    const connectWallet = async () => {
        try {
            setIsLoading(true);
            setIsInvalid(false);
            setLoadingStatus("Iniciando sesión...")
            const [user_account, personalWallet] = await createSmartWallet(setActiveWallet);
            const email = await getUserEmail({ client });
            setLoadingStatus(`Iniciando sesión como ${email}`);
            if (user_account && personalWallet && email?.endsWith("@unicauca.edu.co")) {
                console.log("Valid email:", email);
                setIsInvalid(false);
                const newUserAccount = { ...userAccount, email };
                setUserAccount(newUserAccount);
                console.log("User Account for wallet connected:", newUserAccount);

                const userRegistered = await connectSmartWallet(user_account.address);
                if (userRegistered) {
                    setLoadingStatus("Cuenta registrada! Cargando Procesos...");
                    setCurrentRole(await getUserRole(user_account.address));
                    login();
                } else {
                    console.log("User not registered");
                    setLoadingStatus("Creando cuenta nueva...");
                    setShowCreateAccount(true);
                    setLoadingStatus("Registrando usuario...");
                };

            } else {
                console.log("Email out of system", email);
                setIsInvalid(true);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-indigo-900">
            <div className="flex flex-col md:flex-row w-full max-w-3xl min-h-96 m-2 
            bg-white rounded-lg shadow-lg items-center">
                <h2
                    className="flex md:hidden items-center justify-center
                    text-4xl font-semibold mb-4 pt-8"
                >
                    SG - Docs
                </h2>
                <div className="relative w-full max-w-[500px] md:w-1/2 min-h-[300px] h-full
                flex items-end p-4 pb-1">
                    <Image
                        src="/login_background.svg"
                        alt="Imagen de login"
                        fill
                        priority
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        className="absolute inset-0"
                    />
                    <span className="text-xs text-gray-300 z-10">
                        Imagen de storyset en Freepik
                    </span>
                </div>

                <div className="md:w-1/2 p-8 justify-center">
                    <h2
                        className="hidden md:flex items-center justify-center
                        text-4xl font-semibold mb-4"
                    >
                        SG - Docs
                    </h2>
                    <p className="flex items-center justify-center text-center text-gray-700 mb-6">
                        Ingresa a tu cuenta insitucional para acceder al sistema
                        de gestión documental de procesos de Grado.
                    </p>

                    {!isLoading ? (
                        <div className="flex items-center justify-center dark:bg-gray-800 mb-6">
                            <button onClick={() => connectWallet()}
                                className="flex gap-2 px-4 py-2
                                border border-slate-200 dark:border-slate-700
                                rounded-lg text-slate-700 dark:text-slate-200
                                hover:border-slate-400 dark:hover:border-slate-500
                                hover:text-slate-900 dark:hover:text-slate-300
                                hover:shadow transition duration-150">
                                <Image
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google logo"
                                    width={24}
                                    height={24}
                                    loading="lazy"
                                />
                                <span>Iniciar sesión con Google</span>
                            </button>
                        </div>
                    ) : (
                        <p
                            className="flex items-center justify-center
                            text-center text-gray-700 mb-6"
                        >
                            {loadingStatus}
                        </p>
                    )}

                    {!isLoading && isInvalid &&
                        <div className="text-sm text-center border border-red-400 
                        bg-red-100 mb-2 rounded-lg p-2">
                            <p className="text-red-500 mb-2">Correo no válido</p>
                            <p className="text-gray-700">
                                El correo debe corresponder con una cuenta institucional
                                "correo@unicauca.edu.co"</p>
                        </div>
                    }
                    {showCreateAccount &&
                        <div className="py-8 bg-white">
                            <h2 className=" text-center">Registra tus datos para iniciar</h2>
                            <JsonForm
                                formFields={accountFields}
                                json={userAccount}
                                onExit={() => setShowCreateAccount(false)}
                                onSaveChanges={createUserAccount}
                            />
                        </div>
                    }

                    <p
                        className="flex items-center justify-center
                        text-center text-xs text-gray-600"
                    >
                        Tus datos serán utilizados únicamente para el propósito de la aplicación y
                        estarán protegidos según lo establecido en la Ley 1581 de 2012.
                    </p>
                </div>
            </div>
        </div >
    );
}

// Componente de inicio de sesión tomado de:
// https://tailwindflex.com/@shakti/google-login-signup-button