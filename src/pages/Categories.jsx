import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [editingCategory, setEditingCategory] = useState(null) // ← the key piece

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleNameChange = (e) => {
    const val = e.target.value
    setName(val)
    // only auto-generate slug when adding, not editing
    if (!editingCategory) {
      setSlug(val.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  // ── Click Edit button → pre-fill form ──
  const handleEditClick = (cat) => {
    setEditingCategory(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setPreview(cat.image || null)
    setImage(null)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Cancel edit → reset form ──
  const handleCancel = () => {
    setEditingCategory(null)
    setName('')
    setSlug('')
    setImage(null)
    setPreview(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !slug) return setError('Name and slug are required')
    setSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('slug', slug)
      if (image) formData.append('image', image)

      if (editingCategory) {
        // ── EDIT MODE ──
        const res = await updateCategory(editingCategory._id, formData)
        setCategories(prev => prev.map(c => c._id === editingCategory._id ? res.data : c))
        handleCancel()
      } else {
        // ── ADD MODE ──
        const res = await createCategory(formData)
        setCategories(prev => [...prev, res.data])
        setName('')
        setSlug('')
        setImage(null)
        setPreview(null)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This will NOT delete its products.`)) return
    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(c => c._id !== id))
      if (editingCategory?._id === id) handleCancel()
    } catch (err) {
      alert('Failed to delete category')
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your furniture categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── FORM (Add or Edit) ── */}
        <div className={`bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-fit border-2 transition ${
          editingCategory ? 'border-amber-400' : 'border-transparent'
        }`}>

          <h2 className="font-semibold text-gray-700 border-b pb-2">
            {editingCategory ? `✏️ Editing: ${editingCategory.name}` : '➕ Add New Category'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Living Room"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Slug <span className="text-xs text-gray-400">(auto generated)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g. living-room"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Category Image <span className="text-xs text-gray-400">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-dashed border-amber-400 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-pointer"
              />
              {preview && (
                <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-amber-200">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {submitting
                  ? 'Saving...'
                  : editingCategory ? 'Update Category' : '+ Add Category'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── CATEGORIES LIST ── */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">
            All Categories
            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {categories.length}
            </span>
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📁</p>
              <p className="text-sm">No categories yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {categories.map(cat => (
                <div
                  key={cat._id}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition ${
                    editingCategory?._id === cat._id
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-100 hover:border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">📁</div>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400 truncate">/{cat.slug}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditClick(cat)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}