'use client';

import { upload, resolveScheme } from "thirdweb/storage";
import { useEffect, useState } from "react";

import FileUpload from "./FileUpload";
import { IpfsProps } from "@/utils/types";
import { client } from "@/utils/constants";

export const resolveAddress = (uri: string): string => {
    try {
        const resolved = resolveScheme({ client, uri });
        return resolved;
    }
    catch (error) {
        console.error("Error obtaining url resolved:", error)
        return "";
    }
};

export const Ipfs = ({ sendLinkToData, field, isLoading, setIsLoading }: IpfsProps) => {
    const [filesToUpload, setfilesToUpload] = useState<File[]>([]);
    const [prevFilesToUpload, setprevFilesToUpload] = useState<File[]>([]);

    useEffect(() => {
        if ((prevFilesToUpload == filesToUpload) || (filesToUpload.length <= 0)) return;

        const handleUpload = async () => {
            setIsLoading(true);
            try {
                const _uris = await upload({ client, files: filesToUpload });
                sendLinkToData([field.key], _uris);
            } catch (error) {
                console.error("Error uploading to IPFS:", error);
            } finally {
                setIsLoading(false);
            }
        }
        setprevFilesToUpload(filesToUpload);
        handleUpload();
    }, [filesToUpload, prevFilesToUpload, sendLinkToData, setIsLoading]);

    return (
        <FileUpload onFilesAdded={setfilesToUpload} isLoading={isLoading} field={field} />
    );
}