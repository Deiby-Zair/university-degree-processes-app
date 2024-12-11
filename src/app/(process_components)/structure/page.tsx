'use client';

import { PreparedTransaction, prepareContractCall } from "thirdweb";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import { useAuth } from "@/context/context";
import { DataCard } from "@/components/DataCard";
import { JsonForm } from "@/components/JsonForm";
import FullScreenLoader from "@/components/FullScreenLoader";
import Popup from "@/components/Popup";

import { cyph, decyph } from "@/utils/cypher";
import { parseJsonString } from "@/utils/json";
import { mainContract } from "@/utils/contracts";
import { initialProgram, programFields } from "@/utils/requiredFields";
import { allowedToPrograms, userOption } from "@/utils/usersConstants";
import Carousel from "@/components/Carousel";

export default function Home() {
    const { isAuthenticated, role } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [programToDelete, setProgramToDelete] = useState<string>("");
    const [showAddProgram, setShowAddProgram] = useState(false);
    const [showEditionMode, setShowEditionMode] = useState(false);
    const [programIds, setProgramIds] = useState<string[]>([]);
    const [programList, setProgramList] = useState<string[]>([]);
    const [programCards, setProgramCards] = useState<{ id: number; content: JSX.Element; }[]>([]);

    const [jsonData, setJsonData] = useState<Record<string, any>>(initialProgram);

    const changeVisibilityAddProgram = () => {
        setShowAddProgram(!showAddProgram);
    };

    const changeVisibilityEdit = () => {
        setShowEditionMode(!showEditionMode);
    };

    //READ BLOCKCHAIN

    const { data: programs } = useReadContract({
        contract: mainContract,
        method: "getAllPrograms",
        params: []
    });

    useEffect(() => {
        console.log("There has been a change in the programs (structures)");
        try {
            const processArray = programs as unknown as Array<Array<string>>;
            setProgramIds(processArray[0]);
            const arrayProgramList = processArray[1].map((program) => decyph(program));
            setProgramList(arrayProgramList);
        } catch (error) {
            console.error("Error:", error);
        }
    }, [programs]);

    useEffect(() => {
        console.log("Getting respective cards");
        try {
            setProgramCards(getProgramCards(programIds, programList));
        } catch (error) {
            console.error("Error:", error);
        }
    }, [programList]);

    //SEND TRANSACTIONS
    const { mutate: sendTransaction } = useSendTransaction();

    const addProgram = (newJson: Record<string, any>): void => {
        const { code, ...JsonToSend } = newJson;
        const program = cyph(JSON.stringify(JsonToSend));

        const transaction = prepareContractCall({
            contract: mainContract,
            method: "addProgram",
            params: [code, program],
        }) as PreparedTransaction;
        sendTransaction(transaction);
        changeVisibilityAddProgram();
    };

    const updateProgram = (newJson: Record<string, any>): void => {
        const { code, ...jsonToSend } = newJson;
        const program = cyph(JSON.stringify(jsonToSend));

        const transaction = prepareContractCall({
            contract: mainContract,
            method: "updateProgram",
            params: [code, program],
        }) as PreparedTransaction;
        sendTransaction(transaction);
        changeVisibilityEdit();
    };

    const handleUpdate = (index: number): void => {
        setJsonData({ ...parseJsonString(programList[index]), code: programIds[index] });
        console.log("Program to update Code:", programIds[index]);
        changeVisibilityEdit();
    };

    const deleteProgram = (id: string): void => {
        const transaction = prepareContractCall({
            contract: mainContract,
            method: "deleteProgram",
            params: [id],
        }) as PreparedTransaction;
        sendTransaction(transaction);
    };

    const handleDelete = (idProcessToDelete: string) => {
        setProgramToDelete(idProcessToDelete);
        setPopupMessage(`¿Está seguro que desea eliminar el programa ${idProcessToDelete}?`);
        setIsPopupOpen(true);
    }
    const handleConfirm = () => {
        deleteProgram(programToDelete);
        setIsPopupOpen(false);
    }
    const handleCancel = () => {
        setIsPopupOpen(false);
    }

    const getProgramCards = (programIndexes: string[], programsData: string[]) => {
        return programIndexes.map((id, index) => ({
            id: index,
            content:
                <DataCard
                    key={index}
                    json={{
                        code: programIndexes[index],
                        ...parseJsonString(programsData[index])
                    }}
                    editableFields={programFields}
                />,
            options:
                <div className="flex justify-between mt-4">
                    <button
                        className="inline-flex items-center justify-center h-10 px-4 py-2
                            bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md
                            text-sm font-medium transition-colors focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => handleUpdate(index)}
                    >
                        Editar
                    </button>

                    <button
                        className="inline-flex items-center justify-center h-10 px-4 py-2
                            bg-destructive text-destructive-foreground hover:bg-destructive/90
                            rounded-md text-sm font-medium transition-colors focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => handleDelete(id)}
                    >
                        Eliminar
                    </button>
                </div>
        }))
    };

    return (isAuthenticated && allowedToPrograms.includes(role as userOption)) ? (
        <>
            {isPopupOpen &&
                <div className="fixed flex justify-center items-center h-screen">
                    <Popup
                        isOpen={isPopupOpen}
                        message={popupMessage}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                </div>
            }

            <div className="w-full">
                {(!showAddProgram && !showEditionMode) ? (
                    <div >
                        <div className="flex items-center space-x-2 overflow-x-auto p-4 mb-4">
                            <h2 className="text-xl font-bold">Lista de Programas Disponibles</h2>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded text-sm
                                inline-flex items-center whitespace-nowrap hover:bg-blue-600 "
                                title="Añadir un nuevo programa"
                                onClick={changeVisibilityAddProgram}
                            >
                                <CirclePlus className="mr-2" /> Añadir un nuevo Programa
                            </button>
                        </div>
                        {programCards.length && <Carousel items={programCards} />}
                    </div >
                ) : (
                    <div className="p-4 bg-gray-100 rounded-lg mb-4">
                        {showAddProgram ? (
                            <JsonForm
                                title="Añadir nuevo Programa de Grado"
                                json={initialProgram}
                                formFields={programFields}
                                onSaveChanges={addProgram}
                                onExit={changeVisibilityAddProgram}
                            />
                        ) : (
                            <JsonForm
                                title="Editar Programa"
                                json={jsonData}
                                formFields={programFields}
                                onSaveChanges={updateProgram}
                                onExit={changeVisibilityEdit}
                            />
                        )}
                    </div>
                )}
            </div >
        </>
    ) : (
        <FullScreenLoader />
    );
}