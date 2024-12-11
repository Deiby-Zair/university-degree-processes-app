'use client';

import React from "react";
import { useAuth } from "../context/context";
import Login from "../components/Login";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (<FullScreenLoader />) : (<Login />)
}