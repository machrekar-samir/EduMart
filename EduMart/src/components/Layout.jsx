import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/content'

export default function Layout() {
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
            <Link to="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link to="/get-started" className="btn btn-primary">
              Get Started
            </Link>
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
          <NavLink to="/login" onClick={closeMenu}>
            Log in
          </NavLink>
          <NavLink to="/get-started" className="mobile-cta" onClick={closeMenu}>
            Get Started
          </NavLink>
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
              <Link to="/features">Features</Link>
              <Link to="/about">About</Link>
              <Link to="/audience">Audience</Link>
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
              <Link to="/get-started">Get Started</Link>
              <Link to="/vision">Our Vision</Link>
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
