import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { api } from '../services/api'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState([])

  const load = () => {
    api.adminStats().then(setStats)
    api.adminProducts('pending').then(({ products }) => setPending(products))
  }

  useEffect(() => {
    load()
  }, [])

  const moderate = async (id, status) => {
    await api.adminApprove(id, status)
    load()
  }

  return (
    <main>
      <PageHero
        label="Admin"
        title="Admin dashboard"
        desc="Approve listings, remove spam, manage users, and view earnings."
      />
      <section className="section">
        <div className="container">
          {stats && (
            <div className="admin-stats">
              <div className="stat-card">
                <strong>{stats.users}</strong>
                <span>Users</span>
              </div>
              <div className="stat-card">
                <strong>{stats.products}</strong>
                <span>Listings</span>
              </div>
              <div className="stat-card">
                <strong>{stats.pendingListings}</strong>
                <span>Pending</span>
              </div>
              <div className="stat-card">
                <strong>₹{stats.totalEarnings}</strong>
                <span>Earnings</span>
              </div>
            </div>
          )}

          <h2>Pending approvals</h2>
          <ul className="admin-list">
            {pending.map((p) => (
              <li key={p._id}>
                <div>
                  <strong>{p.title}</strong>
                  <span className="muted">
                    {p.seller?.name} · ₹{p.price} · {p.category}
                  </span>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => moderate(p._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => moderate(p._id, 'rejected')}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => api.adminDeleteProduct(p._id).then(load)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {pending.length === 0 && <li className="muted">No pending listings.</li>}
          </ul>
        </div>
      </section>
    </main>
  )
}
