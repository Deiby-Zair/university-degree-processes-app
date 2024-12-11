import { prepareContractCall, sendTransaction } from "thirdweb";
import { Account, inAppWallet, smartWallet } from "thirdweb/wallets";
import { isContractDeployed } from "thirdweb/utils";
import { getContract } from "thirdweb/contract";

import { cyph } from "./cypher";
import { usersContract } from "./contracts";
import { getEmailAddress } from "./contractInteract";
import { ACCOUNT_FACTORY_ADDRESS, CHAIN, client } from "./constants";

export const connectInAppWallet = async (personalAccount: Account, setWallet: Function) => {
    try {
        const wallet = smartWallet({
            factoryAddress: ACCOUNT_FACTORY_ADDRESS,
            chain: CHAIN,
            gasless: true,
        });

        console.log("Smart Wallet", wallet);

        const account = await wallet.connect({
            client,
            personalAccount,
        });
        setWallet(wallet);
        return account;
    } catch (error) {
        console.error("Error connecting inApp wallet:", error);
    }
};

export const createSmartWallet = async (setWallet: Function) => {
    try {
        const personalWallet = inAppWallet();
        const personalAccount = await personalWallet.connect({
            client,
            chain: CHAIN,
            strategy: "google",
        });

        console.log("Personal Embedded Wallet Account", personalAccount);

        return [await connectInAppWallet(personalAccount, setWallet), personalAccount];
    } catch (error) {
        console.error("Error creating smart wallet:", error);
        return [undefined, undefined];
    }
};

export const connectSmartWallet = async (accountAddress: string) => {
    console.log("Wallet address:", accountAddress);

    const contract = getContract({
        client,
        chain: CHAIN,
        address: accountAddress
    });

    console.log("Contract for Smart Wallet", contract);

    const isDeployed = await isContractDeployed(contract);
    const isAccountCreated = await getEmailAddress(contract.address);
    return (isDeployed && isAccountCreated);
};

export const createAccount = async (account: Account, newJson: Record<string, any>) => {
    const { email, name, role } = newJson;
    const transaction = prepareContractCall({
        contract: usersContract,
        method: "addUser",
        params: [account.address, cyph(email), cyph(name), role],
    });

    const transactionResult = await sendTransaction({ account, transaction });
    console.log(transaction, transactionResult);
};