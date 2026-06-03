import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Login.css'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogle = async () => {
    setError('')
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError('Google login: set VITE_GOOGLE_CLIENT_ID in .env')
      return
    }
    if (!window.google?.accounts?.id) {
      setError('Google script not loaded')
      return
    }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await googleLogin(response.credential)
          navigate(from, { replace: true })
        } catch (err) {
          setError(err.message)
        }
      },
    })
    window.google.accounts.id.prompt()
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
            <span>EduMart</span>
          </Link>
          <h1>Welcome back, student.</h1>
          <p>
            Sign in to manage listings, track orders, and connect with your
            campus marketplace.
          </p>
          <ul className="login-perks">
            <li>Email &amp; Google login with JWT</li>
            <li>Razorpay — UPI, cards, net banking</li>
            <li>Real-time buyer–seller chat</li>
          </ul>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Log in</h2>
            <p>
              New here?{' '}
              <Link to="/register" className="login-link">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-lg login-submit">
              Sign in
            </button>
          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="login-social">
            <button type="button" className="btn btn-social" onClick={handleGoogle}>
              Google
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
