"use client"
import { useState, useEffect, useRef } from 'react'
import Card from "@/components/ui/Card"
import Button from '@/components/ui/Button'
import BackToTopButton from '@/components/ui/BacktoTheTop'
import Link from 'next/link'
import { getAllCareers } from '@/lib/data/careers'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'

export default function CareerRecommendations() {
  const [traitScores, setTraitScores] = useState(null)
  const [loadingReport, setLoadingReport] = useState(true)
  const [hasReport, setHasReport] = useState(false)
  const [error, setError] = useState(null)
  const [strongestTrait, setStrongestTrait] = useState(null)
  const [strongestScore, setStrongestScore] = useState(null)
  const reportRef = useRef(null)
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)

  // Fetch stored personality report
  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch('/api/survey/report', { credentials: 'include' })
        const data = await res.json()
        console.log('Fetched Report Data:', data)
        if (data.success && data.traitScores) {
          const formatted = Object.entries(data.traitScores).map(
            ([trait, score]) => ({ trait, score })
          )
          setTraitScores(formatted)
          // Determine strongest trait and its score
          const best = Object.entries(data.traitScores).reduce(
            (max, [trait, score]) => (score > max.score ? { trait, score } : max),
            { trait: "", score: -Infinity }
          )
          setStrongestTrait(best.trait)
          setStrongestScore(best.score)
          console.log('Strongest Trait:', best.trait, 'Score:', best.score)
          setHasReport(true)
        } else {
          setHasReport(false)
        }
      } catch (e) {
        console.error('Failed to load report', e)
        setError('Failed to load report. Please complete the survey first.')
      } finally {
        setLoadingReport(false)
      }
    }
    fetchReport()
  }, [])

  // Download report as PDF
  const handleDownload = async () => {
    if (!reportRef.current) return

    try {
      // 1) Generate a PNG data-URL of the node (automatically inlines computed styles)
      const dataUrl = await toPng(reportRef.current, {
        // ensure white bg
        filter: (node) => {
          // skip any images or external elements if you want
          return true
        }
      })

      // 2) Build the PDF
      const pdf = new jsPDF({ unit: 'px', format: 'a4' })
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('personality_report.pdf')

    } catch (e) {
      console.error('PDF download failed:', e)
      alert('PDF generate karne mein error aya. Try again.')
    }
  }

  const traitDescriptions = {
    Openness: `
      You love new ideas, creativity, and exploring different experiences.
      Simply put, your mind is always seeking new ideas, art, and adventurous experiments, and you find routine boring.
    `,

    Conscientiousness: `
      You're super organized, reliable, and always meet your goals.
      You are a meticulous planner and deadline conqueror. You complete every task neatly, properly, and on time—no compromises.
    `,

    Extraversion: `
      You gain energy around people and enjoy social settings.
      You are an energy powerhouse in social situations. Whether it's partying or networking, you bring out your lively alter ego.
    `,

    Agreeableness: `
      You're friendly, caring, and get along easily with others.
      You're naturally helpful and spread calm, friendly vibes. Avoiding conflicts feels like your full-time job.
    `,

    Neuroticism: `
      You're sensitive to stress and experience emotions intensely.
      You tend to overthink when stressed—small issues can trigger mood swings, over-analysis, and bouts of anxiety.
    `
  };

  // Get top career matches from our career data
  const topMatches = getAllCareers().map(career => ({
    imageSrc: career.imageSrc,
    tag: `${career.matchScore}% Match`,
    title: career.title,
    description: career.tagline,
    slug: career.id, // For internal routing
    linkText: 'View Career Path',
  }))

  return (
    <div className="flex min-h-screen dark:bg-background-dark bg-gray-50">
      <main className="flex-1 transition-all duration-300">
        <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-10">
          {/* Header */}
          <header className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground-light dark:text-foreground-dark">
              Your Career Recommendations
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground dark:text-extra-muted">
              Based on your quiz, here's your personality breakdown and top career matches.
            </p>
          </header>

          {/* AI Recommendations Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    AI-Powered Career Matches
                  </h2>
                  <p className="text-white/90 text-sm">
                    Get personalized career recommendations based on our advanced AI analysis
                  </p>
                </div>
              </div>
              <Link href="/results">
                <Button
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100"
                  variant="primary"
                  type="button"
                  size="lg"
                  btnText="View AI Results"
                />
              </Link>
            </div>
          </div>

          {/* Back to the top */}
          <BackToTopButton />

          {/* Personality Report */}
          {!loadingReport && hasReport && (
            <div ref={reportRef} className="bg-white dark:bg-surface p-4 sm:p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl sm:text-2xl text-foreground-light dark:text-foreground-dark font-semibold mb-4">
                Your Personality Report
              </h2>
              <p className="mb-4 text-base sm:text-lg text-muted dark:text-extra-muted">
                Your strongest personality trait is <strong>{strongestTrait}</strong>
                {strongestScore !== null && (
                  <> with a score of <strong>{strongestScore.toFixed(2)}</strong>/5</>
                )}!
              </p>

              {/* Radar Chart - Responsive */}
              <div className="w-full h-64 sm:h-80 lg:h-96 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={traitScores}>
                    <PolarGrid stroke="#ddd" />
                    <PolarAngleAxis
                      dataKey="trait"
                      stroke="#666"
                      tick={{ fill: '#75a1ff', fontSize: 12 }}
                      className="text-xs sm:text-sm"
                    />
                    <PolarRadiusAxis
                      domain={[0, 5]}
                      axisLine={false}
                      tick={{ fill: '#666', fontSize: 8 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#4F46E5"
                      fill="#4F46E5"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Legend
                      verticalAlign="top"
                      wrapperStyle={{ color: '#333', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd', fontSize: 12 }}
                      itemStyle={{ color: '#333' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Strongest-Trait Explanation */}
              <div className="mt-6 p-3 sm:p-4 bg-muted/20 dark:bg-surface rounded">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground-light dark:text-foreground-dark">
                  Your strongest personality trait is{' '}
                  <span className="text-darkblue dark:text-foreground-dark">{strongestTrait}</span>!
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted dark:text-extra-muted leading-relaxed">
                  {traitDescriptions[strongestTrait] || 'No description available for this trait.'}
                </p>
              </div>

              {/* Download Button */}
              <div className="mt-6 flex justify-center sm:justify-start">
                <Button
                  className="w-full sm:w-auto text-darkblue dark:text-primary"
                  variant="secondary"
                  onClick={handleDownload}
                  type='button'
                  size='lg'
                  btnText={"Download Report"}
                />
              </div>
            </div>
          )}

          {/* Error or Prompt */}
          {!loadingReport && error && (
            <p className="text-center text-red-500 text-sm sm:text-base px-4">{error}</p>
          )}
          {!loadingReport && !hasReport && !error && (
            <p className="text-center text-gray-600 text-sm sm:text-base px-4">
              Complete the survey to view your report.
            </p>
          )}

          {/* Top Matches */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
              Top Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {topMatches.map((match, i) => (
                <Link key={i} href={`/careers/${match.slug}`}>
                  <Card {...match} />
                </Link>
              ))}
            </div>
          </section>

          {/* Why These Recommendations */}
          <section className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b-2 text-foreground-light dark:text-foreground-dark border-primary dark:border-muted pb-2 text-center sm:text-left">
              Why These Recommendations?
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: '🧠', title: 'Problem-Solving', desc: 'Creative solutions and empathy.' },
                { icon: '🗣️', title: 'Communication', desc: 'Clear explanation of complex ideas.' },
                { icon: '🤝', title: 'Collaboration', desc: 'Thrive in team-driven innovation.' },
              ].map(({ icon, title, desc }) => (
                <li
                  key={title}
                  className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 bg-white dark:bg-surface rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0">
                    <span className="text-3xl sm:text-4xl">
                      {icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}