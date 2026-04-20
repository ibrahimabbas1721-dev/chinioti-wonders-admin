import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from '../services/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} total products</p>
        </div>
        <Link
          to="/products/add"
          className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
          <p className="text-5xl mb-4">🪑</p>
          <p className="font-medium">No products yet</p>
          <Link to="/products/add" className="text-amber-700 hover:underline text-sm mt-2 inline-block">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b last:border-0 hover:bg-gray-50 transition">

                    {/* Image */}
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-amber-50">
                        <img
                          src={product.images?.[0] || 'https://placehold.co/56x56/f5e6d3/92400e?text=?'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      {product.material && (
                        <p className="text-xs text-gray-400 mt-0.5">{product.material}</p>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-amber-700 font-semibold">
                      Rs. {product.price.toLocaleString()}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-gray-500">
                      {product.category?.name || '—'}
                    </td>

                    {/* Tags */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isNewArrival && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">New</span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">Best</span>
                        )}
                        {product.isFeatured && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">Featured</span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      {product.inStock
                        ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">In Stock</span>
                        : <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">Out</span>
                      }
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/products/edit/${product._id}`}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}