import PageHero from '../components/PageHero'
import { AI_FEATURES } from '../data/content'

export default function AiToolsPage() {
  return (
    <main className="detail-page">
      <PageHero
        label="Smart AI Features"
        title="Powered by Intelligence, Built for Students"
        description="AI tools that help you price smarter, sell faster, and discover what matters most."
      />
      <section className="section">
        <div className="container">
          <div className="ai-grid">
            {AI_FEATURES.map((ai) => (
              <article key={ai.title} className="ai-card ai-card-expanded">
                <div className="ai-card-content">
                  <div className="feature-icon">{ai.icon}</div>
                  <h3>{ai.title}</h3>
                  <p>{ai.desc}</p>
                  <div className="ai-metrics">
                    {ai.metrics.map((m) => (
                      <span key={m} className="ai-metric">
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="ai-detail-note">
                    Our models analyze your uploads and browsing history to
                    deliver actionable insights—so you spend less time guessing
                    and more time earning.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
