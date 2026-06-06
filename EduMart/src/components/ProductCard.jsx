import { Link } from 'react-router-dom'

const CATEGORY_LABELS = {
  notes: 'Notes',
  physical: 'Physical',
  digital: 'Digital',
  freelance: 'Freelance',
}

const CATEGORY_ICONS = {
  notes: '📚',
  physical: '📦',
  digital: '💾',
  freelance: '💻',
}

function pseudoRating(id) {
  const seed = String(id).slice(-4)
  const n = parseInt(seed, 16) % 20
  return (4 + n / 20).toFixed(1)
}

export default function ProductCard({ product, sellerMode = false, onEdit }) {
  const image = product.images?.[0]
  const sellerName = product.seller?.name || 'Student'
  const rating = pseudoRating(product._id)
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category
  const placeholder = CATEGORY_ICONS[product.category] || '🛍️'

  const cardContent = (
    <>
      <div className="product-card-image">
        {image ? (
          <img src={image} alt={product.title} loading="lazy" />
        ) : (
          <span className="product-card-placeholder">{placeholder}</span>
        )}
        <span className="product-card-category">{categoryLabel}</span>
      </div>
      <div className="product-card-body">
        <h3>{product.title}</h3>
        <div className="product-card-rating">
          <span className="product-card-stars" aria-label={`${rating} out of 5`}>
            ★ {rating}
          </span>
          <span className="product-card-campus">Campus verified</span>
        </div>
        <div className="product-card-pricing">
          <span className="product-card-price">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="product-card-seller">{sellerName}</p>
        {product.college && (
          <p className="product-card-delivery">📍 {product.college}</p>
        )}
      </div>
    </>
  )

  if (sellerMode) {
    return (
      <article className="product-card product-card-seller">
        <Link to={`/product/${product._id}`} className="product-card-link">
          {cardContent}
        </Link>
        <button
          type="button"
          className="btn btn-outline product-card-edit-btn"
          onClick={(e) => {
            e.preventDefault()
            onEdit?.()
          }}
        >
          Edit listing
        </button>
      </article>
    )
  }

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {cardContent}
    </Link>
  )
}
