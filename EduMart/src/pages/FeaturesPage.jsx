import PageHero from '../components/PageHero'
import FeatureCard from '../components/FeatureCard'
import { FEATURES } from '../data/content'

export default function FeaturesPage() {
  return (
    <main className="detail-page">
      <PageHero
        label="Key Features"
        title="Everything Students Need in One Place"
        description="From textbooks to templates, gigs to internships—your complete campus economy."
      />
      <section className="section section-alt">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
