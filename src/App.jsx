import { useState, useRef } from 'react'
import html2pdf from 'html2pdf.js'
import './App.css'

const LABELS = [
  'I am ___ years old',
  'When I grow up, I want to be a',
  'My birthday',
  'My hobbies are',
  'My favorite food',
  'My best friends are',
  'My favorite color',
  'My favorite book',
  'My favorite song',
]

const ROW_COLORS = ['#1A5276', '#117A65', '#7D3C98']

const STEPS = [
  {
    color: '#1A5276',
    num: '1',
    title: 'Fill in the About Me slide',
    body: 'Open this file in the Google Slides app (free on iOS & Android). Tap each "Type your answer here" box and type your answer. Tap outside the box when done.',
  },
  {
    color: '#117A65',
    num: '2',
    title: 'Save as PDF',
    body: 'iPhone/iPad: Tap the 3-dot menu > Share & export > Save as > PDF > tick to save.\nAndroid: Tap the 3-dot menu > Share & export > Save as > PDF. Saved to Files/Downloads.',
  },
  {
    color: '#7D3C98',
    num: '3',
    title: 'Share on WhatsApp',
    body: 'Open WhatsApp > go to the chat > tap attachment icon > Document > select the PDF > Send.',
  },
]

function AboutMe({ slideRef }) {
  const [answers, setAnswers] = useState(Array(9).fill(''))

  const handleChange = (i, value) => {
    setAnswers(prev => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  return (
    <div className="slide" ref={slideRef}>
      <div className="slide-header" style={{ background: '#1A5276' }}>
        ABOUT ME
      </div>
      <div className="cards-grid">
        {LABELS.map((label, i) => {
          const row = Math.floor(i / 3)
          return (
            <div className="card" key={i}>
              <div className="card-stripe" style={{ background: ROW_COLORS[row] }} />
              <div className="card-body">
                <div className="card-label">{label}</div>
                <div className="card-answer-box">
                  <textarea
                    placeholder="Type your answer here"
                    value={answers[i]}
                    onChange={e => handleChange(i, e.target.value)}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HowToUse() {
  return (
    <div className="slide">
      <div className="slide-header" style={{ background: '#117A65' }}>
        How to Use This Template
      </div>
      <div className="steps">
        {STEPS.map((step) => (
          <div className="step-card" key={step.num}>
            <div className="step-accent" style={{ background: step.color }} />
            <div className="step-content">
              <div className="step-num" style={{ background: step.color }}>
                {step.num}
              </div>
              <div className="step-text">
                <div className="step-title">{step.title}</div>
                <div className="step-body">{step.body}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="tip-bar">
          <div className="tip-accent" />
          <div className="tip-text">
            Tip: Keep the original Slides file as a backup before filling in your answers.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('about')
  const [downloading, setDownloading] = useState(false)
  const slideRef = useRef(null)

  const handleDownload = async () => {
    if (!slideRef.current) return
    setDownloading(true)
    const opt = {
      margin: 0,
      filename: 'about-me.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'px', format: [slideRef.current.offsetWidth, slideRef.current.offsetHeight], orientation: 'landscape' },
    }
    await html2pdf().set(opt).from(slideRef.current).save()
    setDownloading(false)
  }

  return (
    <div className="app">
      <div className="top-bar">
        <nav className="nav">
          <button
            className={page === 'about' ? 'active' : ''}
            onClick={() => setPage('about')}
          >
            About Me
          </button>
          <button
            className={page === 'how' ? 'active' : ''}
            onClick={() => setPage('how')}
          >
            How to Use
          </button>
        </nav>
        <button className="btn-download" onClick={handleDownload} disabled={downloading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {downloading ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>
      {page === 'about' ? <AboutMe slideRef={slideRef} /> : <HowToUse />}
    </div>
  )
}
