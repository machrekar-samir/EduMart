import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

export default function VisionPage() {
  return (
    <main className="detail-page">
      <PageHero
        label="Our Vision"
        title="Empowering the Student Economy"
        description="More than a marketplace—a movement where knowledge becomes an asset."
      />
      <section className="section">
        <div className="container detail-content vision-detail">
          <blockquote className="vision-quote-inline">
            &ldquo;Empowering students to learn, earn, and grow through a single
            digital ecosystem.&rdquo;
          </blockquote>
          <p>
            EduMartX is more than a marketplace—it&apos;s a student economy where
            knowledge becomes an asset, skills become income, and opportunities
            become accessible to everyone.
          </p>
          <p>
            We envision a future where every college campus has a thriving digital
            economy: students helping students, AI lowering barriers to quality,
            and trust scores making peer-to-peer commerce as reliable as any
            major platform.
          </p>
          <ul className="vision-goals">
            <li>Democratize access to affordable learning materials</li>
            <li>Enable every student to monetize skills and notes fairly</li>
            <li>Connect campuses across India into one trusted network</li>
            <li>Use AI responsibly to uplift sellers, not replace them</li>
          </ul>
          <div className="detail-cta-row">
            <Link to="/get-started" className="btn btn-primary btn-lg">
              Join EduMartX Free
            </Link>
            <Link to="/features" className="btn btn-outline btn-lg">
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
