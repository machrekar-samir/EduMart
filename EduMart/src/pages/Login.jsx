import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Login.css'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <main className="login-page">
      <div className="login-bg" aria-hidden="true">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid-pattern" />
      </div>

      <div className="login-shell">
        <div className="login-brand-panel">
          <Link to="/" className="logo login-logo">
            <span className="logo-icon" aria-hidden="true">
              E
            </span>
            <span>EduMartX</span>
          </Link>
          <h1>Welcome back, student.</h1>
          <p>
            Sign in to manage listings, track orders, and connect with your
            campus marketplace.
          </p>
          <ul className="login-perks">
            <li>AI-powered pricing for your notes</li>
            <li>College-verified buyer trust</li>
            <li>Freelance gigs &amp; digital store</li>
          </ul>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Log in</h2>
            <p>
              New here?{' '}
              <Link to="/get-started" className="login-link">
                Create an account
              </Link>
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>College email</span>
              <input
                type="email"
                name="email"
                placeholder="you@college.edu"
                autoComplete="email"
                required
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <div className="login-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="login-row">
              <label className="login-checkbox">
                <input type="checkbox" name="remember" />
                <span>Remember me</span>
              </label>
              <a href="#reset" className="login-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary btn-lg login-submit">
              Sign in
            </button>
          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="login-social">
            <button type="button" className="btn btn-social">
              Google
            </button>
            <button type="button" className="btn btn-social">
              Microsoft
            </button>
          </div>

          <p className="login-footer-note">
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
