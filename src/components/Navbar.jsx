import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../App'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-bolt"></i> ServiceHub
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/services')}`} to="/services">Services</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/bookings')}`} to="/bookings">My Bookings</Link>
              </li>
            )}
            {user && user.user_metadata?.type === 'provider' && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
          <div className="d-flex gap-2">
            {user ? (
              <>
                <span className="nav-link">{user.user_metadata?.name || user.email}</span>
                <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary" to="/login">Login</Link>
                <Link className="btn btn-primary" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}