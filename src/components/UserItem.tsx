'use client';

import { useEffect, useState } from "react";
import { useActiveWallet } from "thirdweb/react";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/context";
import { client } from "@/utils/constants";
import { getUserName } from "@/utils/contractInteract";

export default function UserItem() {

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");

  const activeWallet = useActiveWallet();
  const wAddress = activeWallet?.getAccount()?.address as string ?? '';

  useEffect(() => {
    const emailInApp = async () => {
      try {
        const name = await getUserName(wAddress);
        const email1 = await getUserEmail({ client });
        const email = email1 ? email1 : "";
        setUserName(name);
        setEmail(email);
        setUser(email[0].toUpperCase());
      }
      catch (error) {
        console.error("Error obtaining user data:", error);
      }
    };
    emailInApp();
  }, [email, wAddress, setUserName, setEmail, setUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      console.log("logging out from User");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="border rounded-[8px] p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="avatar rounded-full min-h-10 min-w-10 bg-indigo-900
        text-white font-[700] flex items-center justify-center">
          <p>{user}</p>
        </div>
        <div className="grow">
          <p className="text-[14px] font-bold">{userName}</p>
          <p className="text-[12px] font-bold">{email}</p>
        </div>
      </div>
      <p className="text-[10px] text-neutral-500 mt-1">{wAddress}</p>
    </div>
  )
}