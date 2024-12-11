"use client";

import Link from "next/link";
import { Inbox, BookOpenCheck, FileText, Cpu, User, View } from "lucide-react";
import { useAuth } from "@/context/context";
import UserItem from "./UserItem";
import Logout from "./Logout";
import {
  allowedToAssignments,
  allowedToEvaluations,
  allowedToProcesses,
  allowedToPrograms,
  allowedToReviews,
  allowedToUsers,
  userOption,
} from "@/utils/usersConstants";

const menuItems = [
  {
    link: "/structure",
    icon: <Cpu />,
    text: "Gestión de Programas",
    role: allowedToPrograms,
  },
  {
    link: "/users",
    icon: <User />,
    text: "Gestión de Usuarios",
    role: allowedToUsers,
  },
  {
    link: "/assignments",
    icon: <Inbox />,
    text: "Asignaciones",
    role: allowedToAssignments,
  },
  {
    link: "/evaluations",
    icon: <BookOpenCheck />,
    text: "Evaluaciones",
    role: allowedToEvaluations,
  },
  {
    link: "/revisiones",
    icon: <View />,
    text: "Revisiones",
    role: allowedToReviews,
  },
  {
    link: "/process",
    icon: <FileText />,
    text: "Procesos Activos",
    role: allowedToProcesses,
  },
];

export default function Sidebar() {
  const { role } = useAuth();

  return (
    <div className="flex flex-col w-[300px] min-w-[300px] h-full md:h-screen
      p-4 border-r bg-white shadow-lg">
      <UserItem />
      <div className="flex-grow mt-5 overflow-auto">
        {menuItems
          .filter((item) => item.role.includes(role as userOption))
          .map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="flex items-center gap-3 px-3 py-1 mb-2 text-sm rounded-md
              hover:bg-gray-200 focus:bg-gray-300 focus:outline-none transition-colors"
            >
              <span>{item.icon}</span>
              {item.text}
            </Link>
          ))}
      </div>
      <Logout />
    </div>
  );
}
