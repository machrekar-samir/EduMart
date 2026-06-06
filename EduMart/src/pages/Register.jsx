import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LogoIcon from '../components/LogoIcon'
import '../styles/Login.css'

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni']

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    year: '',
  })
  const [error, setError] = useState('')

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/marketplace')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
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
            <LogoIcon />
            <span>EduMartX</span>
          </Link>
          <h1>Join the campus marketplace.</h1>
          <p>
            Create your free account to buy notes, sell products, and connect
            with students across India.
          </p>
          <ul className="login-perks">
            <li>Verified college email signup</li>
            <li>List notes, books &amp; digital products</li>
            <li>Secure payments via Razorpay</li>
          </ul>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Create account</h2>
            <p>
              Already have one?{' '}
              <Link to="/login" className="login-link">
                Log in
              </Link>
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Full name</span>
              <input
                required
                placeholder="Your name"
                disabled={submitting}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </label>

            <label className="login-field">
              <span>College email</span>
              <input
                type="email"
                required
                placeholder="you@college.edu"
                autoComplete="email"
                disabled={submitting}
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <div className="login-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  disabled={submitting}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
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

            <div className="login-field-row">
              <label className="login-field">
                <span>College</span>
                <input
                  placeholder="Your college"
                  disabled={submitting}
                  value={form.college}
                  onChange={(e) => update('college', e.target.value)}
                />
              </label>
              <label className="login-field">
                <span>Branch</span>
                <input
                  placeholder="e.g. CSE"
                  disabled={submitting}
                  value={form.branch}
                  onChange={(e) => update('branch', e.target.value)}
                />
              </label>
            </div>

            <label className="login-field">
              <span>Year</span>
              <select
                value={form.year}
                onChange={(e) => update('year', e.target.value)}
                className="login-select"
                disabled={submitting}
              >
                <option value="">Select year</option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="login-footer-note">
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
