import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const persist = useCallback((token, userData) => {
    localStorage.setItem('edumart_token', token)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('edumart_token')
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('edumart_token')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { user: u } = await api.me()
      setUser(u)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email, password) => {
    const { token, user: u } = await api.login({ email, password })
    persist(token, u)
    return u
  }

  const register = async (data) => {
    const { token, user: u } = await api.register(data)
    persist(token, u)
    return u
  }

  const googleLogin = async (credential) => {
    const { token, user: u } = await api.googleLogin(credential)
    persist(token, u)
    return u
  }

  const updateProfile = async (data) => {
    const { user: u } = await api.updateProfile(data)
    setUser(u)
    return u
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        refreshUser,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
