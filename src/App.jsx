import { useState } from 'react'
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
    title: 'Fill in the About Me form',
    body: 'Open the app on your phone or computer. Tap the "About Me" tab and fill in each box — age, hobbies, favourite food, and more. Your answers are saved while the page is open.',
  },
  {
    color: '#117A65',
    num: '2',
    title: 'Save as PDF',
    body: 'Once you\'ve filled in your answers, tap the "Download PDF" button. A print dialog will open — select "Save as PDF" (desktop) or "Print → Save to Files" (iPhone) or "Save as PDF" (Android) as the destination.',
  },
  {
    color: '#7D3C98',
    num: '3',
    title: 'Share on WhatsApp',
    body: 'Open WhatsApp > go to the chat > tap the attachment icon > Document > find the saved PDF > Send. Your About Me card is ready to share!',
  },
]

// Hidden in browser, shown only when printing — always 3-column regardless of screen size
function PrintLayout({ answers }) {
  return (
    <div className="print-layout">
      <div className="print-header">ABOUT ME</div>
      <div className="print-grid">
        {LABELS.map((label, i) => {
          const row = Math.floor(i / 3)
          const hasAnswer = answers[i] && answers[i].trim() !== ''
          return (
            <div className="print-card" key={i}>
              <div className="print-stripe" style={{ background: ROW_COLORS[row] }} />
              <div className="print-card-body">
                <div className="print-label">{label}</div>
                <div className="print-answer-box">
                  <span className={hasAnswer ? 'print-answer-text' : 'print-answer-placeholder'}>
                    {hasAnswer ? answers[i] : 'Type your answer here'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AboutMe({ answers, onChange }) {
  return (
    <div className="slide">
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
                    onChange={e => onChange(i, e.target.value)}
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
            Tip: Keep your browser tab open while filling in answers — they are stored in memory and will reset if you close the page.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('about')
  const [answers, setAnswers] = useState(Array(9).fill(''))

  const handleChange = (i, value) => {
    setAnswers(prev => {
      const next = [...prev]
      next[i] = value
      return next
    })
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
        <button className="btn-download" onClick={() => window.print()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PDF
        </button>
      </div>

      {page === 'about' ? (
        <AboutMe answers={answers} onChange={handleChange} />
      ) : (
        <HowToUse />
      )}

      {/* Always in DOM, invisible on screen, shown only when printing */}
      <PrintLayout answers={answers} />
    </div>
  )
}
