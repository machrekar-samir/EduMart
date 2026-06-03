import PageHero from '../components/PageHero'

export default function TrustPage() {
  return (
    <main className="detail-page">
      <PageHero
        label="Trust & Safety"
        title="A Marketplace You Can Trust"
        description="Built-in verification and trust scores keep every transaction safe and authentic."
      />
      <section className="section section-alt">
        <div className="container">
          <div className="trust-grid">
            <article className="trust-card">
              <span className="trust-card-icon" aria-hidden="true">
                ⭐
              </span>
              <div>
                <h3>Student Trust Score</h3>
                <p>
                  Each user receives a trust score based on reviews, successful
                  transactions, profile verification, and community participation.
                  Higher scores unlock better visibility and buyer confidence.
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
                  Students can verify their identity using college email IDs for
                  increased trust and authenticity across the platform. Verified
                  sellers display a campus badge on every listing.
                </p>
                <div className="trust-factors">
                  {['.edu Email', 'ID Verification', 'Campus Badge'].map((f) => (
                    <span key={f} className="trust-factor">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </article>
            <article className="trust-card">
              <span className="trust-card-icon" aria-hidden="true">
                🔒
              </span>
              <div>
                <h3>Secure Transactions</h3>
                <p>
                  Escrow-style payments, dispute resolution, and encrypted
                  messaging protect both buyers and sellers throughout every deal.
                </p>
                <div className="trust-factors">
                  {['Escrow', 'Disputes', 'Encrypted Chat'].map((f) => (
                    <span key={f} className="trust-factor">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
