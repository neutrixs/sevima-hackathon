"use client"

import styles from "./page.module.css";
import getCookie from "./scripts/cookie";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
    useEffect(() => {
        const cookie = getCookie("session")
        if (!cookie) {
            redirect("/login")
        }
    }, [])

    return (
            <p>AAAAA</p>
    );
}
