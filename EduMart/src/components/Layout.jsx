import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/content'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app">
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="logo" aria-label="EduMartX Home">
            <span className="logo-icon" aria-hidden="true">
              
            </span>
            <span>EduMart</span>
          </Link>

          <nav className="nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-ghost">
                  Dashboard
                </Link>
                <Link to="/sell" className="btn btn-primary">
                  Sell
                </Link>
                <button type="button" className="btn btn-ghost" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav
          className={`mobile-nav ${menuOpen ? 'open' : ''}`}
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/chat" onClick={closeMenu}>
                Chat
              </NavLink>
              <NavLink to="/profile" onClick={closeMenu}>
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Log in
              </NavLink>
              <NavLink to="/register" className="mobile-cta" onClick={closeMenu}>
                Get Started
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <Outlet />

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="logo">
                <span className="logo-icon" aria-hidden="true">
                  E
                </span>
                <span>EduMartX</span>
              </Link>
              <p>The marketplace built for students. Learn. Earn. Grow.</p>
            </div>
            <div className="footer-links">
              <h4>Marketplace</h4>
              <Link to="/marketplace">Browse</Link>
              <Link to="/digital">Digital</Link>
              <Link to="/freelance">Freelance</Link>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <Link to="/ai-tools">AI Features</Link>
              <Link to="/trust">Trust &amp; Safety</Link>
              <Link to="/revenue">Pricing</Link>
            </div>
            <div className="footer-links">
              <h4>Account</h4>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} EduMartX. All rights reserved.</span>
            <span>Made for students, by students.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
