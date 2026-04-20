import { useState, useEffect } from 'react'
import { getVideos, createVideo, updateVideo, deleteVideo } from '../services/api'

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'youtube']

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    videoUrl: '',
    platform: 'tiktok',
    isActive: true
  })
  const [thumbnail, setThumbnail] = useState(null)

  useEffect(() => {
    getVideos()
      .then(res => setVideos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    setThumbnail(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleEditClick = (video) => {
    setEditingVideo(video)
    setForm({
      title: video.title,
      videoUrl: video.videoUrl,
      platform: video.platform,
      isActive: video.isActive
    })
    setPreview(video.thumbnail || null)
    setThumbnail(null)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingVideo(null)
    setForm({ title: '', videoUrl: '', platform: 'tiktok', isActive: true })
    setThumbnail(null)
    setPreview(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.videoUrl) return setError('Title and video URL are required')
    setSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('videoUrl', form.videoUrl)
      formData.append('platform', form.platform)
      formData.append('isActive', form.isActive)
      if (thumbnail) formData.append('thumbnail', thumbnail)

      if (editingVideo) {
        const res = await updateVideo(editingVideo._id, formData)
        setVideos(prev => prev.map(v => v._id === editingVideo._id ? res.data : v))
        handleCancel()
      } else {
        const res = await createVideo(formData)
        setVideos(prev => [res.data, ...prev])
        handleCancel()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save video')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await deleteVideo(id)
      setVideos(prev => prev.filter(v => v._id !== id))
    } catch (err) {
      alert('Failed to delete video')
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Social Media Videos</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your TikTok, Instagram and other video links</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── FORM ── */}
        <div className={`bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-fit border-2 transition
          ${editingVideo ? 'border-amber-400' : 'border-transparent'}`}>

          <h2 className="font-semibold text-gray-700 border-b pb-2">
            {editingVideo ? `✏️ Editing: ${editingVideo.title}` : '➕ Add New Video'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. New Chinioti Sofa Set 2024"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Video URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="https://www.tiktok.com/@username/video/..."
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Platform</label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full border border-dashed border-amber-400 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-pointer"
              />
              {preview && (
                <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-amber-200">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer bg-gray-50 rounded-lg px-4 py-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-700"
              />
              <span className="text-sm font-medium text-gray-700">✅ Show on website</span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingVideo ? 'Update Video' : '+ Add Video'}
              </button>
              {editingVideo && (
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

        {/* ── VIDEOS LIST ── */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-700 border-b pb-2">
            All Videos
            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {videos.length}
            </span>
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📱</p>
              <p className="text-sm">No videos yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {videos.map(video => (
                <div
                  key={video._id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition
                    ${editingVideo?._id === video._id
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-100 hover:border-amber-200'}`}
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {video.thumbnail
                      ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">📱</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{video.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{video.platform}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditClick(video)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(video._id, video.title)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      🗑️
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