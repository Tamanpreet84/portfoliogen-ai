# PortfolioGen AI – Resume to Portfolio Website Generator

![PortfolioGen AI](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20TailwindCSS%20%7C%20Generative%20AI-sky)
![License](https://img.shields.io/badge/License-MIT-emerald)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)

**PortfolioGen AI** is a full-stack SaaS application that automatically parses uploaded developer resumes (PDF & DOCX) and transforms them into deployable, responsive personal portfolio websites. 

Powered by **Generative AI**, it improves wording, refines bio summaries, and structures content while **strictly preserving factual accuracy without inventing unmentioned skills or work history**.

---

## 🚀 Features

- 📁 **Smart Resume Upload & Validation**: Drag-and-drop support for PDF and Word (.docx) files. Validates file extension, size (<10MB), and corruption checks.
- 🔍 **Information Extraction Engine**: Parses contact details, social links (GitHub, LinkedIn), technical & soft skills, work experience, projects, education, certifications, and achievements.
- ✏️ **Interactive Information Editor**: Review, edit, add, or remove extracted sections before portfolio generation.
- 🤖 **Generative AI Wording Refiner**: One-click AI content enhancement for headlines, bio summaries, experience bullets, and project descriptions.
- 🎨 **3 Selectable Professional Templates**:
  1. **Minimal Professional**: Clean slate theme with crisp typography.
  2. **Developer Portfolio**: Dark tech theme featuring terminal headers, code syntax tags, and repo badges.
  3. **Modern Creative**: Dynamic grid layout with glassmorphism cards and vibrant glowing accents.
- ⚡ **Real-Time Live Customizer**:
  - Desktop vs Mobile viewport switcher.
  - Dark / Light mode toggle.
  - Section reordering (Up/Down) & visibility toggling.
- 📦 **One-Click Static Site Export**: Download standalone ZIP packages containing clean `index.html`, responsive styles, and interactive scripts ready for zero-config hosting.
- 🚀 **Deployment Guides**: Built-in instructions for Vercel, Netlify, and GitHub Pages.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS v4** + `@tailwindcss/vite`
- **Lucide Icons**
- **JSZip** & **FileSaver** (Client-side static package bundler)

### Backend
- **Python 3.10+** & **FastAPI**
- **pdfplumber** & **pypdf** (PDF Text Extractor)
- **python-docx** (Word Document Parser)
- **Google Gemini API** (`google-genai`) with zero-config NLP regex fallback engine.

---

## 📂 Project Structure

```
portfoliogen-ai/
├── frontend/                     # React + Vite + Tailwind CSS App
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Navbar & Progress Breadcrumbs
│   │   │   ├── landing/          # Hero & SaaS Features Landing Page
│   │   │   ├── upload/           # Drag & Drop File Upload
│   │   │   ├── editor/           # Extracted Info Form Editor
│   │   │   ├── templates/        # 1. Minimal, 2. Developer, 3. Creative Templates
│   │   │   ├── builder/          # Live Customizer & Viewport Preview
│   │   │   └── export/           # Static Package Exporter & Deployment Hub
│   │   ├── context/              # Portfolio State Management
│   │   └── utils/                # HTML Generator & JSZip Exporter
│   ├── vite.config.js
│   └── package.json
├── backend/                      # FastAPI Python Application
│   ├── app/
│   │   ├── main.py               # API Routes & Server Engine
│   │   ├── services/             # Document Parser & Generative AI Service
│   │   ├── schemas/              # Pydantic Resume Schema Definitions
│   │   └── utils/                # File Validation & Sanitizer
│   ├── requirements.txt
│   └── .env.example
├── vercel.json                   # Vercel Serverless & Static Deployment Spec
└── README.md                     # Documentation
```

---

## ⚡ Quick Local Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Run Backend (FastAPI)
```bash
cd backend
py -3 -m venv venv
# Activate virtual environment:
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

pip install -r requirements.txt

# (Optional) Set API Key
set GEMINI_API_KEY=your_key_here

uvicorn app.main:app --reload --port 8000
```
Backend server will run at `http://localhost:8000`.

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend app will open at `http://localhost:3000`.

---

## 🌐 Deploy to Vercel

1. Push this repository to your GitHub account: `https://github.com/Tamanpreet84/portfoliogen-ai`.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import `portfoliogen-ai`.
3. Add `GEMINI_API_KEY` under **Environment Variables** (Optional).
4. Click **Deploy**! Vercel automatically detects `vercel.json` and builds both frontend and FastAPI serverless routes.

---

## 🛡️ Security & Privacy

- All document text is sanitized before processing to prevent code injection.
- Resume documents are processed in memory and never written to permanent disk.
- LLM prompts enforce strict rules prohibiting data hallucination or invention of fake employment.

---

## 📄 License
MIT License © 2026 Tamanpreet Singh
