# CareerForge — AI-Powered Career Guidance Platform

CareerForge is a career development platform designed to help students analyze resumes, match their skills with job descriptions, prepare for interviews, track applications, and follow structured skill roadmaps.

## 🎥 Project Demo

[▶ Watch the CareerForge AI Demo](https://youtu.be/zcP4BcpY-I0)

*The video demonstrates the application running locally, including its AI-powered features.*

## ✨ Features

- **Resume Analyzer:** Upload a PDF or DOCX resume for analysis.
- **Job Matching:** Compare your skills with a job description, identify skill gaps, and receive recommendations.
- **Interview Preparation:** Explore interview questions by category and receive feedback on submitted answers.
- **Skill Roadmap:** Track learning progress and completed skills.
- **Application Tracker:** Add applications, update statuses, and manage your job search.
- **User Authentication:** Register, verify your account, and sign in to your personal dashboard.

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Python
- FastAPI
- REST APIs
- SQLite

**AI Integration**
- AI service integration for career-related analysis and feedback
- Environment-based API configuration

## 📸 Screenshots


<img width="1469" height="831" alt="Screenshot 2026-10-19 at 8 02 07 PM" src="https://github.com/user-attachments/assets/20de2fec-5219-4e67-b90a-93ca0af7df68" /><img width="1470" height="836" alt="Screenshot 2026-10-19 at 8 02 20 PM" src="https://github.com/user-attachments/assets/41bd4a34-dced-458e-acc8-f7cf124eea81" /><img width="1470" height="837" alt="Screenshot 2026-10-19 at 8 02 30 PM" src="https://github.com/user-attachments/assets/e165b65f-9a51-464e-92a3-93c0e0ee8d61" /><img width="1470" height="831" alt="Screenshot 2026-10-19 at 8 02 58 PM" src="https://github.com/user-attachments/assets/c1fe9aff-4706-491a-978c-834a5bf687d8" /><img width="1470" height="834" alt="Screenshot 2026-10-19 at 8 03 08 PM" src="https://github.com/user-attachments/assets/66a53548-4687-419d-899d-9fa22f0ce885" /><img width="1470" height="838" alt="Screenshot 2026-10-19 at 8 03 22 PM" src="https://github.com/user-attachments/assets/66911818-6d89-4a3c-863b-5989f3059561" /><img width="1470" height="832" alt="Screenshot 2026-10-19 at 8 03 38 PM" src="https://github.com/user-attachments/assets/ad6613e0-382a-4a5f-a749-61bf8517adbb" /><img width="1221" height="840" alt="Screenshot 2026-10-19 at 8 03 51 PM" src="https://github.com/user-attachments/assets/f80e0040-d442-4878-9950-e8002b84ba11" />









## 🚀 Run Locally

### Prerequisites

- Node.js and npm
- Python
- `uv` package manager
- An AI service API key if you want to use AI-powered features

### 1. Clone the repository

```bash
git clone https://github.com/Akshitarao27/CareerForge.git
cd CareerForge
```

### 2. Start the backend

Configure the required environment variables in a local `.env` file using the variable names expected by the backend. Never commit API keys, email credentials, or JWT secrets.

Install the project's Python dependencies using the repository's dependency configuration, then run:

```bash
uv run uvicorn backend.main:app --reload --port 8000
```

Backend API documentation: http://127.0.0.1:8000/docs

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## 🔐 Security

- Keep API keys, email passwords, and JWT secrets in environment variables.
- Never commit `.env` files or credentials to GitHub.
- Use your own API credentials when running the project locally.
- Do not expose private API keys in frontend code.

## 📌 Project Status

CareerForge is being developed and tested locally. A publicly hosted interactive demo is not currently provided.

## 👩‍💻 Developer

**Akshita Rao**

GitHub: [Akshitar ao27](https://github.com/Akshitarao27)

---

*Built to make career preparation more organized, accessible, and practical for students.*
