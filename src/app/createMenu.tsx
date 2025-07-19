import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import styles from './page.module.css'

export default function CreateMenu({setOpened, refresh}: {setOpened: Dispatch<SetStateAction<boolean>>, refresh: () => {}}) {
    const nameRef = useRef<HTMLInputElement>(null!)
    const startDateRef = useRef<HTMLInputElement>(null!)
    const endDateRef = useRef<HTMLInputElement>(null!)
    const adderRef = useRef<HTMLInputElement>(null!)
    const candidateIDsRef = useRef<string[]>([])
    const [candidateIDs, setCandidateIDs] = useState<string[]>([])

    useEffect(() => {
        candidateIDsRef.current = candidateIDs
    }, [candidateIDs])

    async function send() {
        const result = await fetch("/api/events/create", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                name: nameRef.current.value,
                startEpoch: Math.floor(new Date(startDateRef.current.value).getTime() / 1000),
                endEpoch: Math.floor(new Date(endDateRef.current.value).getTime() / 1000),
                candidateIDs
            })
        })

        const parsed = await result.json()

        if (!result.ok) {
            alert(parsed.message)
            return false
        }

        return true
    }

    return (
        <div className={styles.popup}>
            <p style={{textAlign: "right", cursor: "pointer"}} onClick={() => setOpened(false)}>X</p>
            <p>Event name</p>
            <input type="text" ref={nameRef}></input>
            <p>Start date</p>
            <input type="datetime-local" ref={startDateRef}></input>
            <p>End date</p>
            <input type="datetime-local" ref={endDateRef}></input>
            <p>Candidate IDs</p>
            {candidateIDs.map(candidate => {
                return (
                    <div className={styles.candidateAdder} key={candidate}>
                        <p>{candidate}</p>
                    </div>
                )
            })}
            <div className={styles.candidateAdder}>
                <input ref={adderRef} type="text"></input>
                <span onClick={() => {
                    if (candidateIDsRef.current.findIndex(a => a == adderRef.current.value) != -1) {
                        alert("already added")
                        return
                    }

                    setCandidateIDs(prev => prev.concat(adderRef.current.value))
                }}>+</span>
            </div>
            <div className={styles.button} onClick={async () => {
                const success = await send()
                if (success) {
                    setOpened(false)
                    refresh()
                }
            }}>Create</div>
        </div>
    )
}