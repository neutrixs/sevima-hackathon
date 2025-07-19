import { Dispatch, SetStateAction, useRef } from "react";
import styles from "./page.module.css"
import { APIResult } from "./page";

export default function VoteMenu({id, setOpened, eventData} : {id: number, setOpened: Dispatch<SetStateAction<boolean>>, eventData: APIResult}) {
    const selectElement = useRef<HTMLSelectElement>(null!)

    async function submit() {
        const value = selectElement.current.value

        const result = await fetch("/api/events/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                eventID: id,
                candidateID: value
            })
        })

        if (result.ok) {
            setOpened(false)
        } else {
            const msg = (await result.json()).message
            alert(msg)
        }
    }

    return (
        <div className={styles.popup} style={{height: "20em"}}>
            <p style={{textAlign: "right", cursor: "pointer"}} onClick={() => setOpened(false)}>X</p>
            <p>Vote</p>
            <p>Choose a candidate:</p>
            <select ref={selectElement}>
                {
                    eventData.candidates.map(candidate => {
                        return (
                            <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                        )
                    })
                }
            </select>
            <div className={styles.button} onClick={submit}>Submit</div>
        </div>
    )
}