import { createThirdwebClient, defineChain } from "thirdweb";

export const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
});

export const CHAIN = defineChain(11155111);

export const ACCOUNT_FACTORY_ADDRESS = process.env.ACCOUNT_FACTORY_ADDRESS as string;
export const USERS_DIRECTORY_ADDRESS = process.env.USERS_DIRECTORY_ADDRESS as string;
export const PROCESS_MANAGEMENT_ADDRESS = process.env.PROCESS_MANAGEMENT_ADDRESS as string;