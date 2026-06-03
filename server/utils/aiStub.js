/** Version 2 placeholders — swap with real AI APIs later */

export function suggestNotePrice(category, qualityScore = 85) {
  if (category === 'notes') {
    const min = qualityScore >= 90 ? 79 : 49
    const max = qualityScore >= 90 ? 99 : 79
    return `Your notes can be sold between ₹${min}-₹${max}`
  }
  return null
}

export function analyzeNotesQuality() {
  return {
    qualityScore: null,
    readabilityScore: null,
    completenessScore: null,
    message: 'AI Notes Quality Checker — coming in Version 2',
  }
}
