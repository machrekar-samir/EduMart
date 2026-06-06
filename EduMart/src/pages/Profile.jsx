import { useState } from 'react'
import PageHero from '../components/PageHero'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    year: user?.year || '',
    bio: user?.bio || '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { url } = await api.uploadAvatar(file)
      await updateProfile({ avatar: url })
      setMessage('Profile photo updated')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await updateProfile(form)
      setMessage('Profile saved')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main>
      <PageHero
        label="Student profile"
        title="Your campus identity"
        description="College, branch, and bio help buyers trust your listings."
      />
      <section className="section">
        <div className="container profile-form-wrap">
          <div className="profile-avatar-row">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="profile-avatar" />
            ) : (
              <div className="profile-avatar placeholder">{user?.name?.[0] || '?'}</div>
            )}
            <label className="btn btn-outline">
              Upload photo
              <input type="file" accept="image/*" hidden onChange={handleAvatar} />
            </label>
          </div>

          <form className="sell-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
            </label>
            <label>
              <span>College</span>
              <input value={form.college} onChange={(e) => update('college', e.target.value)} />
            </label>
            <label>
              <span>Branch</span>
              <input value={form.branch} onChange={(e) => update('branch', e.target.value)} />
            </label>
            <label>
              <span>Year</span>
              <input value={form.year} onChange={(e) => update('year', e.target.value)} />
            </label>
            <label>
              <span>Bio</span>
              <textarea rows={3} value={form.bio} onChange={(e) => update('bio', e.target.value)} />
            </label>
            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary">
              Save profile
            </button>
          </form>
          <p className="muted">Email: {user?.email}</p>
        </div>
      </section>
    </main>
  )
}
