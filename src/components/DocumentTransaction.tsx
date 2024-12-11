'use client';

import { prepareContractCall, PreparedTransaction, ZERO_ADDRESS } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useCallback, useEffect, useState } from "react";

import { JsonForm } from "@/components/JsonForm";
import {
    getContractState,
    getDirectorEmail,
    getEmailAddress,
    getPendingEvaluations, getPendingSigners,
    getProgramByProcessAddress,
    getUserName, getWalletAddress
} from "@/utils/contractInteract";
import {
    approbalTxFields, EditableField,
    initialapprobalTx, initialProgram
} from "@/utils/requiredFields";
import { getDocumentContract, getMultisignContract, mainContract } from "@/utils/contracts";
import { getPhaseMultisign } from "@/utils/contractEvents";
import { getCurrentDate } from "@/utils/dateManagement";
import { DocumentTxProps } from "@/utils/types";
import { sendNotificationToUser } from "@/utils/notifications";
import { resolveAddress } from "./Ipfs";

export default function DocumentTransaction({
    user, contractTo, processData, changeVisibilityEdit, sendBatchTransaction
}: DocumentTxProps) {

    const [phases, setPhases] = useState<string[]>([]);
    const [supportingText, setSupportingText] = useState<string>("");
    const [isInitializer, setIsInitializer] = useState<boolean>(false);

    const [loadingPhases, setLoadingPhases] = useState<boolean>(true);
    const [documentTxFields, setDocumentTxFields] = useState<EditableField[]>(approbalTxFields);
    const [docTxValues, setDocTxValues] = useState<Record<string, any>>({ ...initialapprobalTx });

    const [programJson, setProgramJson] = useState<Record<string, any>>({ ...initialProgram });

    const activeWallet = useActiveAccount();
    const wAddress = activeWallet?.address as `0x${string}` ?? ZERO_ADDRESS;
    const documentContract = getDocumentContract(contractTo);

    const loadPhases = useCallback(async () => {
        setLoadingPhases(true);
        try {
            const programData = await getProgramByProcessAddress(contractTo);
            if (programData) setProgramJson(programData);
            console.log("SettingProgram Data:", programData);

            const processPhases = programData.phases.map((phase: any) => phase.phasename);
            if (processPhases) setPhases(processPhases);

            const currentDocumentPhase = processData.state;
            setDocTxValues(prevValues => ({
                ...prevValues,
                phase: currentDocumentPhase,
            }));

            console.log("Loaded phases of the process:", processPhases);
            console.log("Current phase of the process:", currentDocumentPhase);

            const phaseData = programData.phases.find(({ phasename }: { phasename: string }) =>
                phasename.toLowerCase().includes(currentDocumentPhase.toLowerCase())
            );
            const actionNew = (user === "reviewer")
                ? (phaseData.initializer === "owner")
                    ? "responder"
                    : ((await getWalletByRole(phaseData.initializer as string)) === wAddress)
                        ? "initializer"
                        : "responder"
                : (phaseData.initializer === "owner")
                    ? "initializer"
                    : "responder";

            setIsInitializer(actionNew === "initializer");
            console.log("Action new is", actionNew);
            const formatKey = user === "evaluator" ? "evaluation" :
                actionNew === "responder" ? "response" : "initial";
            console.log("Formatkey", formatKey);

            if (formatKey) {
                const processSupportText = programData.phases
                    .find((phase: any) => phase.phasename === processData.state)?.format[formatKey];
                if (processSupportText) {
                    setSupportingText(processSupportText);
                }
                console.log("process Support text is", processSupportText);

            }
            if (processPhases) setPhases(processPhases);

        } catch (error) {
            console.error("Error loading phases:", error);
        }
        finally {
            setLoadingPhases(false);
        }
    }, [contractTo]);

    useEffect(() => {
        loadPhases();
    }, [loadPhases]);

    useEffect(() => {
        if (!supportingText) return;
        const documentTxFieldsPhases = approbalTxFields.map(field =>
            field.key === "associatedLink"
                ? {
                    ...field,
                    suppportingText: supportingText
                        ? `Agrega como documento ${supportingText}`
                        : undefined
                }
                : field
        );
        setDocumentTxFields(
            (["student", "reviewer"].includes(user))
                ? documentTxFieldsPhases.filter(field => field.key !== "state")
                : documentTxFieldsPhases
        );
    }, [phases, user, supportingText]);

    //GETTING FUNCTIONS

    //TRANSACTIONS GETTER
    const getTransactionChangeState = (currentPhase: string) => {
        return prepareContractCall({
            contract: getDocumentContract(contractTo),
            method: "setContractState",
            params: [phases[phases.indexOf(currentPhase) + 1]],
        }) as PreparedTransaction;
    };

    const getTransactionAddAssociatedProcess = (
        owner: string, associationType: number, associationName: string) => {
        return prepareContractCall({
            contract: mainContract,
            method: "addAssociatedProcess",
            params: [owner, associationType, associationName, contractTo],
        }) as PreparedTransaction;
    };

    const getTransactionAddReview = (owner: string) => {
        return getTransactionAddAssociatedProcess(owner, 3, "review");
    };

    const getTransactionRemoveAssociatedProcess = (owner: string, associationType: number) => {
        return prepareContractCall({
            contract: mainContract,
            method: "removeAssociatedProcess",
            params: [owner, associationType, contractTo],
        }) as PreparedTransaction;
    };

    // GETTERS

    const getPhaseData = (phase: string) => {
        return programJson["phases"].find((phaseJson: Record<string, any>) =>
            phaseJson.phasename.toLowerCase().includes(phase.toLowerCase())
        );
    };

    const getEmailByRole = (role: string) => {
        return programJson["mails"].find((mail: Record<string, any>) =>
            mail.role.toLowerCase().includes(role.toLowerCase())
        ).email;
    };

    const getWalletByRole = async (role: string) => {
        return await getWalletAddress(getEmailByRole(role) as string);
    }

    //FUNCTIONS ON PROCESS DOCUMENTS

    const evaluateDocument = async (initialTx: PreparedTransaction, state: string) => {
        console.log("Evaluating document asociated with state", state);

        try {
            const removeTransaction = getTransactionRemoveAssociatedProcess(wAddress, 1);

            if (["Correcciones", "Rechazado"].includes(state)) {
                console.log("Removing evaluator from pending without sign");
                sendBatchTransaction([initialTx, removeTransaction]);
            } else {
                signConfirmation([initialTx, removeTransaction], state);
            }
        } catch (error) {
            console.error("Error during document evaluation:", error);
        }
    };

    const signConfirmation = async (initialTxs: PreparedTransaction[], state: string) => {
        console.log("Multi-signature approval section, status is", state);
        const transactions = [...initialTxs];
        try {
            const multiSignAddress = await getPendingEvaluations(wAddress, contractTo);
            if (multiSignAddress.length > 10 && multiSignAddress != ZERO_ADDRESS) {
                console.log("The address has been validated and the approval is signed");
                const multiSignContract = getMultisignContract(multiSignAddress);
                const currentPhase = await getContractState(contractTo);
                const pendingSigners = await getPendingSigners(multiSignAddress);
                const newState = state === "Aprobado"
                    ? phases[phases.indexOf(currentPhase) + 1]
                    : currentPhase;
                console.log(`Attempting to transition from ${currentPhase} to ${newState}`);

                const txSign = prepareContractCall({
                    contract: multiSignContract,
                    method: "confirmTransaction",
                    params: [newState],
                }) as PreparedTransaction;

                transactions.push(txSign);

                if (pendingSigners.length === 1) {
                    console.log("Last participant may have to send the tx to the next one");

                    const currentIndex = phases.indexOf(currentPhase);

                    if (currentIndex >= 0 && currentIndex < (phases.length - 1)) {
                        const nextPhaseData = getPhaseData(phases[currentIndex + 1]);

                        if (nextPhaseData.initializer != "owner") {
                            console.log("Sending the process to the next one");
                            const addressTo = await getWalletByRole(
                                nextPhaseData.initializer as string
                            );
                            const txAsignReview = getTransactionAddReview(addressTo);
                            transactions.push(txAsignReview);
                        }
                    }
                }
                sendBatchTransaction(transactions);
            }
        } catch (error) {
            console.error("Error during sign confirmation:", error);
        }
    };

    const AssignRespond = async (
        initialTx: PreparedTransaction, phase: string, owner: string, phaseData: any
    ) => {
        try {
            console.log("Assigning replies rquired to the responder with parameters:",
                phase, owner, phaseData, initialTx);
            const transactions = [initialTx];

            if (phaseData.requireAsignation) {
                console.log("Requesting assignment");
                const assignTransactions = await getRequestAssignmentTransactions(owner, phase);
                transactions.push(...assignTransactions);
            }

            if (phaseData.requireDocumentResponse) {
                console.log("Requesting document reviewing");
                const reviewTransaction = getTransactionAddReview(owner);
                transactions.push(reviewTransaction);
            }

            if (transactions.length === 1) {
                console.log("Phase don't need more actions, changing state");
                transactions.push(getTransactionChangeState(phase));

                const nextPhaseData = getPhaseData(phases[phases.indexOf(phase) + 1]);

                if (nextPhaseData.initializer != "owner") {
                    console.log("Sending the process to the next one");
                    const addressTo = await getWalletByRole(nextPhaseData.initializer as string);

                    const txAsignReview = getTransactionAddReview(addressTo);
                    transactions.push(txAsignReview);
                }
            }

            if (user === "reviewer") {
                console.log("Removing fron reviews list");
                const removeTransaction = getTransactionRemoveAssociatedProcess(wAddress, 3);
                transactions.push(removeTransaction);
            }

            console.log("All transactions to send:", transactions);
            sendBatchTransaction(transactions);

        } catch (error) {
            console.error("Error during request assignation:", error);
        }
    };

    const getRequestAssignmentTransactions = async (owner: string, phase: string) => {
        try {
            console.log("You have entered the requestAssignment section");

            const phaseMultisign = await getPhaseMultisign(contractTo, phase);
            console.log("Phases and multisign associated", phaseMultisign);
            if (phaseMultisign.length > 0) {
                console.log("A previous assignment has already been made");
                const pendingSigners = await getPendingSigners(phaseMultisign.slice(-1)[0]);

                if (pendingSigners.length > 0) {
                    console.log("Pending signers found:", pendingSigners);
                    const transactions = pendingSigners.map((evaluator) => {
                        //Se añade cada evaluador pendiente a la lista general
                        return getTransactionAddAssociatedProcess(evaluator, 1, "evaluate")
                    })
                    return ([...transactions]);
                }
            }

            console.log("Requesting assignment creation");

            const assignTransaction = prepareContractCall({
                contract: mainContract,
                method: "addAssociatedProcess",
                params: [owner, 2, "assignate", contractTo],
            }) as PreparedTransaction;
            return ([assignTransaction]);
        } catch (error) {
            console.error("Error during request assignation:", error);
            return [];
        }
    };

    const sendNotification = async (receiver: string, associatedLink: string) => {
        try {

            const notificationMail = receiver === "owner"
                ? await getDirectorEmail(contractTo)
                : getEmailByRole(receiver);

            const notificationName = await getUserName(await getWalletAddress(notificationMail));
            const resolvedLink = resolveAddress(associatedLink);
            const ownMail = await getEmailAddress(wAddress);

            sendNotificationToUser(
                {
                    email: notificationMail,
                    firstName: notificationName,
                    uploadDate: getCurrentDate(),
                    documentLink: resolvedLink,
                    documentTitle: processData.processName,
                    documentType: processData.program,
                    uploadedBy: ownMail
                });
            console.log("Sending a notification to responder");

        } catch (error) {
            console.error(error)
        }
    }

    const addTransaction = async (newJson: Record<string, any>) => {

        const { associatedLink, comments, phase } = newJson;
        const state = (["student", "reviewer"].includes(user)) ? "Subido" : newJson.state;
        const date = getCurrentDate();

        const transaction = prepareContractCall({
            contract: documentContract,
            method: "addTransaction",
            params: [phase, state, associatedLink, comments, date],
        }) as PreparedTransaction;

        console.log("Document transaction to add params:",
            phase, state, associatedLink, comments, date);

        const phaseData = getPhaseData(phase);

        try {

            if (["student", "reviewer"].includes(user)) {
                if (isInitializer) {
                    const responder = phaseData?.responder
                    if (phaseData && responder) {
                        const addressTo = await getWalletByRole(responder as string);
                        sendNotification(responder, associatedLink);
                        AssignRespond(transaction, phase, addressTo, phaseData);
                    }
                } else {
                    const transactionsToSend = [
                        transaction,
                        getTransactionRemoveAssociatedProcess(wAddress, 3)
                    ];

                    if (!phaseData.requireAsignation) {
                        const transactionChangeState = getTransactionChangeState(phase);
                        console.log(`Add transaction to change state since it does
                            not require an assignment`);
                        transactionsToSend.push(transactionChangeState);

                        const { initializer } = getPhaseData(phases[phases.indexOf(phase) + 1]);

                        if (initializer != "owner") {
                            const addressTo = await getWalletByRole(initializer as string);
                            transactionsToSend.push(getTransactionAddReview(addressTo));
                            sendNotification(initializer as string, associatedLink);
                            console.log("Adding to reviews list to the next initializer");
                        } else {
                            sendNotification("owner", associatedLink);
                        }
                    }
                    console.log("Sending transactions:", transactionsToSend);
                    sendBatchTransaction(transactionsToSend);
                }
            } else if (user === "evaluator") {
                sendNotification("owner", associatedLink);
                evaluateDocument(transaction, state);
            } else {
                sendBatchTransaction([transaction]);
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
        } finally {
            changeVisibilityEdit();
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg mb-4">
            {phases && !loadingPhases && (
                <JsonForm
                    title={
                        ["student", "reviewer"].includes(user)
                            ? "Añadir documento al proceso de Grado"
                            : "Evaluar proceso de Grado"
                    }
                    json={docTxValues}
                    formFields={documentTxFields}
                    onSaveChanges={addTransaction}
                    onExit={changeVisibilityEdit}
                />
            )}
        </div>
    );
}