'use client';

import { prepareContractCall, PreparedTransaction, ZERO_ADDRESS } from "thirdweb";
import { useActiveAccount, useReadContract, useSendBatchTransaction } from "thirdweb/react";
import { useEffect, useState } from "react";
import { ClipboardPen } from "lucide-react";

import { useAuth } from "@/context/context";
import Table from "@/components/Table";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useGetDocDataAssignments } from "@/utils/getDocumentData";
import { allowedToAssignments, userOption } from "@/utils/usersConstants";
import { myProcessesFields } from "@/utils/requiredFields";
import { mainContract } from "@/utils/contracts";
import { RowData, Button } from "@/utils/types";
import { getEmailAddress, getProgramJsonById, getUserNameByEmail } from "@/utils/contractInteract";
import { getCurrentDate } from "@/utils/dateManagement";
import { sendNotificationToUser } from "@/utils/notifications";

export default function Home() {

    const { isAuthenticated, role } = useAuth();
    const activeWallet = useActiveAccount();
    const wAddress = activeWallet?.address as `0x${string}` ?? ZERO_ADDRESS;
    const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
    const {
        data: pendingProcesses, loading, error
    } = useGetDocDataAssignments(wAddress, shouldUpdate);

    //READ BLOCKCHAIN
    const { data: pendingAssignments } = useReadContract({
        contract: mainContract,
        method: "getAssociatedProcesses",
        params: [wAddress, 2]
    });

    //SEND TRANSACTIONS
    const { mutate: sendBatchTransaction, isSuccess: isSuccesBatch } = useSendBatchTransaction();

    useEffect(() => {
        setShouldUpdate(prevShouldUpdate => !prevShouldUpdate);
    }, [pendingAssignments, isSuccesBatch]);

    const sendAssignmentNotification = async (receiver: string, name: string, programId: string) => {
        try {
            const [notificationMail, ownMail, programData] = await Promise.all([
                getEmailAddress(receiver),
                getEmailAddress(wAddress),
                getProgramJsonById(programId),
            ]);
            const notificationName = await getUserNameByEmail(notificationMail);

            sendNotificationToUser(
                {
                    notificationOption: "assignment",
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

    const createAssignmentRequest = async (json: Record<string, any>) => {
        const { contractTo, state, ownersArray, processName, program } = json;
        try {
            console.log("The assignment is requested with the parameters: ",
                contractTo, mainContract.address, ownersArray, ownersArray.length, state);
            // ownersArray must be an array of wallets

            //Add to evals for each evaluator and get off asignations
            const transaction = prepareContractCall({
                contract: mainContract,
                method: "createAssignment",
                params: [ownersArray, contractTo, ownersArray.length, state],
            }) as PreparedTransaction;

            const transactions: PreparedTransaction[] = ownersArray.map((owner: string) => {
                return prepareContractCall({
                    contract: mainContract,
                    method: "addAssociatedProcess",
                    params: [owner, 1, "evalaute", contractTo],
                }) as PreparedTransaction;
            });

            const removeAssignmentTransaction = prepareContractCall({
                contract: mainContract,
                method: "removeAssociatedProcess",
                params: [wAddress, 2, contractTo],
            }) as PreparedTransaction;

            sendBatchTransaction([transaction, ...transactions, removeAssignmentTransaction]);

            (ownersArray as string[]).forEach((element) => {
                sendAssignmentNotification(element, processName, program)
            });

        } catch (error) {
            console.error("Error creating assignment request:", error);
        }
    };

    const buttons: Button<RowData>[] = [
        {
            icon: <ClipboardPen />,
            onClick: createAssignmentRequest,
            hoverText: 'Assign',
        },
    ];

    return (isAuthenticated && allowedToAssignments.includes(role as userOption)) ? (
        <div className="w-full">
            {loading && <p>Cargando procesos...</p>}
            {error && <p>Error al obtener los procesos...</p>}
            {!loading && !error && pendingProcesses &&
                <div className="p-4">
                    <Table
                        title="Lista de Asignaciones Pendientes"
                        columns={myProcessesFields}
                        data={pendingProcesses}
                        buttons={buttons}
                    />
                </div>
            }
        </div>
    ) : (
        <FullScreenLoader />
    );
}