import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const image = product.images?.[0]
  const sellerName = product.seller?.name || 'Student'

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-image">
        {image ? (
          <img src={image} alt="" />
        ) : (
          <span className="product-card-placeholder">
            {product.category === 'notes' ? '📚' : product.category === 'freelance' ? '💻' : '🛍️'}
          </span>
        )}
        <span className="product-card-category">{product.category}</span>
      </div>
      <div className="product-card-body">
        <h3>{product.title}</h3>
        <p className="product-card-seller">{sellerName}</p>
        <p className="product-card-price">₹{product.price}</p>
      </div>
    </Link>
  )
}
