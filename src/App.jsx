import { useState } from 'react'
import html2canvas from 'html2canvas'
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
    title: 'Save as PDF or PNG',
    body: 'Once you\'ve filled in your answers, tap "Download PDF" (opens print dialog — select Save as PDF) or "Download PNG" for a direct image download.',
  },
  {
    color: '#7D3C98',
    num: '3',
    title: 'Share on WhatsApp',
    body: 'Open WhatsApp > go to the chat > tap the attachment icon > Document or Photo > find the saved file > Send. Your About Me card is ready to share!',
  },
]

// Builds the 3-column layout as a plain DOM element using only inline styles.
// Used for PNG export — no CSS classes means no media query interference.
function buildPrintElement(answers) {
  const W = 780
  const CARD_H = 148
  const cols = 3

  const wrap = document.createElement('div')
  wrap.style.cssText = `width:${W}px;background:#ffffff;font-family:Arial,sans-serif;`

  const header = document.createElement('div')
  header.style.cssText =
    'height:72px;background:#1A5276;display:flex;align-items:center;' +
    'justify-content:center;color:#ffffff;font-size:26px;font-weight:bold;letter-spacing:0.5px;'
  header.textContent = 'ABOUT ME'
  wrap.appendChild(header)

  const grid = document.createElement('div')
  grid.style.cssText =
    `display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px;padding:12px 14px 16px;`
  wrap.appendChild(grid)

  LABELS.forEach((label, i) => {
    const row = Math.floor(i / cols)

    const card = document.createElement('div')
    card.style.cssText =
      `background:#F4F6F7;border-radius:4px;overflow:hidden;display:flex;` +
      `flex-direction:column;min-height:${CARD_H}px;`

    const stripe = document.createElement('div')
    stripe.style.cssText = `height:6px;background:${ROW_COLORS[row]};flex-shrink:0;`
    card.appendChild(stripe)

    const body = document.createElement('div')
    body.style.cssText = 'padding:10px;flex:1;display:flex;flex-direction:column;gap:8px;'

    const labelEl = document.createElement('div')
    labelEl.style.cssText =
      'font-size:13px;font-weight:bold;color:#1A1A2E;min-height:36px;line-height:1.3;'
    labelEl.textContent = label
    body.appendChild(labelEl)

    const answerBox = document.createElement('div')
    answerBox.style.cssText =
      'background:#ffffff;border-radius:3px;flex:1;padding:6px 8px;min-height:58px;'

    const hasAnswer = answers[i] && answers[i].trim() !== ''
    const answerText = document.createElement('div')
    answerText.style.cssText =
      `font-size:11px;line-height:1.4;font-family:Arial,sans-serif;` +
      `color:${hasAnswer ? '#333333' : '#aaaaaa'};font-style:${hasAnswer ? 'normal' : 'italic'};`
    answerText.textContent = hasAnswer ? answers[i] : 'Type your answer here'
    answerBox.appendChild(answerText)
    body.appendChild(answerBox)

    card.appendChild(body)
    grid.appendChild(card)
  })

  return wrap
}

// Hidden on screen, shown only when printing via @media print
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
  const [pngLoading, setPngLoading] = useState(false)

  const handleChange = (i, value) => {
    setAnswers(prev => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  const handleDownloadPng = async () => {
    setPngLoading(true)

    const el = buildPrintElement(answers)

    // Overlay hides the element from the user; html2canvas captures the element itself
    const overlay = document.createElement('div')
    overlay.style.cssText =
      'position:fixed;inset:0;background:#ffffff;z-index:9999;pointer-events:none;'
    document.body.appendChild(overlay)

    // position:absolute so it participates in normal layout flow — more reliable for html2canvas
    el.style.cssText += 'position:absolute;top:0;left:0;z-index:9998;'
    document.body.appendChild(el)

    await new Promise(r => setTimeout(r, 100))

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const link = document.createElement('a')
    link.download = 'about-me.png'
    link.href = canvas.toDataURL('image/png')
    link.click()

    document.body.removeChild(el)
    document.body.removeChild(overlay)
    setPngLoading(false)
  }

  return (
    <>
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
          <div className="action-btns">
            <button className="btn-download btn-pdf" onClick={() => window.print()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
            <button className="btn-download btn-png" onClick={handleDownloadPng} disabled={pngLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {pngLoading ? 'Saving...' : 'Download PNG'}
            </button>
          </div>
        </div>

        {page === 'about' ? (
          <AboutMe answers={answers} onChange={handleChange} />
        ) : (
          <HowToUse />
        )}
      </div>

      {/* Outside .app so print CSS can show it independently */}
      <PrintLayout answers={answers} />
    </>
  )
}
