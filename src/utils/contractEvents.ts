import { getContractEvents, prepareEvent } from "thirdweb";
import { getDocumentContract, mainContract } from "./contracts";
import { getNumConfirmations } from "./contractInteract";

export const getAllEvents = async (contractTo: string) => {
    const events = await getContractEvents({
        contract: getDocumentContract(contractTo),
        blockRange: BigInt(500000),
    });
    return events;
};

export const getDocTransactionsEvents = async (contractTo: string) => {
    const preparedEvent = prepareEvent({
        signature: "event TransactionAdded(string phase, address indexed signer, string state, string associatedLink, string comments, string date)"
    });
    const transactionsEvents = await getContractEvents({
        contract: getDocumentContract(contractTo),
        blockRange: BigInt(500000),
        events: [preparedEvent],
    });
    return transactionsEvents;
};

export const getPhasesNumberConfirmations = async (contractTo: string) => {
    const preparedEvent = prepareEvent({
        signature: "event multisignAssignment(address indexed processContract, string phase, address multisignContract)",
        filters: { processContract: contractTo }
    });

    const events = await getContractEvents({
        contract: mainContract,
        blockRange: BigInt(500000),
        events: [preparedEvent],
    });

    const datosVector: Record<string, any>[] = [];
    if (events) {
        await Promise.all(
            events.map(async (event) => {
                const eventObject = event.args as Record<string, any>;
                eventObject.numConfirmations = await getNumConfirmations(eventObject.multisignContract);
                datosVector.push(eventObject);
            }))
    }
    return datosVector;
};

export const getPhaseMultisign = async (processContract: string, phase: string) => {
    const preparedEvent = prepareEvent({
        signature: "event multisignAssignment(address indexed processContract, string phase, address multisignContract)",
        filters: { processContract }
    });

    const events = await getContractEvents({
        contract: mainContract,
        blockRange: BigInt(500000),
        events: [preparedEvent],
    });

    return events
        .filter(event => event.args.phase === phase)
        .map(event => event.args.multisignContract);
};