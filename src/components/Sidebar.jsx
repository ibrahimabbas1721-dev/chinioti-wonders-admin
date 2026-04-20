import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo3.png';

const links = [
  { to: '/',          label: 'Dashboard',  icon: '📊' },
  { to: '/products',  label: 'Products',   icon: '🪑' },
  { to: '/categories',label: 'Categories', icon: '📁' },
  { to: '/videos',    label: 'Videos',     icon: '📱' }, // ← add this
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-amber-950 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-amber-800">
          <img
            src={logo}
            alt="Chinioti Wonders"
            className="h-14 md:h-16 w-40 object-contain"
          />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              pathname === link.to
                ? 'bg-amber-700 text-white'
                : 'text-amber-300 hover:bg-amber-900 hover:text-white'
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-amber-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-300 hover:bg-amber-900 hover:text-white transition"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}