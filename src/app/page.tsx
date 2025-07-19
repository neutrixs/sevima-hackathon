"use client"

import styles from "./page.module.css";
import getCookie from "./scripts/cookie";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export interface APIResult {
    eventName: string
    start: number
    end: number
    candidates: string[]
    id: number
}

function LogOut() {

    function out() {
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        redirect("/login")
    }

    return (
        <div className={styles.logout}>
            <div onClick={out}>Logout</div>
        </div>
    )
}

export default function Home() {
    useEffect(() => {
        const cookie = getCookie("session")
        if (!cookie) {
            redirect("/login")
        }

        (async () => {
            const eventsFetch = await fetch("/api/events/get")
            const eventsData = await eventsFetch.json() as APIResult[]
            setEventsData(eventsData)
            setIsLoaded(true)
        })()
    }, [])

    const [isLoaded, setIsLoaded] = useState(false)
    const [eventsData, setEventsData] = useState<APIResult[]>([])

    return (
        <div className={styles.container}>
            <LogOut />
            <p>Events</p>
            {!isLoaded ? <p>Loading...</p> : null}
            {eventsData.map(event => {
                return <div key={event.id} className={styles.eventContainer}>
                    <p>{event.eventName}</p>
                    <p>From: {new Date(event.start * 1000).toLocaleString('en-GB')}</p>
                    <p>To: {new Date(event.end * 1000).toLocaleString('en-GB')}</p>
                    <p>Candidates: {event.candidates.join(", ")}</p>
                </div>
            })}
        </div>
    );
}
