import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function SalesReportPage(): React.JSX.Element {
  const products = Array.from({ length: 40 }, (_, i) => `Product ${i + 1}`)
  const unitsSold = Array.from({ length: 40 }, () => Math.floor(Math.random() * 200))
  const stockQuantities = Array.from({ length: 40 }, () => Math.floor(Math.random() * 200))

  const productStockPairs = products.map((p, i) => ({ product: p, qty: stockQuantities[i] }))
  productStockPairs.sort((a, b) => b.qty - a.qty)
  const productUnitsPairs = products.map((p, i) => ({ product: p, units: unitsSold[i] }))
  productUnitsPairs.sort((a, b) => b.units - a.units)

  const sortedProducts = productStockPairs.map((p) => p.product)
  const sortedQuantities = productStockPairs.map((p) => p.qty)
  const sortedTopProducts = productUnitsPairs.map((p) => p.product)
  const sortedUnitsSold = productUnitsPairs.map((p) => p.units)

  const topSellingProductsData = {
    labels: sortedTopProducts,
    datasets: [
      {
        label: 'Units Sold',
        data: sortedUnitsSold,
        backgroundColor: 'rgba(59, 130, 246, 0.7)' // Tailwind blue-500
      }
    ]
  }

  const topSellingProductsOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Top Selling Products' }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20 // show max 20 labels on X-axis to reduce clutter
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  const totalIncomeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [5000, 7000, 6000, 8000, 7500, 9000],
        borderColor: 'rgba(34,197,94,1)', // Tailwind green-500
        backgroundColor: 'rgba(34,197,94,0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Expenses',
        data: [3000, 4000, 3500, 4500, 4200, 4800],
        borderColor: 'rgba(239, 68, 68, 1)', // Tailwind red-500
        backgroundColor: 'rgba(239,  68, 68, 0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  }

  const totalIncomeOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Total Income vs Expenses' }
    }
  }

  const stockLevelsData = {
    labels: sortedProducts,
    datasets: [
      {
        label: 'Stock Quantity',
        data: sortedQuantities,
        backgroundColor: 'rgba(234, 179, 8, 0.7)' // Tailwind yellow-500
      }
    ]
  }

  const stockLevelsOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Stock Levels' }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  const salesOverTimeData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Sales',
        data: [1000, 1400, 900, 1700],
        borderColor: 'rgba(14, 165, 233, 1)', // Tailwind sky-500
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const salesOverTimeOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Sales Over Time' }
    }
  }

  return (
    <main className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Sales Report Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div style={{ minWidth: 900 }}>
                <Bar data={topSellingProductsData} options={topSellingProductsOptions} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Income / Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={totalIncomeData} options={totalIncomeOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div style={{ minWidth: 900 }}>
                <Bar data={stockLevelsData} options={stockLevelsOptions} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={salesOverTimeData} options={salesOverTimeOptions} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
