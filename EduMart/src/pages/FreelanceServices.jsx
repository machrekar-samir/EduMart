import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import { api } from '../services/api'

export default function FreelanceServices() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.getProducts({ category: 'freelance' }).then(({ products: list }) => setProducts(list))
  }, [])

  return (
    <main>
      <PageHero
        label="Freelance hub"
        title="Student freelance services"
        description="Web dev, design, editing, resumes, and more — hire peers on your campus."
      />
      <section className="section">
        <div className="container">
          <div className="hero-ctas" style={{ marginBottom: '2rem' }}>
            <Link to="/sell" className="btn btn-primary">
              Offer a service
            </Link>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="muted">No freelance gigs yet. Post your skills!</p>
          )}
        </div>
      </section>
    </main>
  )
}
