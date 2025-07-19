import { hasher } from "@/lib/hasher"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    const adminPassword = "admin123"
    const hash = await hasher(adminPassword)
    const admin = await prisma.user.upsert({
        where: {
            id: "0"
        },
        update: {},
        create: {
            id: "0",
            name: "Admin",
            role: "Admin",
            hash
        }
    })

    const dummyUserPassword = "user123"
    const dummyUserHash = await hasher(dummyUserPassword)
    const user1 = await prisma.user.upsert({
        where: {
            id: "1111222233334444"
        },
        update: {},
        create: {
            id: "1111222233334444",
            name: "steven",
            role: "User",
            hash: dummyUserHash
        }
    })

    const user2 = await prisma.user.upsert({
        where: {
            id: "1111222233334445"
        },
        update: {},
        create: {
            id: "1111222233334445",
            name: "kevin",
            role: "User",
            hash: dummyUserHash
        }
    })

    console.log({admin, user1, user2})
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})