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

    console.log(admin)
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})