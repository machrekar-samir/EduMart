import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Login.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
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
    setError('')
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <div className="login-card" style={{ maxWidth: 480, margin: 'auto' }}>
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
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
            </label>
            <label className="login-field">
              <span>College email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </label>
            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
              />
            </label>
            <label className="login-field">
              <span>College</span>
              <input value={form.college} onChange={(e) => update('college', e.target.value)} />
            </label>
            <label className="login-field">
              <span>Branch</span>
              <input value={form.branch} onChange={(e) => update('branch', e.target.value)} />
            </label>
            <label className="login-field">
              <span>Year</span>
              <input value={form.year} onChange={(e) => update('year', e.target.value)} />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-lg login-submit">
              Register
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
