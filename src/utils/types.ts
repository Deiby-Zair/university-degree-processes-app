import { EditableField } from "@/utils/requiredFields";

export interface RowData {
    address: string;
    process: string;
    state: string;
}

export interface Column<T> {
    key: keyof T;
    title: string;
}

export interface Button<T> {
    icon: JSX.Element;
    onClick: Function;
    hoverText: string;
}

export interface AddButton {
    icon: JSX.Element;
    onClick: () => void;
    hoverText: string;
}

export interface TableProps<T> {
    title: string;
    columns: EditableField[];
    data: Record<string, any>[];
    buttons?: Button<T>[];
    addButton?: Button<T>;
}

export interface FormProps {
    json: Record<string, any>;
    formFields: EditableField[];
    onSaveChanges: (updatedJson: Record<string, any>) => void;
    onExit: Function;
    title?: string;
}

export interface DocumentTxProps {
    user: string,
    contractTo: `0x${string}`,
    processData: ProcessDetails,
    changeVisibilityEdit: Function,
    sendBatchTransaction: Function,
}

export interface IpfsProps {
    data: Record<string, any>,
    sendLinkToData: Function,
    field: EditableField,
    isLoading: boolean,
    setIsLoading: Function,
}

export interface EventsHistoryProps<T> {
    contractTo: string,
    action: Button<T>,
}

//Process Interfaces

export interface ProgramDetails {
    name: string;
    modality: string;
}

export interface ProcessDetails {
    address: string;
    state: string;
    program: string;
    modality: string;
    processName: string;
}

export const emptyProcessDetails = {
    address: "",
    state: "",
    program: "",
    modality: "",
    processName: "",
}