import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import { api } from '../services/api'

export default function DigitalProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.getProducts({ category: 'digital' }).then(({ products: list }) => setProducts(list))
  }, [])

  return (
    <main>
      <PageHero
        label="Digital store"
        title="Digital products"
        description="Templates, prompt packs, design assets, and coding resources built for students."
      />
      <section className="section">
        <div className="container">
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="muted">No digital products yet. Be the first to list one!</p>
          )}
        </div>
      </section>
    </main>
  )
}
