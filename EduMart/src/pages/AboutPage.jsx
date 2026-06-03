import PageHero from '../components/PageHero'
import { TAGLINES } from '../data/content'

export default function AboutPage() {
  return (
    <main className="detail-page">
      <PageHero
        label="About EduMartX"
        title="The Ultimate Student Marketplace"
        description="An all-in-one ecosystem where college students buy, sell, earn, and grow."
      />
      <section className="section">
        <div className="container detail-content">
          <p>
            EduMartX is an all-in-one marketplace designed exclusively for
            college students, creating a smart ecosystem where students can buy,
            sell, earn, and grow.
          </p>
          <p>
            Whether it&apos;s engineering books, study notes, project reports,
            resume templates, digital resources, freelance services, or
            internship opportunities—EduMartX brings everything together in one
            trusted platform.
          </p>
          <p>
            We believe every student deserves access to affordable learning
            materials, fair earning opportunities, and a community that
            understands campus life. Our platform is built by students, for
            students—with AI tools that make selling smarter and buying safer.
          </p>
          <h3>Our taglines</h3>
          <div className="tagline-list">
            {TAGLINES.map((tag) => (
              <span key={tag} className="tagline-chip">
                {tag}
              </span>
            ))}
          </div>
          <div className="intro-cards detail-pillars">
            <div className="intro-mini-card">
              <div className="emoji">📖</div>
              <strong>Learn</strong>
              <p>Access quality notes and resources</p>
            </div>
            <div className="intro-mini-card">
              <div className="emoji">💰</div>
              <strong>Earn</strong>
              <p>Monetize your knowledge and skills</p>
            </div>
            <div className="intro-mini-card">
              <div className="emoji">📈</div>
              <strong>Grow</strong>
              <p>Build your career on campus</p>
            </div>
            <div className="intro-mini-card">
              <div className="emoji">🤝</div>
              <strong>Connect</strong>
              <p>Join a thriving student community</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
