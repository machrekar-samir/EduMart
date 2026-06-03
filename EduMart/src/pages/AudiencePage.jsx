import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { AUDIENCE } from '../data/content'

export default function AudiencePage() {
  return (
    <main className="detail-page">
      <PageHero
        label="Target Audience"
        title="Built for the Student Economy"
        description="Whether you're buying your first textbook or launching a campus startup—EduMartX is for you."
      />
      <section className="section section-alt">
        <div className="container detail-content">
          <div className="audience-grid audience-grid-large">
            {AUDIENCE.map((group) => (
              <span key={group} className="audience-chip audience-chip-large">
                {group}
              </span>
            ))}
          </div>
          <p className="audience-detail-text">
            EduMartX serves every corner of campus life—from first-year students
            hunting for affordable textbooks to graduating seniors selling laptops
            and freelancers building portfolios. Campus entrepreneurs use our
            platform to test ideas, list digital products, and reach buyers who
            share their college network.
          </p>
          <div className="detail-cta-row">
            <Link to="/get-started" className="btn btn-primary btn-lg">
              Join as a student
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
