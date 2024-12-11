'use client';

import { PreparedTransaction, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { useState } from "react";

import { useAuth } from "@/context/context";
import { JsonForm } from "@/components/JsonForm";
import {
    fullUserFields, initialFullUser,
    initialWalletRole, walletRoleFields
} from "@/utils/requiredFields";
import FullScreenLoader from "@/components/FullScreenLoader";
import { allowedToUsers, userOption } from "@/utils/usersConstants";
import { getFullUser } from "@/utils/contractInteract";
import { usersContract } from "@/utils/contracts";
import { cyph } from "@/utils/cypher";

export default function Home() {
    const { isAuthenticated, role } = useAuth();

    const [activeTab, setActiveTab] = useState(0);
    const [userToShow, setUserToShow] = useState([""]);

    //SEND TRANSACTIONS
    const { mutate: sendTransaction } = useSendTransaction();

    const addUser = (newJson: Record<string, any>) => {
        const { walletAddress, email, name, role } = newJson
        const transaction = prepareContractCall({
            contract: usersContract,
            method: "addUser",
            params: [walletAddress, cyph(email), cyph(name), role],
        }) as PreparedTransaction;
        sendTransaction(transaction);
    };

    const setUserRole = (newJson: Record<string, any>): void => {
        const { role, userArray } = newJson;
        const transaction = prepareContractCall({
            contract: usersContract,
            method: "setUserRole",
            params: [userArray[0], role],
        }) as PreparedTransaction;
        sendTransaction(transaction);
    };

    const getUser = async (newJson: Record<string, any>) => {
        const { userArray } = newJson;
        const fulluser = await getFullUser(userArray[0]);
        console.log("FULLUSER", fulluser);
        setUserToShow(fulluser);
    };

    const deleteUser = (newJson: Record<string, any>): void => {
        const { userArray } = newJson;
        const transaction = prepareContractCall({
            contract: usersContract,
            method: "deleteUser",
            params: [userArray[0]],
        }) as PreparedTransaction;
        sendTransaction(transaction);
    };

    const tabs = [
        {
            title: "Consultar Usuario",
            component:
                <div>
                    <JsonForm
                        title="Consultar Usuario"
                        formFields={[walletRoleFields[0]]}
                        json={initialWalletRole}
                        onExit={() => { }}
                        onSaveChanges={getUser}
                    />

                    {userToShow.map((user) => (
                        <div>
                            {Array.isArray(user)
                                ? user.map((us, index) => <p key={index}>{us}</p>)
                                : <p>{user}</p>
                            }
                        </div>
                    ))}
                </div>
        },
        {
            title: "Cambiar Rol de Usuario",
            component:
                <JsonForm
                    title="Cambiar Rol de Usuario"
                    formFields={walletRoleFields}
                    json={initialWalletRole}
                    onExit={() => { }}
                    onSaveChanges={setUserRole}
                />
        },
        {
            title: "Añadir usuario a la aplicación",
            component:
                <JsonForm
                    title="Añadir usuario a la aplicación"
                    formFields={fullUserFields}
                    json={initialFullUser}
                    onExit={() => { }}
                    onSaveChanges={addUser}
                />
        },
        {
            title: "Eliminar usuario de la aplicación",
            component:
                <JsonForm
                    title="Eliminar usuario de la aplicación"
                    formFields={[walletRoleFields[0]]}
                    json={initialWalletRole}
                    onExit={() => { }}
                    onSaveChanges={deleteUser}
                />
        },
    ];

    return (isAuthenticated && allowedToUsers.includes(role as userOption)) ? (
        <div className="w-full">
            <div className="flex border-b">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`p-2 ${activeTab === index
                            ? 'border-b-2 border-blue-500'
                            : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-gray-100 rounded-lg mb-4">
                {tabs[activeTab].component}
            </div>
        </div >
    ) : (
        <FullScreenLoader />
    );
}