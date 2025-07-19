"use client"

import styles from "./page.module.css";
import getCookie from "./scripts/cookie";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import CreateMenu from "./createMenu";
import VoteMenu from "./voteMenu";

export interface APIResult {
    eventName: string
    start: number
    end: number
    candidates: {
        id: string,
        name: string
    }[]
    id: number
}

function LogOut() {
    function out() {
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        redirect("/login")
    }

    return (
        <div className={styles.logout}>
            <div onClick={out} className={styles.button}>Logout</div>
        </div>
    )
}

export default function Home() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [allowCreateEvent, setAllowCreateEvent] = useState(false)
    const [eventsData, setEventsData] = useState<APIResult[]>([])
    const [createMenuOpened, setCreateMenuOpened] = useState(false)
    const [voteMenuOpened, setVoteMenuOpened] = useState(false)
    const [voteID, setVoteID] = useState(0)
    
    useEffect(() => {
        const cookie = getCookie("session")
        if (!cookie) {
            redirect("/login")
        }

        updateData();

        (async () => {
            const response = await fetch("/api/events/allow-creation")
            const allowed = await response.json()
            setAllowCreateEvent(allowed)
        })()
    }, [])

    async function updateData() {
        const eventsFetch = await fetch("/api/events/get")
        const eventsData = await eventsFetch.json() as APIResult[]
        setEventsData(eventsData)
        setIsLoaded(true)
    }

    function openCreateMenu() {
        setCreateMenuOpened(true)
    }

    function canVoteNow(event: APIResult) {
        const ctime = new Date().getTime() / 1000

        if (ctime >= event.start && ctime < event.end) {
            return true
        }
        return false
    }

    return (
        <>
            <div className={styles.container}>
                <LogOut />
                <p>Events</p>
                {allowCreateEvent ? <div className={styles.button} onClick={openCreateMenu}>Create event</div> : null}
                {!isLoaded ? <p>Loading...</p> : null}
                {eventsData.map(event => {
                    return <div key={event.id} className={styles.eventContainer}>
                        <p>{event.eventName}</p>
                        <p>From: {new Date(event.start * 1000).toLocaleString('en-GB')}</p>
                        <p>To: {new Date(event.end * 1000).toLocaleString('en-GB')}</p>
                        <p>Candidates: {event.candidates.map(c=>c.name).join(", ")}</p>
                        <div>
                            {canVoteNow(event) ? <div className={styles.button} onClick={() => {
                                setVoteMenuOpened(true)
                                setVoteID(event.id)
                            }}>Vote</div> : null}
                        </div>
                    </div>
                })}

            </div>
            {createMenuOpened ? <CreateMenu setOpened={setCreateMenuOpened} refresh={updateData} /> : null}
            {voteMenuOpened ? <VoteMenu id={voteID} setOpened={setVoteMenuOpened} eventData={eventsData.find(a => a.id == voteID) as APIResult} /> : null}
        </>
    );
}
