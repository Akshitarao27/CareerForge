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

<img width="1221" height="840" alt="Screenshot 2026-10-19 at 8 03 51 PM" src="https://github.com/user-attachments/assets/4f87db0f-a424-44f8-9a19-9e84acb88c97" />
<img width="1470" height="832" alt="Screenshot 2026-10-19 at 8 03 38 PM" src="https://github.com/user-attachments/assets/f66d94ba-32e1-4504-a6dc-0c526fed97a0" />
<img width="1470" height="838" alt="Screenshot 2026-10-19 at 8 03 22 PM" src="https://github.com/user-attachments/assets/8bc70d84-ce61-4f2c-9582-dc1bf81fbe12" />
<img width="1470" height="834" alt="Screenshot 2026-10-19 at 8 03 08 PM" src="https://github.com/user-attachments/assets/78a8b8e0-5e2e-4227-9a7c-d90827f0b84f" />
<img width="1470" height="831" alt="Screenshot 2026-10-19 at 8 02 58 PM" src="https://github.com/user-attachments/assets/e9e48abb-514f-455c-b0e3-b86bd252f68e" />
<img width="1470" height="837" alt="Screenshot 2026-10-19 at 8 02 30 PM" src="https://github.com/user-attachments/assets/c77605df-ff68-4a8b-aa50-5ab570db0ce0" />
<img width="1470" height="836" alt="Screenshot 2026-10-19 at 8 02 20 PM" src="https://github.com/user-attachments/assets/3611dbba-6e80-4b86-bc39-1a3d090ecec4" />
<img width="1469" height="831" alt="Screenshot 2026-10-19 at 8 02 07 PM" src="https://github.com/user-attachments/assets/e21c0ea2-b71c-4923-9591-2086b64dd57b" />

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
