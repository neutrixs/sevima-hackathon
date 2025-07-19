import bcrypt from "bcrypt"

const ROUNDS = 10

export async function hasher(plaintext: string) {
    return bcrypt.hash(plaintext, ROUNDS)
}

export async function compare(plaintext: string, hash: string) {
    return bcrypt.compare(plaintext, hash)
}