'use client';

import { ZERO_ADDRESS } from "thirdweb";
import { useActiveAccount, useReadContract, useSendBatchTransaction } from "thirdweb/react";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";

import { useAuth } from "@/context/context";
import Table from "@/components/Table";
import FullScreenLoader from "@/components/FullScreenLoader";
import DocumentTransaction from "@/components/DocumentTransaction";
import { useGetDocDataEvaluations } from "@/utils/getDocumentData";
import { allowedToEvaluations, userOption } from "@/utils/usersConstants";
import { myProcessesFields } from "@/utils/requiredFields";
import { mainContract } from "@/utils/contracts";
import { Button, ProcessDetails, RowData } from "@/utils/types";

export default function Home() {
    const { isAuthenticated, role } = useAuth();

    const activeWallet = useActiveAccount();
    const wAddress = activeWallet?.address as `0x${string}` ?? ZERO_ADDRESS;

    const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
    const [processToEvaluate, setProcessToEvaluate] = useState<`0x${string}`>(ZERO_ADDRESS);
    const [processToEvaluateData, setProcessToEvaluateData] = useState<ProcessDetails>(
        {
            address: "",
            state: "",
            program: "",
            modality: "",
            processName: "",
        }
    );
    const [showEditionMode, setShowEditionMode] = useState(false);

    const changeVisibilityEdit = () => {
        setShowEditionMode(!showEditionMode);
    };

    const {
        data: pendingEvaluationsList, loading, error
    } = useGetDocDataEvaluations(wAddress, shouldUpdate);


    //READ BLOCKCHAIN
    const { data: pendingEvaluations, } = useReadContract({
        contract: mainContract,
        method: "getAssociatedProcesses",
        params: [wAddress, 1]
    });

    const { mutate: sendBatchTransaction, isSuccess: isSuccessBatch } = useSendBatchTransaction();

    useEffect(() => {
        console.log("EFECTO DE DOCUMENT TRANSACTIO ACTIVADO CON SUCCES Y BATCH",
            isSuccessBatch);
        setShouldUpdate(prevShouldUpdate => !prevShouldUpdate);
    }, [pendingEvaluations, isSuccessBatch]);

    const handleEvaluate = async (contractTo: `0x${string}`) => {
        setProcessToEvaluate(contractTo);
        const processData = pendingEvaluationsList?.
            find(evaluationPending => evaluationPending.address == contractTo);
        if (processData) setProcessToEvaluateData(processData as ProcessDetails);
        changeVisibilityEdit();
    };

    const buttons: Button<RowData>[] = [
        {
            icon: <Edit />,
            onClick: handleEvaluate,
            hoverText: "Evaluar documento",
        }]

    return (isAuthenticated && allowedToEvaluations.includes(role as userOption)) ? (
        <div className="w-full">
            {!showEditionMode ? (
                <>
                    {loading && <p>Cargando procesos...</p>}
                    {error && <p>Error al obtener los procesos...</p>}
                    {!loading && !error && pendingEvaluationsList &&
                        <div className="p-4">
                            <Table
                                title="Lista de Evaluaciones Pendientes"
                                columns={myProcessesFields}
                                data={pendingEvaluationsList}
                                buttons={buttons} />
                        </div>
                    }
                </>
            ) : (
                <div className="p-4 bg-gray-100 rounded-lg mb-4">
                    <DocumentTransaction
                        user="evaluator"
                        contractTo={processToEvaluate}
                        processData={processToEvaluateData}
                        changeVisibilityEdit={changeVisibilityEdit}
                        sendBatchTransaction={sendBatchTransaction}
                    />
                </div>
            )
            }
        </div >
    ) : (
        <FullScreenLoader />
    );
}