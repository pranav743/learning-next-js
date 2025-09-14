"use client"

import { useEffect, useRef } from "react"

export default function ChartComponent() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    const loadChart = async () => {
      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Projects Completed",
              data: [12, 19, 3, 5, 2, 3],
              borderColor: "rgb(99, 102, 241)",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              tension: 0.1,
            },
            {
              label: "Tasks Completed",
              data: [8, 12, 18, 9, 15, 22],
              borderColor: "rgb(34, 197, 94)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Project & Task Completion Trends",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    }

    loadChart()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  )
}
