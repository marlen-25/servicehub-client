import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, signIn, signUp, signOut, getCurrentUser } from './supabase'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import Bookings from './pages/Bookings'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const user = await getCurrentUser()
    setUser(user)
    setLoading(false)
  }

  const login = async (email, password) => {
    const { data, error } = await signIn(email, password)
    if (error) return { error }
    setUser(data.user)
    return { data }
  }

  const register = async (name, email, password, type) => {
    const { data, error } = await signUp(email, password, { name, type })
    if (error) return { error }
    return { data }
  }

  const logout = async () => {
    await signOut()
    setUser(null)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <BrowserRouter>
        <div className="app">
          <div className="bg-overlay"></div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:category" element={<Services />} />
            <Route path="/bookings" element={user ? <Bookings /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h4><i className="fas fa-bolt"></i> ServiceHub</h4>
            <p>Your one-stop marketplace for all household services. Book trusted professionals for restaurants, housework, laundry, and car wash.</p>
          </div>
          <div className="col-lg-2">
            <h4>Services</h4>
            <a href="#">Restaurants</a>
            <a href="#">Houseworkers</a>
            <a href="#">Laundry</a>
            <a href="#">Car Wash</a>
          </div>
          <div className="col-lg-2">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="col-lg-2">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
          <div className="col-lg-2">
            <h4>Contact</h4>
            <p><i className="fas fa-phone"></i> +250781155229</p>
            <p><i className="fas fa-map-marker-alt"></i> Rwanda</p>
          </div>
        </div>
        <div className="bottom">
          <p>&copy; 2026 ServiceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default App