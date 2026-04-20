import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null)

  const login = (token) => {
    localStorage.setItem('adminToken', token)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)