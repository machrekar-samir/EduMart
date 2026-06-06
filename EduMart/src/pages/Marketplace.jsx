import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import ProductCard from '../components/ProductCard'
import EditProductModal from '../components/EditProductModal'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

const CATEGORIES = [
  { value: '', label: 'All', icon: '🏪' },
  { value: 'notes', label: 'Notes', icon: '📚' },
  { value: 'physical', label: 'Books & Gear', icon: '📦' },
  { value: 'digital', label: 'Digital', icon: '💾' },
  { value: 'freelance', label: 'Services', icon: '💻' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

function useProductSocket(handlers) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })

    const onCreated = (data) => handlersRef.current.onCreated?.(data)
    const onUpdated = (data) => handlersRef.current.onUpdated?.(data)
    const onDeleted = (data) => handlersRef.current.onDeleted?.(data)

    socket.on('product_created', onCreated)
    socket.on('product_updated', onUpdated)
    socket.on('product_deleted', onDeleted)

    return () => {
      socket.off('product_created', onCreated)
      socket.off('product_updated', onUpdated)
      socket.off('product_deleted', onDeleted)
      socket.disconnect()
    }
  }, [])
}

function BuyerView() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [college, setCollege] = useState('')
  const [sort, setSort] = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchProducts = () => {
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (category) params.category = category
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    if (college) params.college = college
    return api.getProducts(params)
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchProducts()
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
  }, [debouncedSearch, category, minPrice, maxPrice, college])

  const matchesFilters = (p) => {
    if (category && p.category !== category) return false
    if (minPrice && p.price < Number(minPrice)) return false
    if (maxPrice && p.price > Number(maxPrice)) return false
    if (college && !p.college?.toLowerCase().includes(college.toLowerCase())) return false
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      const hay = `${p.title} ${p.description}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return p.status === 'approved'
  }

  useProductSocket({
    onCreated: ({ product }) => {
      if (product.status !== 'approved') return
      if (!matchesFilters(product)) return
      setProducts((prev) => {
        if (prev.some((p) => p._id === product._id)) return prev
        return [product, ...prev]
      })
    },
    onUpdated: ({ product }) => {
      if (product.status !== 'approved') {
        setProducts((prev) => prev.filter((p) => p._id !== product._id))
        return
      }
      setProducts((prev) => {
        const exists = prev.some((p) => p._id === product._id)
        if (!matchesFilters(product)) return prev.filter((p) => p._id !== product._id)
        if (exists) return prev.map((p) => (p._id === product._id ? product : p))
        return [product, ...prev]
      })
    },
    onDeleted: ({ productId }) => {
      setProducts((prev) => prev.filter((p) => p._id !== productId))
    },
  })

  const sortedProducts = useMemo(() => {
    const list = [...products]
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    return list
  }, [products, sort])

  const featured = sortedProducts.slice(0, 8)
  const deals = sortedProducts.filter((p) => p.price <= 500).slice(0, 6)

  return (
    <>
      <section className="mp-hero mp-hero-tools">
        <div className="container">
          <div className="mp-search-bar">
            <span className="mp-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              placeholder="Search notes, books, templates, services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              className="mp-search-input"
              aria-label="Search products"
            />
          </div>

          <div className="mp-category-strip" role="tablist" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                role="tab"
                aria-selected={category === c.value}
                className={`mp-category-chip ${category === c.value ? 'active' : ''}`}
                onClick={() => setCategory(c.value)}
              >
                <span aria-hidden="true">{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section mp-body">
        <div className="container mp-layout">
          <aside className={`mp-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="mp-sidebar-header">
              <h3>Filters</h3>
              <button
                type="button"
                className="mp-filter-close"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <label className="mp-filter-group">
              <span>College</span>
              <input
                type="text"
                placeholder="Filter by college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </label>

            <label className="mp-filter-group">
              <span>Min price (₹)</span>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </label>

            <label className="mp-filter-group">
              <span>Max price (₹)</span>
              <input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="btn btn-ghost mp-clear-filters"
              onClick={() => {
                setCategory('')
                setCollege('')
                setMinPrice('')
                setMaxPrice('')
                setSearch('')
              }}
            >
              Clear all
            </button>
          </aside>

          <div className="mp-main">
            <div className="mp-toolbar">
              <p className="mp-result-count" aria-live="polite">
                {loading
                  ? 'Loading…'
                  : `${sortedProducts.length} result${sortedProducts.length === 1 ? '' : 's'}`}
              </p>
              <div className="mp-toolbar-actions">
                <button
                  type="button"
                  className="btn btn-outline mp-filter-toggle"
                  onClick={() => setFiltersOpen(true)}
                >
                  Filters
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="mp-sort"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!loading && featured.length > 0 && !debouncedSearch && !category && (
              <section className="mp-section-block">
                <div className="mp-section-head">
                  <h2>Top picks for you</h2>
                  <span>Curated for students</span>
                </div>
                <div className="mp-scroll-row">
                  {featured.map((p) => (
                    <ProductCard key={`feat-${p._id}`} product={p} />
                  ))}
                </div>
              </section>
            )}

            {!loading && deals.length > 0 && !debouncedSearch && (
              <section className="mp-section-block">
                <div className="mp-section-head">
                  <h2>Deals under ₹500</h2>
                  <span>Best value picks</span>
                </div>
                <div className="mp-scroll-row">
                  {deals.map((p) => (
                    <ProductCard key={`deal-${p._id}`} product={p} />
                  ))}
                </div>
              </section>
            )}

            <section className="mp-section-block">
              <div className="mp-section-head">
                <h2>
                  {category
                    ? CATEGORIES.find((c) => c.value === category)?.label
                    : 'All products'}
                </h2>
              </div>

              {loading ? (
                <div className="mp-skeleton-grid">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="mp-skeleton-card" />
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="mp-empty">
                  <p>No listings match your filters.</p>
                  <Link to="/marketplace/seller" className="btn btn-primary">
                    Switch to seller view
                  </Link>
                </div>
              ) : (
                <div className="product-grid product-grid-ecommerce">
                  {sortedProducts.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      {filtersOpen && (
        <button
          type="button"
          className="mp-filter-backdrop"
          aria-label="Close filters"
          onClick={() => setFiltersOpen(false)}
        />
      )}
    </>
  )
}

function SellerView() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const loadListings = () => {
    setLoading(true)
    api
      .getMyProducts()
      .then(({ products }) => setListings(products.filter((p) => p.status !== 'pending')))
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadListings()
  }, [])

  useProductSocket({
    onCreated: ({ product }) => {
      if (String(product.seller?._id ?? product.seller) !== String(user?._id)) return
      setListings((prev) => {
        if (prev.some((p) => p._id === product._id)) return prev
        return [product, ...prev]
      })
    },
    onUpdated: ({ product }) => {
      if (String(product.seller?._id ?? product.seller) !== String(user?._id)) return
      setListings((prev) => prev.map((p) => (p._id === product._id ? product : p)))
    },
    onDeleted: ({ productId }) => {
      setListings((prev) => prev.filter((p) => p._id !== productId))
    },
  })

  const liveCount = listings.filter((p) => p.status === 'approved').length

  return (
    <section className="section mp-body">
      <div className="container">
        <div className="mp-seller-header">
          <div>
            <h2>Seller hub</h2>
            <p>
              Welcome, {user?.name?.split(' ')[0] || 'Seller'}. Manage your listings
              and grow your campus store.
            </p>
          </div>
          <Link to="/sell" className="btn btn-primary">
            + List new product
          </Link>
        </div>

        <div className="mp-seller-stats">
          <div className="mp-seller-stat">
            <strong>{listings.length}</strong>
            <span>Total listings</span>
          </div>
          <div className="mp-seller-stat">
            <strong>{liveCount}</strong>
            <span>Live on marketplace</span>
          </div>
        </div>

        {loading ? (
          <div className="mp-skeleton-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mp-skeleton-card" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="mp-empty mp-seller-empty">
            <p>You haven&apos;t listed anything yet.</p>
            <Link to="/sell" className="btn btn-primary">
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="product-grid product-grid-ecommerce">
            {listings.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                sellerMode
                onEdit={() => setEditing(p)}
              />
            ))}
          </div>
        )}

        {editing && (
          <EditProductModal
            product={editing}
            onClose={() => setEditing(null)}
            onSaved={(updated) =>
              setListings((prev) =>
                prev.map((p) => (p._id === updated._id ? updated : p))
              )
            }
            onDeleted={(id) =>
              setListings((prev) => prev.filter((p) => p._id !== id))
            }
          />
        )}
      </div>
    </section>
  )
}

export default function Marketplace() {
  const location = useLocation()
  const isSellerView = location.pathname.includes('/seller')

  return (
    <main className="marketplace-page">
      <section className="mp-hero">
        <div className="container">
          <div className="mp-hero-top">
            <div>
              <p className="mp-hero-label">Campus Store</p>
              <h1>
                {isSellerView ? 'Manage your listings' : 'Shop built for students'}
              </h1>
              <p className="mp-hero-desc">
                {isSellerView
                  ? 'Edit prices, update images, and manage your campus store — listings go live instantly.'
                  : 'Notes, books, digital downloads & freelance gigs — verified by your campus community.'}
              </p>
            </div>
          </div>

          <nav className="mp-view-tabs" aria-label="Marketplace views">
            <NavLink
              to="/marketplace"
              end
              className={({ isActive }) =>
                `mp-view-tab ${isActive ? 'active' : ''}`
              }
            >
              For Buyers
            </NavLink>
            <NavLink
              to="/marketplace/seller"
              className={({ isActive }) =>
                `mp-view-tab ${isActive ? 'active' : ''}`
              }
            >
              For Sellers
            </NavLink>
          </nav>
        </div>
      </section>

      {isSellerView ? <SellerView /> : <BuyerView />}
    </main>
  )
}
