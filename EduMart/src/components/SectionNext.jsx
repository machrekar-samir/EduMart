import { Link } from 'react-router-dom'

export default function SectionNext({ to, label = 'Learn more' }) {
  return (
    <div className="section-next-wrap">
      <Link to={to} className="btn btn-next">
        {label}
        <span className="btn-next-arrow" aria-hidden="true">
          →
        </span>
      </Link>
    </div>
  )
}
