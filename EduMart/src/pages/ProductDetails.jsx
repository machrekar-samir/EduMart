import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    api
      .getProduct(id)
      .then(({ product: p }) => setProduct(p))
      .catch((e) => setError(e.message))
  }, [id])

  const handleChat = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }
    const { conversation } = await api.startConversation({ productId: id })
    navigate(`/chat/${conversation._id}`)
  }

  const handleBuy = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setPaying(true)
    setError('')
    try {
      const orderData = await api.createPaymentOrder(id)

      if (orderData.demo) {
        await api.verifyPayment({
          orderId: orderData.orderId,
          razorpay_order_id: 'demo',
          razorpay_payment_id: 'demo',
        })
        alert('Demo payment successful! Configure Razorpay for UPI, Cards & Net Banking.')
        navigate('/dashboard')
        return
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EduMart',
        description: product.title,
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          await api.verifyPayment({
            orderId: orderData.orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          navigate('/dashboard')
        },
      }

      const rz = new window.Razorpay(options)
      rz.open()
    } catch (e) {
      setError(e.message)
    } finally {
      setPaying(false)
    }
  }

  if (error && !product) {
    return (
      <main className="section">
        <div className="container">
          <p>{error}</p>
          <Link to="/marketplace">← Marketplace</Link>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="page-loading">
        <p>Loading…</p>
      </main>
    )
  }

  const isSeller =
    user?._id &&
    String(user._id) === String(product.seller?._id ?? product.seller)

  return (
    <main className="product-detail-page section">
      <div className="container product-detail-grid">
        <div className="product-detail-gallery">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} />
          ) : (
            <div className="product-detail-placeholder">No image</div>
          )}
        </div>
        <div className="product-detail-info">
          <Link to="/marketplace" className="back-link">
            ← Marketplace
          </Link>
          <span className="trust-pill">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="product-detail-price">₹{product.price}</p>
          {product.aiPriceHint && (
            <p className="ai-hint-badge">🤖 {product.aiPriceHint} (V2 AI)</p>
          )}
          <p>{product.description}</p>
          <p className="muted">
            Seller: {product.seller?.name}
            {product.seller?.college ? ` · ${product.seller.college}` : ''}
          </p>
          {product.notesPdf && (
            <p className="notes-badge">📄 Notes PDF included after purchase</p>
          )}

          <div className="product-detail-actions">
            {!isSeller && product.status === 'approved' && (
              <>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleBuy}
                  disabled={paying}
                >
                  {paying ? 'Processing…' : 'Buy now (Razorpay)'}
                </button>
                <button type="button" className="btn btn-outline" onClick={handleChat}>
                  Chat with seller
                </button>
              </>
            )}
            {product.status === 'pending' && (
              <p className="muted">Listing pending admin approval.</p>
            )}
            {product.status === 'sold' && <p className="muted">This item has been sold.</p>}
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
      </div>
    </main>
  )
}
