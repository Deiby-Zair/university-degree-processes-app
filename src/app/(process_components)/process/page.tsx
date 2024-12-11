'use client';

import { ZERO_ADDRESS, prepareContractCall, PreparedTransaction } from "thirdweb";
import {
    useActiveAccount, useReadContract,
    useSendTransaction, useSendBatchTransaction
} from "thirdweb/react";
import { useEffect, useState } from "react";
import { FilePlus } from "lucide-react";

import { useAuth } from "@/context/context";
import { JsonForm } from "@/components/JsonForm";
import FullScreenLoader from "@/components/FullScreenLoader";
import DocumentTransaction from "@/components/DocumentTransaction";
import Table from "@/components/Table";

import { getEmailAddress, getFirstProcessPhaseById, getProgramJsonById, getUserNameByEmail } from "@/utils/contractInteract";
import { useGetDocDataMyProcesses } from "@/utils/getDocumentData";
import {
    EditableField,
    initialNewProcess, newProcessFields, myProcessesFields
} from "@/utils/requiredFields";
import { mainContract } from "@/utils/contracts";
import { parseJsonString } from "@/utils/json";
import { Button, emptyProcessDetails, ProcessDetails, RowData } from "@/utils/types";
import { allowedToProcesses, userOption } from "@/utils/usersConstants";
import { decyph } from "@/utils/cypher";
import { getCurrentDate } from "@/utils/dateManagement";
import { sendNotificationToUser } from "@/utils/notifications";

export default function Home() {
    const activeWallet = useActiveAccount();
    const wAddress = activeWallet?.address as `0x${string}` ?? ZERO_ADDRESS;

    const { isAuthenticated, role } = useAuth();
    const [showAddProcess, setShowAddProcess] = useState(false);
    const [showAddDocumentTransaction, setShowAddDocumentTransaction] = useState(false);
    const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
    const [programSelectFields, setProgramSelectFields] = useState<EditableField[]>(newProcessFields);
    const [
        selectedDocumentContract,
        setSelectedDocumentContract
    ] = useState<`0x${string}`>(ZERO_ADDRESS);
    const [processToEvaluateData, setProcessToEvaluateData] = useState<ProcessDetails>(
        emptyProcessDetails
    );
    const { data: myProcesses, loading, error } = useGetDocDataMyProcesses(wAddress, shouldUpdate);

    const changeVisibilityAddProcess = () => {
        setShowAddProcess(!showAddProcess);
    };

    const changeVisibilityEdit = () => {
        setShowAddDocumentTransaction(!showAddDocumentTransaction);
    };

    //READ BLOCKCHAIN
    const { data: programs } = useReadContract({
        contract: mainContract,
        method: "getAllPrograms",
        params: []
    });

    const { data: myCurrentProcesses } = useReadContract({
        contract: mainContract,
        method: "getAssociatedProcesses",
        params: [wAddress, 0]
    });

    const getProgramIdByNameAndModality = (name: string, modality: string) => {
        if (!programs) return undefined;
        const programIndex = programs[1]
            .map(decyph)
            .map(parseJsonString)
            .findIndex(({ name: programName, modality: programModality }) =>
                programName === name && programModality === modality
            );
        return programIndex === -1 ? undefined : programs[0][programIndex]
    };

    useEffect(() => {
        console.log("There has been a change in the programs (structures)");
        try {
            if (programs?.length) {
                const programsLabels = programs[1].map((program) => {
                    const jsonProgram = parseJsonString(decyph(program));
                    return `${jsonProgram.name} - ${jsonProgram.modality}`;
                });

                const documentCreationFields = newProcessFields.map(field =>
                    field.key == "program"
                        ? {
                            ...field,
                            options: programs[0] as string[],
                            optionsLabels: programsLabels
                        }
                        : field
                );
                setProgramSelectFields(documentCreationFields);
            }
        } catch (error) {
            console.error("Error obtaining processes:", error);
        }
    }, [programs]);

    //SEND TRANSACTIONS
    const { mutate: sendTransaction, isSuccess } = useSendTransaction();
    const {
        mutate: sendBatchTransaction,
        isSuccess: isSuccessBatch,
        isPending
    } = useSendBatchTransaction();

    useEffect(() => {
        console.log("PENDING, SUCCESBATCH", isPending, isSuccessBatch);
    }, [isPending, isSuccessBatch]);

    useEffect(() => {
        setShouldUpdate(prevShouldUpdate => !prevShouldUpdate);
    }, [myCurrentProcesses, isSuccess, isSuccessBatch]);

    const handleaddTx = async (process: `0x${string}`) => {
        setSelectedDocumentContract(process);
        const processData = myProcesses?.find(({ address }) => address === process);
        if (processData) {
            setProcessToEvaluateData(processData as ProcessDetails);
        }
        changeVisibilityEdit();
    };

    const sendCreationNotification = async (receiver: string, name: string, programId: string) => {
        try {
            const [notificationMail, ownMail, programData] = await Promise.all([
                getEmailAddress(receiver),
                getEmailAddress(wAddress),
                getProgramJsonById(programId),
            ]);
            const notificationName = await getUserNameByEmail(notificationMail);

            sendNotificationToUser(
                {
                    notificationOption: "newProcess",
                    email: notificationMail,
                    firstName: notificationName,
                    uploadDate: getCurrentDate(),
                    documentTitle: name,
                    documentType: programData.name,
                    uploadedBy: ownMail
                });
            console.log("Sending a notification to responder");

        } catch (error) {
            console.error(error)
        }
    };

    const createDocumentProcess = async (newJson: Record<string, any>) => {
        const {
            program, modality, processName,
            studentsArray, directorArray, codirectorArray
        } = newJson;

        console.log(getProgramIdByNameAndModality(program, modality));
        try {
            const initialState = await getFirstProcessPhaseById(program);

            console.log("Creating document process with parameters:",
                program, processName, initialState, studentsArray, directorArray, codirectorArray);

            const allParticipants = [
                ...(studentsArray as string[]),
                ...(directorArray as string[]),
                ...(codirectorArray as string[])
            ];
            allParticipants.forEach((element) => {
                sendCreationNotification(element, processName, program)
            });

            const transaction = prepareContractCall({
                contract: mainContract,
                method: "createDocumentProcess",
                params: [processName, initialState, program,
                    studentsArray, directorArray, codirectorArray],
            }) as PreparedTransaction;
            sendTransaction(transaction);

            setShouldUpdate(!shouldUpdate);
            changeVisibilityAddProcess();

        } catch (error) {
            console.error("Error creating document process:", error);
        }
    };

    const buttons: Button<RowData>[] = [
        {
            icon: <FilePlus />,
            onClick: handleaddTx,
            hoverText: "Añadir documento",
        },
    ];

    const addButton: Button<RowData> =
    {
        icon: <FilePlus>Añadir un proceso nuevo</FilePlus>,
        onClick: () => changeVisibilityAddProcess(),
        hoverText: "Añadir un Proceso nuevo",
    };

    return (isAuthenticated && allowedToProcesses.includes(role as userOption)) ? (
        <div className="w-full">
            {!showAddProcess && !showAddDocumentTransaction &&
                <div>
                    {loading && <p>Cargando procesos...</p>}
                    {error && <p>Error al obtener los procesos...</p>}
                    {!loading && !error && myProcesses &&
                        <div className="p-4">
                            <Table
                                title="Mis procesos Activos"
                                columns={myProcessesFields}
                                data={[...myProcesses].reverse()}
                                buttons={buttons}
                                addButton={addButton} />
                        </div>
                    }
                </div>
            }

            {showAddProcess && (
                <div className="p-4 bg-gray-100 rounded-lg mb-4">
                    <JsonForm
                        title="Añadir nuevo proceso de Grado"
                        json={initialNewProcess}
                        formFields={programSelectFields}
                        onSaveChanges={createDocumentProcess}
                        onExit={changeVisibilityAddProcess}
                    />
                </div>
            )}

            {showAddDocumentTransaction &&
                <div className="p-4 bg-gray-100 rounded-lg mb-4">
                    <DocumentTransaction
                        user="student"
                        contractTo={selectedDocumentContract}
                        processData={processToEvaluateData}
                        changeVisibilityEdit={changeVisibilityEdit}
                        sendBatchTransaction={sendBatchTransaction}
                    />
                </div>
            }
        </div>
    ) : (
        <FullScreenLoader />
    );
}