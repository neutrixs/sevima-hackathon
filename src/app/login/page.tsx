"use client"

import { useRef } from "react"
import styles from "./page.module.css"
import { redirect } from "next/navigation"

export default function Login() {
    const form = useRef<HTMLFormElement>(null!)
    const unameInput = useRef<HTMLInputElement>(null!)
    const passwordInput = useRef<HTMLInputElement>(null!)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const username = unameInput.current.value
        const password = passwordInput.current.value

        const resp = await fetch("/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: username,
                password
            })
        })

        if (resp.ok) {
            redirect("/")
        } else {
            alert("Wrong id/email or password")
        }
    }

    return (
        <div className={styles.container}>
            <p>Login</p>
            <form ref={form} onSubmit={onSubmit}>
                <div className={styles.formHolder}>
                    <label htmlFor="id">ID/Email</label>
                    <input type="text" ref={unameInput} id="id"></input>
                    <label htmlFor="password">Password</label>
                    <input type="password" ref={passwordInput} id="password"></input>
                    <input type="submit"></input>
                </div>
            </form>
        </div>
    )
}