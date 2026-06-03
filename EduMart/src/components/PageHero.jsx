import { Link } from 'react-router-dom'

export default function PageHero({ label, title, description, backTo = '/' }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <Link to={backTo} className="back-link">
          ← Back to home
        </Link>
        {label && <p className="section-label">{label}</p>}
        <h1>{title}</h1>
        {description && <p className="page-hero-desc">{description}</p>}
      </div>
    </section>
  )
}
