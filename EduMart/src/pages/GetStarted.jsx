import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GET_STARTED_STEPS } from '../data/content'

export default function GetStarted() {
  const [step, setStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedInterests, setSelectedInterests] = useState([])
  const navigate = useNavigate()

  const current = GET_STARTED_STEPS[step]
  const isLast = step === GET_STARTED_STEPS.length - 1
  const totalSteps = GET_STARTED_STEPS.length

  const toggleInterest = (item) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const canGoNext = () => {
    if (step === 0) return selectedRole !== ''
    if (step === 2) return selectedInterests.length > 0
    return true
  }

  const handleNext = () => {
    if (isLast) {
      navigate('/login')
      return
    }
    if (canGoNext()) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  return (
    <main className="get-started-page">
      <div className="container get-started-inner">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>

        <div className="get-started-progress" aria-label="Onboarding progress">
          {GET_STARTED_STEPS.map((_, i) => (
            <span
              key={i}
              className={`progress-dot ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            />
          ))}
        </div>
        <p className="progress-label">
          Step {step + 1} of {totalSteps}
        </p>

        <div className="get-started-card">
          <p className="section-label">{current.subtitle}</p>
          <h1>{current.title}</h1>
          <p className="get-started-body">{current.body}</p>

          {step === 0 && (
            <div className="option-grid" role="group" aria-label="How will you use EduMartX?">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`option-chip ${selectedRole === opt ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="get-started-fields">
              {current.fields.map((field) => (
                <label key={field} className="login-field">
                  <span>{field}</span>
                  <input type="text" placeholder={`Enter ${field.toLowerCase()}`} />
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="option-grid" role="group" aria-label="Your interests">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`option-chip ${selectedInterests.includes(opt) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="get-started-success">
              <span className="success-icon" aria-hidden="true">
                ✓
              </span>
              <p>Your profile is ready. Sign in to start exploring.</p>
            </div>
          )}

          <div className="get-started-actions">
            {step > 0 && (
              <button type="button" className="btn btn-ghost" onClick={handleBack}>
                Back
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary btn-next-step"
              onClick={handleNext}
              disabled={!canGoNext() && !isLast}
            >
              {isLast ? 'Go to login' : 'Next'}
              {!isLast && (
                <span className="btn-next-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
