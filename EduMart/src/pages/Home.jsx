import { Link } from 'react-router-dom'
import {
  FEATURES,
  AI_FEATURES,
  REVENUE,
  TAGLINES,
  AUDIENCE,
} from '../data/content'
import FeatureCard from '../components/FeatureCard'
import SectionNext from '../components/SectionNext'

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              India&apos;s First Complete Student Marketplace
            </div>
            <h1>
              Buy, Sell, Earn &amp;{' '}
              <span className="highlight">Grow</span> on Campus
            </h1>
            <p className="hero-desc">
              Buy and sell notes, books, digital products, freelance services,
              and student essentials—all in one trusted platform built
              exclusively for college students.
            </p>
            <div className="hero-ctas">
              <Link to="/marketplace" className="btn btn-primary btn-lg">
                Browse Marketplace
              </Link>
              <Link to="/sell" className="btn btn-outline btn-lg">
                Start Selling Today
              </Link>
              <Link to="/register" className="btn btn-ghost btn-lg">
                Create Account
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>10K+</strong>
                <span>Active Students</span>
              </div>
              <div className="stat">
                <strong>50K+</strong>
                <span>Listings</span>
              </div>
              <div className="stat">
                <strong>500+</strong>
                <span>Colleges</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card-stack">
              <div className="floating-card">
                <div className="floating-card-header">
                  <div
                    className="floating-card-icon"
                    style={{ background: '#e0f2fe' }}
                  >
                    📚
                  </div>
                  <div>
                    <h4>Engineering Notes – Sem 4</h4>
                    <p>AI Quality Score: 94%</p>
                  </div>
                </div>
                <span className="trust-pill">✓ AI Verified · ₹299</span>
              </div>
              <div className="floating-card">
                <div className="floating-card-header">
                  <div
                    className="floating-card-icon"
                    style={{ background: '#d1fae5' }}
                  >
                    💻
                  </div>
                  <div>
                    <h4>Website Development</h4>
                    <p>Freelance · 4.9★ rating</p>
                  </div>
                </div>
                <span className="trust-pill">✓ College Verified</span>
              </div>
              <div className="floating-card">
                <div className="floating-card-header">
                  <div
                    className="floating-card-icon"
                    style={{ background: '#fef3c7' }}
                  >
                    🚀
                  </div>
                  <div>
                    <h4>Internship – Product Design</h4>
                    <p>Remote · Stipend ₹15K/mo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container intro-grid">
          <div className="intro-content">
            <p className="section-label">About EduMartX</p>
            <h2>The Ultimate Student Marketplace</h2>
            <p>
              EduMartX is an all-in-one marketplace designed exclusively for
              college students, creating a smart ecosystem where students can
              buy, sell, earn, and grow.
            </p>
            <p>
              Whether it&apos;s engineering books, study notes, project reports,
              resume templates, digital resources, freelance services, or
              internship opportunities—EduMartX brings everything together in
              one trusted platform.
            </p>
            <div className="tagline-list">
              {TAGLINES.map((tag) => (
                <span key={tag} className="tagline-chip">
                  {tag}
                </span>
              ))}
            </div>
            <SectionNext to="/about" label="Read full story" />
          </div>
          <div className="intro-cards">
            <div className="intro-mini-card">
              <div className="emoji">📖</div>
              <strong>Learn</strong>
            </div>
            <div className="intro-mini-card">
              <div className="emoji">💰</div>
              <strong>Earn</strong>
            </div>
            <div className="intro-mini-card">
              <div className="emoji">📈</div>
              <strong>Grow</strong>
            </div>
            <div className="intro-mini-card">
              <div className="emoji">🤝</div>
              <strong>Connect</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="features">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Key Features</p>
            <h2>Everything Students Need in One Place</h2>
            <p>
              From textbooks to templates, gigs to internships—your complete
              campus economy starts here.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
          <SectionNext to="/features" label="Features page" />
        </div>
      </section>

      <section className="section" id="ai">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Smart AI Features</p>
            <h2>Powered by Intelligence, Built for Students</h2>
            <p>
              AI tools that help you price smarter, sell faster, and discover
              what matters most.
            </p>
          </div>
          <div className="ai-grid">
            {AI_FEATURES.map((ai) => (
              <article key={ai.title} className="ai-card">
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
                </div>
              </article>
            ))}
          </div>
          <SectionNext to="/ai-tools" label="Explore AI tools" />
        </div>
      </section>

      <section className="section section-alt" id="trust">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Trust &amp; Safety</p>
            <h2>A Marketplace You Can Trust</h2>
            <p>
              Built-in verification and trust scores keep every transaction
              safe and authentic.
            </p>
          </div>
          <div className="trust-grid">
            <article className="trust-card">
              <span className="trust-card-icon" aria-hidden="true">
                ⭐
              </span>
              <div>
                <h3>Student Trust Score</h3>
                <p>
                  Each user receives a trust score based on reviews,
                  successful transactions, profile verification, and community
                  participation.
                </p>
                <div className="trust-factors">
                  {['Reviews', 'Transactions', 'Verification', 'Community'].map(
                    (f) => (
                      <span key={f} className="trust-factor">
                        {f}
                      </span>
                    )
                  )}
                </div>
              </div>
            </article>
            <article className="trust-card">
              <span className="trust-card-icon" aria-hidden="true">
                ✅
              </span>
              <div>
                <h3>College Verification</h3>
                <p>
                  Students can verify their identity using college email IDs
                  for increased trust and authenticity across the platform.
                </p>
                <div className="trust-factors">
                  {['.edu Email', 'ID Verification', 'Campus Badge'].map(
                    (f) => (
                      <span key={f} className="trust-factor">
                        {f}
                      </span>
                    )
                  )}
                </div>
              </div>
            </article>
          </div>
          <SectionNext to="/trust" label="Trust & safety page" />
        </div>
      </section>

      <section className="section" id="revenue">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Revenue Model</p>
            <h2>Sustainable Growth for Everyone</h2>
            <p>
              A fair model that keeps the platform free for students while
              rewarding quality sellers.
            </p>
          </div>
          <div className="revenue-grid">
            {REVENUE.map((item) => (
              <article key={item.title} className="revenue-card">
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
          <SectionNext to="/revenue" label="Revenue model page" />
        </div>
      </section>

      <section className="section section-alt" id="audience">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Target Audience</p>
            <h2>Built for the Student Economy</h2>
            <p>
              Whether you&apos;re buying your first textbook or launching a
              campus startup—EduMartX is for you.
            </p>
          </div>
          <div className="audience-grid">
            {AUDIENCE.map((group) => (
              <span key={group} className="audience-chip">
                {group}
              </span>
            ))}
          </div>
          <SectionNext to="/audience" label="Who we serve" />
        </div>
      </section>

      <section className="vision-section" id="vision">
        <div className="container vision-content">
          <p
            className="section-label"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Our Vision
          </p>
          <blockquote className="vision-quote">
            &ldquo;Empowering students to learn, earn, and grow through a single
            digital ecosystem.&rdquo;
          </blockquote>
          <p className="vision-desc">
            EduMartX is more than a marketplace—it&apos;s a student economy where
            knowledge becomes an asset, skills become income, and opportunities
            become accessible to everyone.
          </p>
          <div className="vision-ctas">
            <Link to="/get-started" className="btn btn-primary btn-lg">
              Join EduMartX Free
            </Link>
            <Link to="/vision" className="btn btn-outline btn-lg">
              Explore Our Vision
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
