import PageHero from '../components/PageHero'
import { REVENUE } from '../data/content'

export default function RevenuePage() {
  return (
    <main className="detail-page">
      <PageHero
        label="Revenue Model"
        title="Sustainable Growth for Everyone"
        description="A fair model that keeps the platform free for students while rewarding quality sellers."
      />
      <section className="section">
        <div className="container">
          <div className="revenue-grid">
            {REVENUE.map((item) => (
              <article key={item.title} className="revenue-card revenue-card-full">
                <h4>
                  <span aria-hidden="true">{item.icon}</span>
                  {item.title}
                  {item.premium && (
                    <span className="premium-badge">Premium</span>
                  )}
                </h4>
                <p>{item.desc}</p>
                {item.items && (
                  <ul>
                    {item.items.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
