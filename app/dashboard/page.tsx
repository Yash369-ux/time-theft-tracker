"use client"

import dynamic from "next/dynamic"

const Pie = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  { ssr: false }
)
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"
ChartJS.register(ArcElement, Tooltip, Legend)

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
const [data, setData] = useState<Record<string, number>>({})
const [customSites, setCustomSites] = useState<string[]>([])
const [newSite, setNewSite] = useState("")
const addManualLog = async () => {
  const res = await fetch("/api/time", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      site: "manual",
      seconds: 600
    })
  })

  const result = await res.json()
  console.log(result)
}
useEffect(() => {
  const saved = localStorage.getItem("customDistractingSites")
  if (saved) {
    setCustomSites(JSON.parse(saved))
  }
}, [])
  useEffect(() => {
  const interval = setInterval(() => {
   fetch("/api/time")
    .then(res => res.json())
      .then(result => {
        setData(result)
      })
  }, 2000)

  return () => clearInterval(interval)
}, [])

const totalSeconds = Object.values(data).reduce((a, b) => a + b, 0)
const defaultDistractingSites = ["youtube.com", "instagram.com", "facebook.com", "twitter.com"]

const distractingSites = [...defaultDistractingSites, ...customSites]

let stolenSeconds = 0
let productiveSeconds = 0

Object.entries(data).forEach(([site, seconds]) => {
  if (distractingSites.some(d => site.includes(d))) {
    stolenSeconds += seconds
  } else {
    productiveSeconds += seconds
  }
})

const stolenHours = Math.floor(stolenSeconds / 3600)
const stolenMinutes = Math.floor((stolenSeconds % 3600) / 60)

const productiveHours = Math.floor(productiveSeconds / 3600)
const productiveMinutes = Math.floor((productiveSeconds % 3600) / 60)
const totalHours = Math.floor(totalSeconds / 3600)
const totalMinutes = Math.floor((totalSeconds % 3600) / 60)  
const topSites = Object.entries(data)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  const stolenChartData = {
 labels: Object.entries(data)
  .filter(([site]) => site !== "localhost")
  .filter(([site]) =>
    distractingSites.some(ds =>
  site.replace("www.", "").includes(ds.replace("www.", ""))
))
  .map(([site]) => site),
  datasets: [
    {
      label: "Time Stolen",
      data: Object.entries(data)
  .filter(([site]) => site !== "localhost")
  .filter(([site]) =>
   distractingSites.some(ds =>
  site.replace("www.", "").includes(ds.replace("www.", ""))
)
  )
  .map(([site, sec]) =>
    Math.max(1, Math.floor(sec / 60))
  ),
    backgroundColor: ["#ef4444", "#f59e0b", "#fb7185", "#f97316"],
    },
  ],
}

const productiveChartData = {
 labels: Object.entries(data)
  .filter(([site]) => site !== "localhost")
  .filter(([site]) =>
    !distractingSites.some(ds => site.includes(ds))
  )
  .map(([site]) => site),
  datasets: [
    {
      label: "Productive Time",
     data: Object.entries(data)
  .filter(([site]) => site !== "localhost")
  .filter(([site]) =>
    distractingSites.some(ds => site.includes(ds))
  )
  .map(([site, sec]) =>
    Math.max(1, Math.floor(sec / 60))
  ),
      
      backgroundColor: ["#22c55e", "#10b981", "#14b8a6", "#4ade80"],
    },
  ],
}
 const chartData = {
labels: Object.keys(data).filter((site) => site !== "localhost"),
  datasets: [
    {
      label: "Time Spent (minutes)",
      
      data: Object.entries(data)
  .filter(([site]) => site !== "localhost")
  .map(([_, sec]) =>
  sec > 0 ? Math.max(1, Math.floor(sec / 60)) : 0
),
      backgroundColor: [
        "#3b82f6",
        "#ef4444",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
      ],
    },
  ],
}
  return (
   
   <main className="min-h-screen bg-gray-900 text-white">
<div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">
  Dashboard
</h1>
      <div>
       
  <h2>Website Usage</h2>

  {Object.keys(data).length === 0 ? (
    <p>No data yet...</p>
  ) : (
    <ul>
      {Object.entries(data).map(([site, time]) => (
        <li key={site}>
          {site} - {Math.floor(time / 3600)}h {Math.floor((time % 3600) / 60)}m
        </li>
      ))}
    </ul>
  )}
</div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-xl text-center shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border border-gray-700">
         
         <h2 className="text-xl mb-2 flex items-center justify-center gap-2">
🖥 Total Screen Time
</h2>
          <p className="text-3xl font-bold text-blue-400">{totalHours}h {totalMinutes}m</p>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-xl text-center shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border border-gray-700">
          <h2 className="text-xl mb-2 flex items-center justify-center gap-2">
🚨 Time Stolen
</h2>
          <p className="text-3xl font-bold text-red-400">{stolenHours}h {stolenMinutes}m</p>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-xl text-center shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border border-gray-700">
         <h2 className="text-xl mb-2 flex items-center justify-center gap-2">
⚡ Time Recovered
</h2>
          <p className="text-3xl font-bold text-green-400">{productiveHours}h {productiveMinutes}mm</p>
        </div>
      </div>

      {/* Add Manual Log Button */}
            {showForm && (
        <div className="mt-8 bg-gray-800 p-6 rounded-xl max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">
            Add Manual Time Log
          </h3>

          <input
            type="text"
            placeholder="Website Name"
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />

          <input
            type="text"
            placeholder="Time Spent (e.g. 30m)"
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />

          <button onClick={addManualLog} className="bg-green-600 px-4 py-2 rounded text-white">
            Save
          </button>
        </div>
      )}
      <div className="mt-12 text-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
        >
          + Add Manual Time Log
        </button>
      </div>
<div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700 max-w-5xl mx-auto mt-8">
  <h2 className="text-xl font-bold mb-4">
    Usage Distribution
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mt-6">
<div className="w-72 h-72 mx-auto">
    <h3 className="text-center mb-2">Time Stolen</h3>
    {stolenChartData.labels.length === 0 ? (
  <p>No distracting sites yet</p>
) : (
  <Pie data={stolenChartData} />
)}
  </div>

<div className="w-72 h-72 mx-auto">
    <h3 className="text-center mb-2">Productive Time</h3>
    <Pie data={productiveChartData} />
  </div>

</div>
  <div className="mt-6 flex flex-col items-center gap-4">
  <h3 className="text-lg font-semibold">Add Distracting Website</h3>

  <div className="flex gap-2">
    <input
      type="text"
      placeholder="example.com"
      value={newSite}
      onChange={(e) => setNewSite(e.target.value)}
      className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
    />

    <button
      onClick={() => {
        if (newSite.trim() !== "") {
          const updated = [...customSites, newSite.trim()]
          setCustomSites(updated)
          localStorage.setItem("customDistractingSites", JSON.stringify(updated))
          setNewSite("")
        }
      }}
      className="px-4 py-2 bg-red-500 rounded text-white"
    >
      Add
    </button>
  </div>
</div>
  
</div>
      {/* Top Distracting Websites */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Top Distracting Websites
        </h2>

        <div className="bg-gray-800 p-6 rounded-xl">
          <ul className="space-y-3">
            {topSites.map(([site, time]) => (
  <li key={site} className="flex justify-between">
    <span>{site}</span>
    <span className="text-red-400">
      {Math.floor(time / 3600)}h {Math.floor((time % 3600) / 60)}m
    </span>
  </li>
))}
          </ul>
        </div>
      </div>
      </div>
    </main>
  );
}