import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, getCategories, createProduct, updateProduct } from '../services/api'

export default function AddEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingProduct, setFetchingProduct] = useState(isEdit)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [variants, setVariants] = useState([])

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    material: '',
    dimensions: '',
    weight: '',
    color: '',
    finish: '',
    deliveryTime: '7-10 business days',
    warranty: '1 year manufacturer warranty',
    careInstructions: '',
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    customOrderAvailable: false,
  })

  // Fetch categories
  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(console.error)
  }, [])

  // If editing, fetch product data
  useEffect(() => {
    if (!isEdit) return
    getProduct(id)
      .then(res => {
        const p = res.data
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          category: p.category?._id || '',
          material: p.material || '',
          dimensions: p.dimensions || '',
          weight: p.weight || '',
          color: p.color || '',
          finish: p.finish || '',
          deliveryTime: p.deliveryTime || '7-10 business days',
          warranty: p.warranty || '1 year manufacturer warranty',
          careInstructions: p.careInstructions || '',
          inStock: p.inStock ?? true,
          isFeatured: p.isFeatured ?? false,
          isNewArrival: p.isNewArrival ?? false,
          isBestSeller: p.isBestSeller ?? false,
          customOrderAvailable: p.customOrderAvailable ?? false,
        })
        setExistingImages(p.images || [])
    setVariants(p.variants || [])
      })
      .catch(console.error)
      .finally(() => setFetchingProduct(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setNewImages(files)
    const previews = files.map(f => URL.createObjectURL(f))
    setPreviewImages(previews)
  }

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
  setVariants(prev => [...prev, { name: '', price: '' }])
}

const updateVariant = (index, field, value) => {
  setVariants(prev => prev.map((v, i) =>
    i === index ? { ...v, [field]: value } : v
  ))
}

const removeVariant = (index) => {
  setVariants(prev => prev.filter((_, i) => i !== index))
}

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    const formData = new FormData()

    // Append all text fields
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Tell backend which existing images to KEEP
    existingImages.forEach(img => {
      formData.append('keptImages', img)
    })
    // Append variants as JSON string
    formData.append('variants', JSON.stringify(variants.filter(v => v.name && v.price)))
    // Append new image files
    newImages.forEach(file => formData.append('images', file))

    if (isEdit) {
      await updateProduct(id, formData)
    } else {
      await createProduct(formData)
    }

    navigate('/products')
  } catch (err) {
    alert('Failed to save product. Please try again.')
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  if (fetchingProduct) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col gap-6 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? '✏️ Edit Product' : '➕ Add New Product'}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {isEdit ? 'Update product details below' : 'Fill in the details to add a new product'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ── BASIC INFO ── */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Chinioti Sofa Set"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Price (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="e.g. 85000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the product..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── SPECIFICATIONS ── */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">Specifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Material</label>
              <input type="text" name="material" value={form.material} onChange={handleChange}
                placeholder="e.g. Sheesham Wood"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Dimensions</label>
              <input type="text" name="dimensions" value={form.dimensions} onChange={handleChange}
                placeholder="e.g. 6x3 feet"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Weight</label>
              <input type="text" name="weight" value={form.weight} onChange={handleChange}
                placeholder="e.g. 45 kg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Color</label>
              <input type="text" name="color" value={form.color} onChange={handleChange}
                placeholder="e.g. Walnut Brown"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Finish</label>
              <input type="text" name="finish" value={form.finish} onChange={handleChange}
                placeholder="e.g. Matte Polish"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Delivery Time</label>
              <input type="text" name="deliveryTime" value={form.deliveryTime} onChange={handleChange}
                placeholder="e.g. 7-10 business days"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Warranty</label>
              <input type="text" name="warranty" value={form.warranty} onChange={handleChange}
                placeholder="e.g. 1 year manufacturer warranty"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Care Instructions</label>
              <textarea name="careInstructions" value={form.careInstructions} onChange={handleChange}
                rows={2} placeholder="e.g. Wipe with dry cloth..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
            </div>
          </div>
        </div>
        
        {/* ── VARIANTS ── */}
<div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
  <div className="flex items-center justify-between border-b pb-2">
    <div>
      <h2 className="font-semibold text-gray-700">Product Variants</h2>
      <p className="text-xs text-gray-400 mt-0.5">
        Add different configurations with different prices
        e.g. "Bed + Sidetables", "Bed + Sidetables + Mirror"
      </p>
    </div>
    <button
      type="button"
      onClick={addVariant}
      className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-medium px-4 py-2 rounded-lg transition"
    >
      + Add Variant
    </button>
  </div>

  {variants.length === 0 ? (
    <div className="text-center py-6 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
      <p className="text-2xl mb-1">📦</p>
      <p className="text-sm">No variants added</p>
      <p className="text-xs mt-1">
        Leave empty if product has one fixed price
      </p>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {variants.map((variant, index) => (
        <div key={index} className="flex gap-3 items-center bg-gray-50 rounded-lg p-3">
          <div className="flex-1">
            <input
              type="text"
              value={variant.name}
              onChange={e => updateVariant(index, 'name', e.target.value)}
              placeholder="e.g. Bed + Sidetables + Mirror"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="w-36">
            <input
              type="number"
              value={variant.price}
              onChange={e => updateVariant(index, 'price', e.target.value)}
              placeholder="Price (Rs.)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="button"
            onClick={() => removeVariant(index)}
            className="bg-red-100 hover:bg-red-200 text-red-600 rounded-lg p-2 transition"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  )}
</div>

        {/* ── IMAGES ── */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">Product Images</h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Current images (click × to remove)</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {isEdit ? 'Upload New Images' : 'Upload Images'} (max 6)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-dashed border-amber-400 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-pointer"
            />
          </div>

          {/* New Image Previews */}
          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {previewImages.map((src, i) => (
                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-amber-300">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FLAGS ── */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">Product Flags</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'inStock', label: '✅ Available' },
              { name: 'isNewArrival', label: '✨ New Arrival' },
              { name: 'isBestSeller', label: '🔥 Best Seller' },
              { name: 'isFeatured', label: '⭐ Featured' },
              { name: 'customOrderAvailable', label: '🛠️ Custom Order' },
            ].map(flag => (
              <label key={flag.name} className="flex items-center gap-3 cursor-pointer bg-gray-50 rounded-lg px-4 py-3">
                <input
                  type="checkbox"
                  name={flag.name}
                  checked={form[flag.name]}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-700"
                />
                <span className="text-sm font-medium text-gray-700">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── SUBMIT ── */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}