import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = [
  {
    email: 'admin@jajapin.id',
    password: 'admin123',
    name: 'Super Admin Jajapin',
    role: 'admin',
  },
  {
    email: 'owner@bukitsenja.id',
    password: 'owner123',
    name: 'Pemilik Bukit Senja',
    role: 'owner',
  },
  {
    email: 'tamu@gmail.com',
    password: 'tamu123',
    name: 'Budi Santoso',
    role: 'guest',
  },
]

const STORAGE_KEY = 'jajapin_user'
const USERS_KEY = 'jajapin_users'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem(USERS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const login = (email, password) => {
    const demoUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (demoUser) {
      const userData = { name: demoUser.name, email: demoUser.email, role: demoUser.role }
      setUser(userData)
      return { success: true, user: userData }
    }

    const registeredUsers = getRegisteredUsers()
    const registeredUser = registeredUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (registeredUser) {
      const userData = { name: registeredUser.name, email: registeredUser.email, role: registeredUser.role }
      setUser(userData)
      return { success: true, user: userData }
    }

    return { success: false, message: 'Email atau kata sandi salah.' }
  }

  const register = (name, email, password) => {
    const allDemoEmails = DEMO_USERS.map((u) => u.email)
    if (allDemoEmails.includes(email)) {
      return { success: false, message: 'Email sudah terdaftar.' }
    }

    const registeredUsers = getRegisteredUsers()
    if (registeredUsers.some((u) => u.email === email)) {
      return { success: false, message: 'Email sudah terdaftar.' }
    }

    const newUser = { name, email, password, role: 'guest' }
    localStorage.setItem(USERS_KEY, JSON.stringify([...registeredUsers, newUser]))

    const userData = { name, email, role: 'guest' }
    setUser(userData)
    return { success: true, user: userData }
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOwner: user?.role === 'owner',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
