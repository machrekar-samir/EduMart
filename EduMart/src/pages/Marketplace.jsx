import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import { api } from '../services/api'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'notes', label: 'Notes' },
  { value: 'physical', label: 'Physical' },
  { value: 'digital', label: 'Digital' },
  { value: 'freelance', label: 'Freelance' },
]

export default function Marketplace() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [college, setCollege] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (category) params.category = category
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    if (college) params.college = college

    api
      .getProducts(params)
      .then(({ products: list }) => {
        if (!cancelled) setProducts(list)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [search, category, minPrice, maxPrice, college])

  return (
    <main className="marketplace-page">
      <PageHero
        label="Marketplace"
        title="Buy & sell on campus"
        desc="Search notes, books, digital products, and freelance services from verified students."
      />

      <section className="section">
        <div className="container">
          <div className="marketplace-toolbar">
            <input
              type="search"
              placeholder="Search listings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="marketplace-search"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <Link to="/sell" className="btn btn-primary">
              Sell
            </Link>
          </div>

          {loading ? (
            <p className="muted">Loading listings…</p>
          ) : products.length === 0 ? (
            <p className="muted">No listings match your filters.</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
