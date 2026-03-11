# About Me

A simple mobile-friendly web app that lets you fill in an "About Me" card and download it as a PDF to share with others.

**Live app:** https://abbasbukhari.github.io/about-me

---

## What it does

- Fill in 9 personal questions (age, hobbies, favourite food, and more)
- Download your completed card as a PDF with one tap
- Share the PDF on WhatsApp or anywhere else

## Pages

| Page | Description |
|------|-------------|
| About Me | 3×3 grid of editable cards — fill in your answers and download as PDF |
| How to Use | Step-by-step guide to filling in, downloading, and sharing |

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploying

```bash
npm run deploy
```

Builds and publishes to GitHub Pages at https://abbasbukhari.github.io/about-me

## Tech

- React + Vite
- html2pdf.js for PDF generation
