import { useState, useEffect } from 'react';
import {
    getAllParticipantAddresses,
    getAllPendingEvaluations,
    getAllPendingReviews,
    getAllProcessesToAssign,
    getCurrentProcesses,
    getProcessDetails,
} from './contractInteract';
import { getDocTransactionsEvents } from './contractEvents';
import { ProcessDetails } from './types';

interface AsyncData {
    data: Record<string, any>[] | null;
    loading: boolean;
    error: string | null;
}

export function useGetDocDataMyProcesses(wAddress: `0x${string}`, shouldUpdate: boolean): AsyncData {
    const [data, setData] = useState<ProcessDetails[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Updating the list of my processes");

        const loadMyProcessses = async () => {
            setLoading(true);
            setError(null);
            try {
                const processesArray = await getCurrentProcesses(wAddress);
                console.log("My obtained processes:", processesArray);
                if (processesArray) {
                    const myProcessesRecordArray = await Promise.all(
                        processesArray.map(async (process) => {
                            return await getProcessDetails(process);
                        })
                    );
                    setData(myProcessesRecordArray);
                }
            } catch (error) {
                setError("Error obteniendo los procesos");
            }
            finally {
                setLoading(false);
            }
        };

        loadMyProcessses();

    }, [wAddress, shouldUpdate]);
    return { data, loading, error };
}

export function useGetDocDataEvaluations(wAddress: `0x${string}`, shouldUpdate: boolean): AsyncData {
    const [data, setData] = useState<ProcessDetails[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Updating the list of my pending evaluations");

        const loadEvaluations = async () => {
            setLoading(true);
            setError(null);

            try {
                const processesArray = await getAllPendingEvaluations(wAddress);
                console.log("My pending evaluations:", processesArray);
                if (processesArray) {
                    const myProcessesRecordArray = await Promise.all(
                        processesArray.map(async (process) => {
                            return await getProcessDetails(process);
                        })
                    );
                    setData(myProcessesRecordArray);
                }
            } catch (error) {
                setError("Error obteniendo las evaluaciones pendientes");
            }
            finally {
                setLoading(false);
            }
        };

        loadEvaluations();

    }, [wAddress, shouldUpdate]);
    return { data, loading, error };
}

export function useGetDocDataReviews(wAddress: `0x${string}`, shouldUpdate: boolean): AsyncData {
    const [data, setData] = useState<ProcessDetails[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Updating the list of my pending evaluations");

        const loadEvaluations = async () => {
            setLoading(true);
            setError(null);

            try {
                const processesArray = await getAllPendingReviews(wAddress);
                console.log("My pending evaluations:", processesArray);
                if (processesArray) {
                    const myProcessesRecordArray = await Promise.all(
                        processesArray.map(async (process) => {
                            return await getProcessDetails(process);
                        })
                    );
                    setData(myProcessesRecordArray);
                }
            } catch (error) {
                setError("Error obteniendo las evaluaciones pendientes");
            }
            finally {
                setLoading(false);
            }
        };

        loadEvaluations();

    }, [wAddress, shouldUpdate]);
    return { data, loading, error };
}

export function useGetDocDataAssignments(wAddress: `0x${string}`, shouldUpdate: boolean): AsyncData {
    const [data, setData] = useState<ProcessDetails[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Updating the list of pending assignments");

        const loadAssignments = async () => {
            setLoading(true);
            setError(null);

            try {
                const processesArray = await getAllProcessesToAssign(wAddress);
                console.log("Pending assignments:", processesArray);
                if (processesArray) {
                    const myProcessesRecordArray = await Promise.all(
                        processesArray.map(async (process) => {
                            return await getProcessDetails(process);
                        })
                    );
                    setData(myProcessesRecordArray);
                }
            } catch (error) {
                setError("Error obteniendo las asignaciones pendientes");
            }
            finally {
                setLoading(false);
            }
        };

        loadAssignments();

    }, [shouldUpdate]);
    return { data, loading, error };
}

export function useGetDocEvents(contractTo: string, shouldUpdate: boolean): AsyncData {
    const [data, setData] = useState<Record<string, any>[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Updating the list of transaction events");

        const loadEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const eventsArray = await getDocTransactionsEvents(contractTo);
                const participants = await getAllParticipantAddresses(contractTo);

                console.log("Transaction events obtained:", eventsArray);

                if (eventsArray) {
                    const dataVector = eventsArray.map((event) => {
                        const eventObject = event.args as Record<string, any>;
                        eventObject.self = participants.includes(event.args.signer as `0x${string}`);
                        return eventObject;
                    })
                    setData(dataVector);
                }
            } catch (error) {
                setError("Error obteniendo los eventos");
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };

        loadEvents();

    }, [shouldUpdate, contractTo]);
    return { data, loading, error };
}