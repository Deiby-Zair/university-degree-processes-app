import { readContract, ZERO_ADDRESS } from "thirdweb";
import { getDocumentContract, getMultisignContract, mainContract, usersContract } from "./contracts";
import { cyph, decyph } from "./cypher";
import { parseJsonString } from "./json";
import { ProcessDetails, ProgramDetails } from "./types";

//Users Contract

export const getFullUser = async (wallet: string): Promise<any[]> => {
    const user = await readContract({
        contract: usersContract,
        method: "getFullUser",
        params: [wallet],
    });
    return [wallet,
        decyph(user[0]),
        decyph(user[1]),
        user[2],
        await getCurrentProcesses(wallet as `0x${string}`)
    ];
};

export const getWalletAddress = async (email: string): Promise<`0x${string}`> => {
    const walletAddress = await readContract({
        contract: usersContract,
        method: "getUserByEmail",
        params: [cyph(email)],
    });
    return walletAddress as `0x${string}`;
};

export const getEmailAddress = async (wallet: string): Promise<string> => {
    const emailAddress = await readContract({
        contract: usersContract,
        method: "getUserByWallet",
        params: [wallet],
    });
    return decyph(emailAddress);
};

export const getUserName = async (wallet: string): Promise<string> => {
    const userRole = await readContract({
        contract: usersContract,
        method: "getFullUser",
        params: [wallet],
    });

    return decyph(userRole[1]);
};

export const getUserNameByEmail = async (email: string): Promise<string> => {
    return await getUserName(await getWalletAddress(email));
};

export const getUserRole = async (wallet: string): Promise<string> => {
    const userRole = await readContract({
        contract: usersContract,
        method: "getFullUser",
        params: [wallet],
    });

    return userRole[2];
};

export const getOwnersWallets = async (owners: string[]): Promise<[`0x${string}`[], string[]]> => {

    const ownersArrayToSend: `0x${string}`[] = [];
    const invalidAddresses: string[] = [];

    await Promise.all(
        owners.filter(Boolean).map(async (owner) => {
            const address = await getWalletAddress(owner);
            if (address && address != ZERO_ADDRESS) {
                ownersArrayToSend.push(address);
            }
            else {
                invalidAddresses.push(owner);
            }
        })
    );

    return [ownersArrayToSend, invalidAddresses];
};

//Master Contract

export const getCurrentProcesses = async (wAddress: `0x${string}`): Promise<string[]> => {
    const currentProcesses = await readContract({
        contract: mainContract,
        method: "getAssociatedProcesses",
        params: [wAddress, 0],
    });
    return currentProcesses as string[];
};

export const getAllPendingEvaluations = async (account: `0x${string}`): Promise<string[]> => {
    const pendingEvaluations = await readContract({
        contract: mainContract,
        method: "getAssociatedProcesses",
        params: [account, 1],
    });
    return pendingEvaluations as string[];
};

export const getPendingEvaluations = async (
    account: `0x${string}`,
    contractTo: `0x${string}`
): Promise<string> => {
    const pendingEvaluations = await readContract({
        contract: mainContract,
        method: "getPendingEvaluations",
        params: [account, contractTo],
    });
    return pendingEvaluations;
};

export const getAllProcessesToAssign = async (account: `0x${string}`): Promise<string[]> => {
    const allPendingProcesses = await readContract({
        contract: mainContract,
        method: "getAssociatedProcesses",
        params: [account, 2],
    });
    return allPendingProcesses as string[];
};

export const getAllPendingReviews = async (account: `0x${string}`): Promise<string[]> => {
    const pendingEvaluations = await readContract({
        contract: mainContract,
        method: "getAssociatedProcesses",
        params: [account, 3],
    });
    return pendingEvaluations as string[];
};

export const getProgramById = async (id: string): Promise<string> => {
    const process = await readContract({
        contract: mainContract,
        method: "getProgram",
        params: [id],
    });
    return decyph(process);
};

export const getProgramJsonById = async (id: string): Promise<any> => {
    return parseJsonString(await getProgramById(id));
};

export const getProgramByProcessAddress = async (contractTo: string): Promise<any> => {
    return await getProgramJsonById(await getContractProcessId(contractTo));
};

export const getProcessPhasesById = async (processId: string): Promise<string[]> => {
    const processPhasesJson = await getProgramJsonById(processId);
    return processPhasesJson.phases.map((phase: any) => phase.phasename);
};

export const getFirstProcessPhaseById = async (processId: string): Promise<string> => {
    const processPhasesJson = await getProgramJsonById(processId);
    if (processPhasesJson.phases.length > 0) {
        return processPhasesJson.phases[0].phasename;
    }
    return "";
};

// Document Contract

export const getProcessName = async (contractTo: string): Promise<string> => {
    const processContract = getDocumentContract(contractTo);
    const processName = await readContract({
        contract: processContract,
        method: "getProcessName",
        params: [],
    });
    return processName;
};

export const getContractState = async (contractTo: string): Promise<string> => {
    const processContract = getDocumentContract(contractTo);
    const contractState = await readContract({
        contract: processContract,
        method: "getContractState",
        params: [],
    });
    return contractState;
};

export const getContractProcessId = async (contractTo: string): Promise<string> => {
    const processContract = getDocumentContract(contractTo);
    const contractProcessId = await readContract({
        contract: processContract,
        method: "getContractProcessId",
        params: [],
    });
    return contractProcessId;
};

export const getProcessDetails = async (process: string): Promise<ProcessDetails> => {
    try {
        const [contractProcessId, contractState, processName] = await Promise.all([
            getContractProcessId(process),
            getContractState(process),
            getProcessName(process),
        ]);

        const programJson = await getProgramJsonById(contractProcessId);

        return {
            address: process,
            state: contractState,
            program: programJson.name,
            modality: programJson.modality,
            processName: processName,
        };
    } catch (error) {
        console.error(`Error fetching process details for process ${process}:`, error);
        throw new Error(`Failed to retrieve process details for ${process}`);
    }
};

export const getProcessPhasesByAddress = async (contractTo: string): Promise<string[]> => {
    const processId = await getContractProcessId(contractTo);
    return getProcessPhasesById(processId);
};

export const getParticipant = async (contractTo: string, wallet: `0x${string}`): Promise<string> => {
    const participant = await readContract({
        contract: getDocumentContract(contractTo),
        method: "getParticipant",
        params: [wallet],
    });
    return participant;
};

export const getAllParticipantAddresses = async (contractTo: string): Promise<`0x${string}`[]> => {
    const participants = await readContract({
        contract: getDocumentContract(contractTo),
        method: "getAllParticipantAddresses",
        params: [],
    });
    return participants as `0x${string}`[];
};

export const getAllParticipantsDetails = async (
    contractTo: string
): Promise<Record<string, any>[]> => {
    const participantsDetails: Record<string, any>[] = [];
    const participants = await getAllParticipantAddresses(contractTo);

    await Promise.all(
        participants.map(async (participant) => {
            const participantEmail = await getEmailAddress(participant);
            const participantName = await getUserName(participant);
            const participantRole = await getParticipant(contractTo, participant);
            if (participantEmail && participantEmail != "") {
                participantsDetails.push(
                    {
                        email: participantEmail,
                        name: participantName,
                        role: participantRole
                    })
            }
        })
    );
    return participantsDetails;
};

export const getDirectorEmail = async (contractTo: string) => {
    const participantDetails = await getAllParticipantsDetails(contractTo);
    const director = participantDetails.find(participant => participant.role == "director");
    return director?.email as string || "";
}

//Multisign Contract

export const getAllSigners = async (multisignContract: string): Promise<string[]> => {
    const allSigners = await readContract({
        contract: getMultisignContract(multisignContract),
        method: "getAllSigners",
        params: [],
    });
    return allSigners as string[];
};

export const getIsConfirmed = async (multisignContract: string, wallet: string): Promise<boolean> => {
    const isConfirmed = await readContract({
        contract: getMultisignContract(multisignContract),
        method: "isConfirmed",
        params: [wallet],
    });
    console.log("For multisign contract", multisignContract, "owner", wallet, "return", isConfirmed);
    return isConfirmed;
};

export const getPhase = async (contractTo: string): Promise<string> => {
    const multisignContract = getMultisignContract(contractTo);
    const phase = await readContract({
        contract: multisignContract,
        method: "phase",
        params: [],
    });
    return phase;
};

export const getNumConfirmations = async (contractTo: string): Promise<number> => {
    const multisignContract = getMultisignContract(contractTo);
    const numConfirmations = await readContract({
        contract: multisignContract,
        method: "numConfirmationsRequired",
        params: [],
    });
    return Number(numConfirmations);
};

export const getTargetContract = async (multisignAddress: string): Promise<string> => {
    const multisignContract = getMultisignContract(multisignAddress);
    const targetContract = await readContract({
        contract: multisignContract,
        method: "targetContract",
        params: [],
    });
    return targetContract;
};

export const getPendingSigners = async (multiSignContract: string): Promise<string[]> => {
    const signers = await getAllSigners(multiSignContract);

    const pendingSigners = await Promise.all(
        signers.map(async signer => {
            const isConfirmed = await getIsConfirmed(multiSignContract, signer);
            return !isConfirmed ? signer : null;
        })
    );

    const filteredPendingSigners = pendingSigners.filter((signer): signer is string => signer !== null);

    console.log("Owners: ", signers);
    console.log("Pending signers: ", filteredPendingSigners);
    return filteredPendingSigners;
};