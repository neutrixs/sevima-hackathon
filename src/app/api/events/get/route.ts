import { prisma } from "@/lib/prisma"

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

export async function GET(req: Request) {
    const events = await prisma.event.findMany()

    const result: APIResult[] = []

    for (const event of events) {
        const candidates: {id: string, name:string}[] = []

        for (const candidateID of event.candidateIDs) {
            const candidate = await prisma.user.findFirst({
                where: {
                    id: candidateID
                }
            })

            if (candidate) candidates.push({
                id: candidate.id,
                name: candidate.name,
            })
        }

        result.push({
            eventName: event.name,
            start: event.startEpoch,
            end: event.endEpoch,
            candidates,
            id: event.id
        })
    }

    return Response.json(result)
}