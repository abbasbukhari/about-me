import { useState } from 'react'
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
    title: 'Fill in the About Me form',
    body: 'Open the app on your phone or computer. Tap the "About Me" tab and fill in each box — age, hobbies, favourite food, and more. Your answers are saved while the page is open.',
  },
  {
    color: '#117A65',
    num: '2',
    title: 'Download as PDF',
    body: "Once you've filled in your answers, tap the green \"Download PDF\" button at the top. A PDF of your completed About Me card will be saved to your device automatically.",
  },
  {
    color: '#7D3C98',
    num: '3',
    title: 'Share on WhatsApp',
    body: 'Open WhatsApp > go to the chat > tap the attachment icon > Document > find the downloaded PDF > Send. Your About Me card is ready to share!',
  },
]

// Builds the 3-column desktop layout as a DOM element using only inline styles.
// This bypasses all CSS classes and media queries so it always renders correctly.
function buildPrintElement(answers) {
  const W = 780
  const CARD_H = 148
  const cols = 3

  const wrap = document.createElement('div')
  wrap.style.cssText = `width:${W}px;background:#ffffff;font-family:Arial,sans-serif;`

  // Header
  const header = document.createElement('div')
  header.style.cssText =
    'height:72px;background:#1A5276;display:flex;align-items:center;justify-content:center;' +
    'color:#ffffff;font-size:26px;font-weight:bold;letter-spacing:0.5px;'
  header.textContent = 'ABOUT ME'
  wrap.appendChild(header)

  // Grid
  const grid = document.createElement('div')
  grid.style.cssText =
    `display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px;padding:12px 14px 16px;`
  wrap.appendChild(grid)

  LABELS.forEach((label, i) => {
    const row = Math.floor(i / cols)

    const card = document.createElement('div')
    card.style.cssText =
      `background:#F4F6F7;border-radius:4px;overflow:hidden;display:flex;flex-direction:column;min-height:${CARD_H}px;`

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

    const answerText = document.createElement('div')
    const hasAnswer = answers[i] && answers[i].trim() !== ''
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
  const [downloading, setDownloading] = useState(false)

  const handleChange = (i, value) => {
    setAnswers(prev => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  const handleDownload = async () => {
    setDownloading(true)

    // White overlay hides the print element from the user while it renders.
    // html2canvas only traverses the target element's subtree, so the overlay
    // sitting on top does NOT affect the capture — only the z-index does.
    const overlay = document.createElement('div')
    overlay.style.cssText =
      'position:fixed;inset:0;background:#ffffff;z-index:9999;pointer-events:none;'
    document.body.appendChild(overlay)

    // Print element must have a positive z-index so html2canvas can see it.
    const el = buildPrintElement(answers)
    el.style.cssText += 'position:fixed;top:0;left:0;z-index:9998;pointer-events:none;'
    document.body.appendChild(el)

    // Let the browser fully render both elements before capturing
    await new Promise(r => setTimeout(r, 100))

    const opt = {
      margin: 0,
      filename: 'about-me.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: {
        unit: 'px',
        format: [el.offsetWidth, el.offsetHeight],
        orientation: 'landscape',
      },
    }

    await html2pdf().set(opt).from(el).save()

    document.body.removeChild(el)
    document.body.removeChild(overlay)
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

      {page === 'about' ? (
        <AboutMe answers={answers} onChange={handleChange} />
      ) : (
        <HowToUse />
      )}
    </div>
  )
}
