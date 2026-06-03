export default function FeatureCard({ feature }) {
  return (
    <article className="feature-card">
      <div className="feature-icon" style={{ background: feature.bg }}>
        {feature.icon}
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.desc}</p>
      {feature.items && (
        <ul className="feature-list">
          {feature.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {feature.services && (
        <div className="service-tags">
          {feature.services.map((s) => (
            <span key={s} className="service-tag">
              {s}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
