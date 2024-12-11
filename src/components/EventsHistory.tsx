'use client';

import { useContractEvents } from "thirdweb/react";
import { useCallback, useEffect, useState } from "react";

import { GroupedCard } from "./GroupedCard";
import { getDocumentContract } from "@/utils/contracts";
import { useGetDocEvents } from "@/utils/getDocumentData";
import { getAllParticipantsDetails, getProcessPhasesByAddress } from "@/utils/contractInteract";
import { getDocTransactionsEvents, getPhasesNumberConfirmations } from "@/utils/contractEvents";

export function EventsHistory({ contractTo }: { contractTo: string }) {
    const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

    const documentContract = getDocumentContract(contractTo);
    const { data: events, loading, error } = useGetDocEvents(contractTo, shouldUpdate);

    const [phases, setPhases] = useState<string[]>([]);
    const [loadingPhases, setLoadingPhases] = useState<boolean>(true);
    const [participants, setParticipants] = useState<Record<string, any>[]>([]);
    const [phasesConfirmations, setPhasesConfirmations] = useState<Record<string, any>[]>([]);

    //READ BLOCKCHAIN
    const { data: contractEvents } = useContractEvents({
        contract: documentContract,
        blockRange: 500000 //5806228
    });
    //https://portal.thirdweb.com/typescript/v4/interact

    const loadPhases = useCallback(async () => {
        setLoadingPhases(true);
        try {
            const processPhases = await getProcessPhasesByAddress(contractTo);
            if (processPhases) setPhases(processPhases);
            console.log("Loaded phases of the process:", processPhases);
            const participants = await getAllParticipantsDetails(contractTo);
            setParticipants(participants);
            setPhasesConfirmations(await getPhasesNumberConfirmations(contractTo));
        } catch (error) {
            console.error("Error loading phases:", error);
        }
        finally {
            setLoadingPhases(false);
            getDocTransactionsEvents(contractTo);
        }
    }, [contractTo]);

    useEffect(() => {
        loadPhases();
    }, [loadPhases]);

    useEffect(() => {
        setShouldUpdate(prevShouldUpdate => !prevShouldUpdate);
        console.log("Updating...");
    }, [contractEvents]);

    return loading ? (
        <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <p>Loading....</p>
            {error && <p>Error al obtener los procesos...</p>}
        </div>
    ) : (
        <div>
            {!error && events &&
                <div>
                    <GroupedCard groups={['student', 'director', 'codirector']}
                        groupsNames={["Estudiante(s)", "Director", "Codirector(es)"]}
                        json={participants}
                        indicator="role" />
                    {events.length > 0 && phases && !loadingPhases &&
                        <div>
                            <h2 className="text-lg font-bold text-center">Documentos Asociados</h2>
                            <GroupedCard
                                groups={phases}
                                groupsNames={phases}
                                json={events}
                                indicator="phase"
                                PhasesNumberConfirmations={phasesConfirmations}
                            />
                        </div>
                    }
                    {events.length == 0 &&
                        <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-2xl">
                            <p>
                                Aún no hay documentos asociados a {contractTo}
                            </p>
                        </div>
                    }
                </div>
            }
            {error && <p>Error al obtener los procesos...</p>}
        </div >
    )
}