import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.getMyProducts().then(({ products }) => setListings(products))
    api.getOrders().then(({ orders: o }) => setOrders(o)).catch(() => {})
  }, [])

  return (
    <main>
      <PageHero
        label="Dashboard"
        title={`Hi, ${user?.name?.split(' ')[0] || 'Student'}`}
        desc="Manage listings, track orders, and grow your campus store."
      />
      <section className="section">
        <div className="container dashboard-grid">
          <div className="dashboard-card">
            <h3>Quick actions</h3>
            <div className="dashboard-actions">
              <Link to="/sell" className="btn btn-primary">
                Sell product
              </Link>
              <Link to="/marketplace" className="btn btn-outline">
                Browse marketplace
              </Link>
              <Link to="/chat" className="btn btn-ghost">
                Messages
              </Link>
              <Link to="/profile" className="btn btn-ghost">
                Edit profile
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline">
                  Admin panel
                </Link>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Your listings ({listings.length})</h3>
            <ul className="dashboard-list">
              {listings.map((p) => (
                <li key={p._id}>
                  <Link to={`/product/${p._id}`}>{p.title}</Link>
                  <span className={`status-pill status-${p.status}`}>{p.status}</span>
                  <span>₹{p.price}</span>
                </li>
              ))}
              {listings.length === 0 && <li className="muted">No listings yet.</li>}
            </ul>
          </div>

          <div className="dashboard-card">
            <h3>Orders</h3>
            <ul className="dashboard-list">
              {orders.map((o) => (
                <li key={o._id}>
                  {o.product?.title || 'Product'} — ₹{o.amount} — {o.status}
                </li>
              ))}
              {orders.length === 0 && <li className="muted">No orders yet.</li>}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
