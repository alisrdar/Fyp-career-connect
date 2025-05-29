"use client"
import { useState, useEffect, useRef } from 'react'
import Card from "@/components/ui/Card"
import Button from '@/components/ui/Button'
import BackToTopButton from '@/components/ui/BacktoTheTop'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts'
import html2canvas from 'html2canvas'
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
    Openness:
      `You love new ideas, creativity, and exploring different experiences.
      Seedha bolun to, tera dimaag hamesha naye ideas, art, aur wild experiments ki talash mein rehta hai. Routine tujhe bore karta hai.`,

    Conscientiousness:
      `You’re super organized, reliable, and always meet your goals.
      Tu ekdum planner, deadline-destroyer hai. Har kaam neat, proper aur time pe finish karta hai—zero compromise.`,

    Extraversion:
      `You gain energy around people and enjoy social settings.
      Logon ke beech tu full on energy bomb hai. Party, networking—sab mein tu apna alter ego nikal leta hai.`,

    Agreeableness:
      `You’re friendly, caring, and get along easily with others.
      Tu help-karne wala guru hai, tension-free vibes share karta hai, aur conflicts se bachna uska full-time job hai.`,

    Neuroticism:
      `You’re sensitive to stress and experience emotions intensely.
      Low key tu stress se overthinker hai—choti si baat pe mood swings, over-analyzing aur anxiety ka season start ho jata hai.`
  };


  const topMatches = [
    {
      imageSrc:
        'https://www.shutterstock.com/image-photo/panorama-shot-frontend-developer-team-260nw-2294268357.jpg',
      tag: '98% Match',
      title: 'UX Designer',
      description:
        'Your creative problem-solving and empathy make you ideal for designing user experiences that solve real problems.',
      href: 'https://careerfoundry.com/en/blog/ux-design/am-i-a-good-fit-for-a-career-in-ux-design/',
      linkText: 'Learn More',
    },
    {
      imageSrc: '/images/data-science.jpg.webp',
      tag: '95% Match',
      title: 'Data Scientist',
      description:
        'Your analytical thinking and pattern recognition skills are perfect for extracting insights from complex data.',
      href: 'https://www.coursera.org/articles/what-is-a-data-scientist',
      linkText: 'Learn More',
    },
    {
      imageSrc:
        'https://media.istockphoto.com/id/1319031310/photo/doctor-writing-a-medical-prescription.jpg?s=612x612&w=0&k=20&c=DWZGM8lBb5Bun7cbxhKT1ruVxRC_itvFzA9jxgoA0N8=',
      tag: '86% Match',
      title: 'Doctor',
      description:
        'Your strong empathy and problem-solving skills make you well-suited for a career in medicine, helping patients every day.',
      href: 'https://www.aafp.org/students-residents/medical-students/considering-medical-school/is-career-in-medicine-for-you.html',
      linkText: 'Learn More',
    },
  ]

  return (
    <div className="flex min-h-screen dark:bg-background-dark bg-gray-50">
      <main className="flex-1 ml-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto p-6 space-y-10">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-bold mb-2 text-foreground-light dark:text-foreground-dark">Your Career Recommendations</h1>
            <p className="text-lg text-muted-foreground dark:text-extra-muted">Based on your quiz, here’s your personality breakdown and top career matches.</p>
          </header>

          {/* Back to the top */}
          <BackToTopButton />

          {/* Personality Report */}
          {!loadingReport && hasReport && (
            <div ref={reportRef} className="bg-white dark:bg-surface p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl text-foreground-light dark:text-foreground-dark font-semibold mb-4">Your Personality Report</h2>
              <p className="mb-4 text-lg text-muted dark:text-extra-muted">
                Your strongest personality trait is <strong>{strongestTrait}</strong>
                {strongestScore !== null && (
                  <> with a score of <strong>{strongestScore.toFixed(2)}</strong>/5</>
                )}!
              </p>

              {/* Radar Chart */}
              <RadarChart width={450} height={350} data={traitScores} className="mx-auto">
                <PolarGrid stroke="#ddd" />
                <PolarAngleAxis
                  dataKey="trait"
                  stroke="#666"
                  tick={{ fill: '#75a1ff', fontSize: 14 }}
                />
                <PolarRadiusAxis
                  domain={[0, 5]}
                  axisLine={false}
                  tick={{ fill: '#666', fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#4F46E5"       /* line color */
                  fill="#4F46E5"         /* area color */
                  fillOpacity={0.3}      /* transparency */
                  strokeWidth={2}
                />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ color: '#333', fontSize: 14 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }}
                  itemStyle={{ color: '#333' }}
                />
              </RadarChart>


              {/* Numeric Breakdown */}
              {/* <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {traitScores.map(({ trait, score }) => (
                  <div key={trait} className="p-3 bg-muted/20 dark:bg-surface rounded">
                    <p className="font-medium text-foreground-light dark:text-foreground-dark">{trait}</p>
                    <p className="text-xl font-semibold text-surface dark:text-extra-muted">{score.toFixed(2)}/5</p>
                  </div>
                ))}
              </div> */}

              {/* Strongest-Trait Explanation */}
              <div className="mt-6 p-4 bg-muted/20 dark:bg-surface rounded">
                <h3 className="text-xl font-semibold text-foreground-light dark:text-foreground-dark">
                  Your strongest personality trait is <span className="text-darkblue dark:text-foreground-dark">{strongestTrait}</span>!
                </h3>
                <p className="mt-2 text-base text-muted dark:text-extra-muted">
                  {traitDescriptions[strongestTrait] || 'No description available for this trait.'}
                </p>
              </div>

              {/* Download Button */}

              <Button
                className="mt-4 text-darkblue dark:text-primary"
                variant="secondary"
                onClick={handleDownload}
                type='button'
                size='lg'
                btnText={"Download Report"}
              />
            </div>
          )}

          {/* Error or Prompt */}
          {!loadingReport && error && <p className="text-center text-red-500">{error}</p>}
          {!loadingReport && !hasReport && !error && <p className="text-center text-gray-600">Complete the survey to view your report.</p>}

          {/* Top Matches */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Top Matches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMatches.map((match, i) => <Card key={i} {...match} />)}
            </div>
          </section>

          {/* Why These Recommendations */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 border-b-2 text-foreground-light dark:text-foreground-dark border-primary dark:border-muted pb-2">
              Why These Recommendations?
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '🧠', title: 'Problem-Solving', desc: 'Creative solutions and empathy.' },
                { icon: '🗣️', title: 'Communication', desc: 'Clear explanation of complex ideas.' },
                { icon: '🤝', title: 'Collaboration', desc: 'Thrive in team-driven innovation.' },
              ].map(({ icon, title, desc }) => (
                <li
                  key={title}
                  className="flex items-start space-x-4 p-5 bg-white dark:bg-surface rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-accent dark:text-accent rounded-full text-xl">
                      {icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{desc}</p>
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
