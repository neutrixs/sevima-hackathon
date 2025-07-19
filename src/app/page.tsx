"use client"

import styles from "./page.module.css";
import getCookie from "./scripts/cookie";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function Home() {
    useEffect(() => {
        const cookie = getCookie("session")
        if (!cookie) {
            redirect("/login")
        }
    }, [])

    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div className={styles.container}>
            <p>Events</p>
            {!isLoaded ? <p>Loading...</p> : null}
        </div>
    );
}
