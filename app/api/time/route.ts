
let timeData: any[] = []

export async function GET() {
  const summary: Record<string, number> = {}

  for (const entry of timeData) {
    if (!summary[entry.website]) {
      summary[entry.website] = 0
    }
    summary[entry.website] += entry.timeSpent
  }

  return Response.json(summary)
}

export async function POST(req: Request) {
  const data = await req.json()

  timeData.push({
    website: data.website,
    timeSpent: data.timeSpent,
    timestamp: new Date()
  })

  return Response.json({
    message: "Time data saved ✅"
  })
}
