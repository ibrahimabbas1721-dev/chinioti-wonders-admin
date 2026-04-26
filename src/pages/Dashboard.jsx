import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, newArrivals: 0, bestSellers: 0, categories: 0 })
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      const [allRes, newRes, bestRes, catRes] = await Promise.all([
        getProducts(),
        getProducts({ newArrival: true }),
        getProducts({ bestSeller: true }),
        getCategories()
      ])
      setStats({
        total: allRes.data.length,
        newArrivals: newRes.data.length,
        bestSellers: bestRes.data.length,
        categories: catRes.data.length
      })
      setRecentProducts(allRes.data.slice(0, 5))
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Products', value: stats.total, icon: '🪑', color: 'bg-amber-50 text-amber-700' },
    { label: 'New Arrivals', value: stats.newArrivals, icon: '✨', color: 'bg-green-50 text-green-700' },
    { label: 'Best Sellers', value: stats.bestSellers, icon: '🔥', color: 'bg-orange-50 text-orange-700' },
    { label: 'Categories', value: stats.categories, icon: '📁', color: 'bg-blue-50 text-blue-700' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's an overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`${card.color} rounded-xl p-5 flex flex-col gap-2`}>
            <span className="text-3xl">{card.icon}</span>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700">Recent Products</h2>
          <Link to="/products/add" className="text-sm bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition">
            + Add Product
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map(p => (
              <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-700">{p.name}</td>
                <td className="py-3 text-amber-700">Rs. {p.price.toLocaleString()}</td>
                <td className="py-3 text-gray-500">{p.category?.name}</td>
                <td className="py-3">
                  {p.inStock
                    ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Availabe</span>
                    : <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">Out</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}