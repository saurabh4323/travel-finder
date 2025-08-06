"use client";
import React from "react";
import { useEffect } from "react";

export default function page() {
  useEffect(() => {
    const res = fetch("/api/admin-password").then(console.log("hii"));
  }, []);
  return <div></div>;
}
