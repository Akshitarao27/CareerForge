import { useEffect, useState } from "react";
import { api } from "./api";
import Auth from "./Auth";
import {
  LayoutDashboard, FileText, Target, GraduationCap,
  MessageSquare, BriefcaseBusiness, Settings, Bell,
  Search, ArrowUpRight, Sparkles, ChevronDown,
  CircleCheck, Clock, Plus, Menu, X,Trash2,
} from "lucide-react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Resume Analyzer", icon: FileText },
  { label: "Job Matching", icon: Target },
  { label: "Skill Roadmap", icon: GraduationCap },
  { label: "Interview Prep", icon: MessageSquare },
  { label: "Applications", icon: BriefcaseBusiness },
];

const applications = [
  { company: "Google", role: "Software Engineer Intern", status: "Applied", color: "#4285f4" },
  { company: "Microsoft", role: "Software Engineering Intern", status: "Interview", color: "#00a4ef" },
  { company: "Amazon", role: "SDE Intern", status: "In Review", color: "#ff9900" },
];

const interviewQuestions = {
  DSA: [
    {
      question: "What is the difference between an array and a linked list?",
      hint: "Think about memory layout, indexing, and insertion."
    },
    {
      question: "How does binary search work, and what is its time complexity?",
      hint: "Explain the sorted-input requirement and divide-and-conquer approach."
    },
    {
      question: "What is the difference between a stack and a queue?",
      hint: "Compare LIFO and FIFO with examples."
    }
  ],
  Technical: [
    {
      question: "Explain the difference between JavaScript's let, const, and var.",
      hint: "Discuss scope, reassignment, and hoisting."
    },
    {
      question: "What is a REST API, and how does a frontend communicate with a backend?",
      hint: "Mention HTTP methods, requests, responses, and JSON."
    },
    {
      question: "What is the difference between SQL and MongoDB?",
      hint: "Compare relational tables with document-based storage."
    }
  ],
  HR: [
    {
      question: "Tell me about yourself and the projects you have built.",
      hint: "Keep your introduction relevant to the role and explain your contribution."
    },
    {
      question: "Describe a challenge you faced while working on a project.",
      hint: "Explain the situation, your action, and the result."
    },
    {
      question: "Why should we hire you as a fresher?",
      hint: "Connect your skills, learning ability, and projects to the role."
    }
  ]

};

function App() {
const [active, setActive] = useState("Overview");
const [profileOpen, setProfileOpen] = useState(false);
const [applicationList, setApplicationList] = useState([]);
const [currentUser, setCurrentUser] = useState(() => {
  const savedUser = localStorage.getItem("careerforge_user");

  try {
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
});
function handleLogout() {
  localStorage.removeItem("careerforge_token");
  localStorage.removeItem("careerforge_user");
  setCurrentUser(null);
}
const [applicationsLoading, setApplicationsLoading] = useState(true);
const [applicationsError, setApplicationsError] = useState("");
const [savingApplication, setSavingApplication] = useState(false);
const [questionsFromApi, setQuestionsFromApi] = useState([]);
const [questionsLoading, setQuestionsLoading] = useState(false);
const [companyInput, setCompanyInput] = useState("");
const [roleInput, setRoleInput] = useState("");
const [statusInput, setStatusInput] = useState("Applied");
const [applicationSearch, setApplicationSearch] = useState("");
const [menuOpen, setMenuOpen] = useState(false);
const [search, setSearch] = useState("");
const [resumeFile, setResumeFile] = useState(null);
const [resumeStatus, setResumeStatus] = useState("");
const [resumeAnalysis, setResumeAnalysis] = useState(null);
const [resumeLoading, setResumeLoading] = useState(false);
const [jobDescription, setJobDescription] = useState("");
const [targetRole, setTargetRole] = useState("");
const [jobMatchStatus, setJobMatchStatus] = useState("");
const [jobMatchResult, setJobMatchResult] = useState(null);
const [jobMatchLoading, setJobMatchLoading] = useState(false);
const [jobMatch, setJobMatch] = useState(null);
const [skillSearch, setSkillSearch] = useState("");
const [customSkills, setCustomSkills] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("careerforge-custom-skills")) || [];
  } catch {
    return [];
  }
});
useEffect(() => {
  localStorage.setItem(
    "careerforge-custom-skills",
    JSON.stringify(customSkills)
  );
}, [customSkills]);
const [newSkill, setNewSkill] = useState("");
useEffect(() => {
  const token = localStorage.getItem("careerforge_token");

  if (!token) return;

  api.getMyProfile()
    .then((data) => {
      setCurrentUser(data.user);
      localStorage.setItem("careerforge_user", JSON.stringify(data.user));
    })
    .catch(() => {
      localStorage.removeItem("careerforge_token");
      localStorage.removeItem("careerforge_user");
      setCurrentUser(null);
    });
}, []);
const [newSkillDetail, setNewSkillDetail] = useState("");
const [newSkillTime, setNewSkillTime] = useState("2 weeks");
const [newSkillCategory, setNewSkillCategory] = useState("Programming");

const roadmapSkills = [
  { id: 1, title: "Data Structures & Algorithms", detail: "Arrays, trees, graphs and problem-solving", time: "4 weeks", category: "DSA" },
  { id: 2, title: "C++", detail: "OOP, STL and competitive programming", time: "3 weeks", category: "Programming" },
  { id: 3, title: "Python", detail: "Core Python, functions and data structures", time: "2 weeks", category: "Programming" },
  { id: 4, title: "Java", detail: "OOP, collections and exception handling", time: "3 weeks", category: "Programming" },
  { id: 5, title: "JavaScript", detail: "ES6+, async programming and DOM", time: "3 weeks", category: "Web Development" },
  { id: 6, title: "React", detail: "Components, hooks and state management", time: "3 weeks", category: "Web Development" },
  { id: 7, title: "Node.js & Express", detail: "Backend development and REST APIs", time: "3 weeks", category: "Web Development" },
  { id: 8, title: "SQL", detail: "Joins, queries and database design", time: "2 weeks", category: "Databases" },
  { id: 9, title: "MongoDB", detail: "Documents, collections and aggregation", time: "2 weeks", category: "Databases" },
  { id: 10, title: "FastAPI", detail: "Python APIs, validation and endpoints", time: "2 weeks", category: "Backend" },
  { id: 11, title: "Machine Learning", detail: "Training, evaluation and model selection", time: "4 weeks", category: "AI & ML" },
  { id: 12, title: "Deep Learning", detail: "Neural networks and backpropagation", time: "4 weeks", category: "AI & ML" },
  { id: 13, title: "Natural Language Processing", detail: "Text processing and transformer models", time: "3 weeks", category: "AI & ML" },
  { id: 14, title: "RAG & Vector Databases", detail: "Embeddings, retrieval and ChromaDB", time: "3 weeks", category: "AI Engineering" },
  { id: 15, title: "Git & GitHub", detail: "Version control and collaboration", time: "1 week", category: "Tools" },
  { id: 16, title: "Docker", detail: "Containers and deployment basics", time: "2 weeks", category: "Tools" },
];

const [completedSkills, setCompletedSkills] = useState([]);

const skillProgressKey = currentUser
  ? `careerforge-completed-skills-${currentUser.id}`
  : null;

const [skillProgressLoaded, setSkillProgressLoaded] = useState(false);

useEffect(() => {
  setSkillProgressLoaded(false);

  if (!skillProgressKey) {
    setCompletedSkills([]);
    return;
  }

  try {
    const savedProgress = localStorage.getItem(skillProgressKey);
    setCompletedSkills(savedProgress ? JSON.parse(savedProgress) : []);
  } catch {
    setCompletedSkills([]);
  } finally {
    setSkillProgressLoaded(true);
  }
}, [skillProgressKey]);

useEffect(() => {
  if (!skillProgressKey || !skillProgressLoaded) return;

  localStorage.setItem(
    skillProgressKey,
    JSON.stringify(completedSkills)
  );
}, [completedSkills, skillProgressKey, skillProgressLoaded]);




const [interviewType, setInterviewType] = useState("Technical");
const [interviewQuestionIndex, setInterviewQuestionIndex] = useState(0);
const [interviewAnswer, setInterviewAnswer] = useState("");
const [interviewFeedback, setInterviewFeedback] = useState("");

useEffect(() => {
  let cancelled = false;

  async function loadApplications() {
    try {
      setApplicationsError("");

      const data = await api.getApplications();

      if (!cancelled) {
        setApplicationList(
          Array.isArray(data) ? data : data.applications ?? []
        );
      }
    } catch (error) {
      if (!cancelled) {
        setApplicationsError(error.message);

      }
    } finally {
      if (!cancelled) {
        setApplicationsLoading(false);
      }
    }
  }

  loadApplications();

  return () => {
    cancelled = true;
  };
}, []);
useEffect(() => {
  let cancelled = false;

  async function loadQuestions() {
    try {
      setQuestionsLoading(true);

      const selectedSkills = roadmapSkills
  .filter((skill) => completedSkills.includes(skill.id))
  .map((skill) => skill.title);

const result = await api.getInterviewQuestions(
  interviewType,
  selectedSkills
);

      if (!cancelled) {
        setQuestionsFromApi(result.questions ?? []);
        setInterviewQuestionIndex(0);
      }
    } catch (error) {
      if (!cancelled) {
        setInterviewFeedback(error.message || "Could not load questions.");
        setQuestionsFromApi([]);
      }
    } finally {
      if (!cancelled) {
        setQuestionsLoading(false);
      }
    }
  }

  loadQuestions();

  return () => {
    cancelled = true;
  };
}, [interviewType]);
const totalApplications = applicationList.length;

const totalInterviews = applicationList.filter(
  (app) => app.status === "Interview"
).length;

const totalOffers = applicationList.filter(
  (app) => app.status === "Offer"
).length;

const totalRoadmapSkills = roadmapSkills.length;

const completedSkillCount = roadmapSkills.filter(
  (skill) => completedSkills.includes(skill.id)
).length;

const roadmapPercentage = totalRoadmapSkills > 0
  ? Math.round((completedSkillCount / totalRoadmapSkills) * 100)
  : 0;
  const filteredApps = applicationList.filter((app) =>
    `${app.company} ${app.role} ${app.status}`
      .toLowerCase().includes(search.toLowerCase())
  );
if (!currentUser) {
  return <Auth onLoginSuccess={setCurrentUser} />;
}
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={23} /></div>
          <span>Career<span className="brand-accent">Forge</span></span>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)}><X /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "nav-active" : ""}`}
              onClick={() => { setActive(label); setMenuOpen(false); }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Applications" && <span className="nav-count">3</span>}
            </button>
          ))}
        </nav>
<button
  className="nav-item"
  onClick={handleLogout}
>
  Log out
</button>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={19} /></div>
            <strong>Your next opportunity awaits.</strong>
            <p>Build skills, track progress, and prepare for your dream role.</p>
            <button onClick={() => setActive("Skill Roadmap")}>Explore roadmap <ArrowUpRight size={15} /></button>
          </div>

<button
  className="profile"
  onClick={() => setProfileOpen((open) => !open)}
  aria-expanded={profileOpen}
  aria-label="Open profile menu"
>
  <div className="avatar">
    {(currentUser?.name || "U").charAt(0).toUpperCase()}
  </div>

  <div className="profile-info">
    <strong>{currentUser?.name || "User"}</strong>
    <span>Student account</span>
  </div>

  <ChevronDown size={16} />
</button>

{profileOpen && (
  <div className="profile-menu">
    <div>{currentUser?.email || ""}</div>
    <button
      onClick={() => {
        setProfileOpen(false);
        handleLogout();
      }}
    >
      Log out
    </button>
  </div>
)}

        </div>
      </aside>

      {menuOpen && <button className="overlay" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setMenuOpen(true)}><Menu /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>

        </header>

        <div className="page-content">

          {active !== "Overview" && (

            <section className="tool-page">

              <div className="eyebrow">
                <span className="status-dot" /> CAREER WORKSPACE
              </div>

              <h1>{active}</h1>

              <p className="page-subtitle">
                Your next step toward your career goals.
              </p>


{active === "Resume Analyzer" && (
  <div className="panel tool-card">
    <h3>Analyze your resume</h3>
    <p>Upload your resume to prepare for your next opportunity.</p>

    <label htmlFor="resume-upload">Resume file (PDF or DOCX)</label>
    <input
      id="resume-upload"
      type="file"
      accept=".pdf,.doc,.docx"
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedExtensions = /\.(pdf|docx?)$/i;

        if (!allowedExtensions.test(file.name)) {
          setResumeFile(null);
          setResumeStatus("Please select a PDF or Word document.");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          setResumeFile(null);
          setResumeStatus("Please select a file smaller than 5 MB.");
          return;
        }

        setResumeFile(file);
        setResumeStatus("Resume selected successfully.");
      }}
    />

    {resumeFile && (
      <div className="selected-file">
        <FileText size={20} />
        <div>
          <strong>{resumeFile.name}</strong>
          <p>{(resumeFile.size / 1024).toFixed(1)} KB</p>
        </div>
      </div>
    )}

    {resumeStatus && (
      <p role="status" className="helper-text">{resumeStatus}</p>
    )}

    <button
  className="primary-button"
  disabled={!resumeFile || resumeLoading}
  onClick={async () => {
    if (!resumeFile) return;

    try {
      setResumeLoading(true);
      setResumeAnalysis(null);
      setResumeStatus("Analyzing your resume...");

      const result = await api.analyzeResume(resumeFile);

      setResumeAnalysis(result);
      setResumeStatus("Resume analyzed successfully!");
    } catch (error) {
      setResumeStatus(error.message || "Resume analysis failed.");
    } finally {
      setResumeLoading(false);
    }
  }}
>
  {resumeLoading ? "Analyzing..." : "Analyze Resume"}
</button>
   {resumeAnalysis && (
  <div className="analysis-results">
    <h3>Resume Analysis Results</h3>

    <div className="analysis-summary-grid">
      <div className="analysis-summary-card">
        <span>Words detected</span>
        <h2>{resumeAnalysis.word_count ?? 0}</h2>
      </div>

      <div className="analysis-summary-card">
        <span>Skills identified</span>
        <h2>{resumeAnalysis.detected_skills?.length ?? 0}</h2>
      </div>

      <div className="analysis-summary-card">
        <span>Sections identified</span>
        <h2>{resumeAnalysis.detected_sections?.length ?? 0}</h2>
      </div>
    </div>

<div className="resume-visualizations">
  <div className="analysis-result-section">
    <h4>Resume Overview</h4>

    {[
      {
        label: "Words detected",
        value: resumeAnalysis.word_count ?? 0,
        color: "resume-chart-purple",
      },
      {
        label: "Skills identified",
        value: resumeAnalysis.detected_skills?.length ?? 0,
        color: "resume-chart-green",
      },
      {
        label: "Sections identified",
        value: resumeAnalysis.detected_sections?.length ?? 0,
        color: "resume-chart-blue",
      },
    ].map((item) => {

const maxValue =
  item.label === "Words detected"
    ? 600
    : item.label === "Skills identified"
      ? 25
      : 7;

const percentage = Math.min(
  100,
  Math.round((item.value / maxValue) * 100)
);




      return (
        <div className="resume-chart-row" key={item.label}>
          <div className="resume-chart-label">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="resume-chart-track">
            <div
              className={`resume-chart-fill ${item.color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>

  <div className="analysis-result-section">
    <h4>Resume Section Coverage</h4>
    {[
      "Contact Information",
      "Summary / Objective",
      "Education",
      "Skills",
      "Projects",
      "Experience",
      "Certifications",
    ].map((section) => {
      const detected = (resumeAnalysis.detected_sections ?? []).some(
        (item) => item.toLowerCase().includes(section.toLowerCase()) ||
          section.toLowerCase().includes(item.toLowerCase())
      );

      return (
        <div className="resume-section-row" key={section}>
          <span>{section}</span>
          <span className={detected ? "section-found" : "section-missing"}>
            {detected ? "Detected" : "Not detected"}
          </span>
        </div>
      );
    })}
    <p className="helper-text">
      Section coverage is based on detected headings. A section marked
      "Not detected" may still be present under a different heading.
    </p>
  </div>
</div>

    <div className="analysis-result-section">
      <h4>Technical Skills</h4>
      <div className="skill-tags">
        {(resumeAnalysis.detected_skills ?? []).map((skill) => (
          <span className="skill-tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="analysis-result-section">
      <h4>Detected Sections</h4>
      <div className="skill-tags">
        {(resumeAnalysis.detected_sections ?? []).map((section) => (
          <span className="skill-tag" key={section}>
            {section}
          </span>
        ))}
      </div>
    </div>

    <div className="analysis-result-section">
      <h4>Suggestions for Improvement</h4>
      <ul>
        {(resumeAnalysis.suggestions ?? []).map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>

{resumeAnalysis?.ai_feedback && (
  <div className="ai-feedback-card">
    <h3>
      <Sparkles size={18} />
      AI-Powered Resume Feedback
    </h3>
    <p style={{ whiteSpace: "pre-wrap" }}>
      {resumeAnalysis.ai_feedback}
    </p>
  </div>
)}

    {resumeAnalysis.message && (
      <p className="helper-text">{resumeAnalysis.message}</p>
    )}
  </div>
)}

    <p className="helper-text">
      Your file is only selected in the browser at this stage. AI analysis
      is not connected yet.
    </p>
  </div>
)}



{active === "Job Matching" && (
  <div className="panel tool-card">
    <h3>Find your best-fit roles</h3>
    <p>Compare a job description with your skills and experience.</p>

    <label htmlFor="target-role">Target role</label>
    <select
      id="target-role"
      className="tool-input"
      value={targetRole}
      onChange={(e) => setTargetRole(e.target.value)}
    >
      <option value="">Choose a role</option>
      <option value="Software Engineer">Software Engineer</option>
      <option value="Frontend Developer">Frontend Developer</option>
      <option value="Backend Developer">Backend Developer</option>
      <option value="AI/ML Engineer">AI/ML Engineer</option>
      <option value="Data Analyst">Data Analyst</option>
    </select>

    <label htmlFor="job-description">Job description</label>
    <textarea
      id="job-description"
      className="tool-textarea"
      placeholder="Paste the job description here..."
      rows={8}
      value={jobDescription}
      onChange={(e) => setJobDescription(e.target.value)}
    />

    <div className="form-meta">
      <span>{jobDescription.trim().length} characters</span>
      <span>Minimum 50 characters</span>
    </div>

    <button
      className="primary-button"
      disabled={!targetRole || jobDescription.trim().length < 50}
      onClick={async () => {
  try {
    setJobMatchLoading(true);
    setJobMatchResult(null);
    setJobMatchStatus("Analyzing job match...");

    const result = await api.matchJob({
  target_role: targetRole,
  job_description: jobDescription,
  resume_text: resumeAnalysis?.extracted_text ?? "",
});

    setJobMatchResult(result);
    setJobMatchStatus("Job matching completed successfully!");
  } catch (error) {
    setJobMatchStatus(error.message || "Job matching failed.");
  } finally {
    setJobMatchLoading(false);
  }
}}
    >
      <Target size={17} /> Analyze job match
    </button>

    {jobMatchStatus && (
      <p className="helper-text" role="status">{jobMatchStatus}</p>
    )}

    {jobMatchResult && (
      <div className="analysis-results">
        <h3>Job Match Results</h3>

        <p>
          Match percentage:{" "}
          {jobMatchResult.match_percentage == null
            ? "Upload or analyze a resume to calculate your match"
            : `${jobMatchResult.match_percentage}%`}
        </p>

        <h4>Matched Skills</h4>
        <div className="skill-tags">
          {(jobMatchResult.matched_skills ?? []).map((skill) => (
            <span className="skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        <h4>Missing Skills</h4>
        <div className="skill-tags">
          {(jobMatchResult.missing_skills ?? []).map((skill) => (
            <span className="skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>




{jobMatchResult?.chart_data && (
  <div className="panel job-match-chart">
    <h3>Skill Gap Analysis</h3>
    <p>Compare the skills detected in the job description with your resume.</p>

    <div className="skill-chart-bars">
      {jobMatchResult.chart_data.labels.map((label, index) => {
        const value = jobMatchResult.chart_data.values[index] ?? 0;
        const total = jobMatchResult.required_skills?.length ?? 0;
        const percentage = total
          ? Math.round((value / total) * 100)
          : 0;

        return (
          <div className="skill-chart-row" key={label}>
            <div className="skill-chart-label">
              <span>{label}</span>
              <strong>{value} ({percentage}%)</strong>
            </div>

            <div className="skill-chart-track">
              <div
                className={`skill-chart-fill ${
                  index === 0 ? "matched" : "missing"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}





{jobMatchResult?.priority_recommendations?.length > 0 && (
  <div className="panel job-match-recommendations">
    <h3>Recommended Next Steps</h3>
    <p>Focus on these skills to improve your job alignment.</p>

    {jobMatchResult.priority_recommendations.map((item) => {
      const builtInSkill = roadmapSkills.find(
        (skill) => skill.title.toLowerCase() === item.skill.toLowerCase()
      );

      const customSkill = customSkills.find(
        (skill) => skill.title.toLowerCase() === item.skill.toLowerCase()
      );

      const existingSkill = builtInSkill || customSkill;

      return (
        <div className="recommendation-item" key={item.skill}>
          <div>
            <strong>{item.skill}</strong>
            <p>{item.recommendation}</p>
          </div>

          <div className="recommendation-actions">
            <span
              className={`priority-label ${
                item.priority === "High"
                  ? "priority-high"
                  : "priority-normal"
              }`}
            >
              {item.priority}
            </span>

            <button
              type="button"
              className="add-roadmap-button"
              disabled={Boolean(existingSkill)}
              onClick={() => {
                setCustomSkills((previous) => [
                  ...previous,
                  {
                    id: `custom-${Date.now()}`,
                    title: item.skill,
                    detail: item.recommendation,
                    time: "Self-paced",
                    category: "Custom",
                  },
                ]);
              }}
            >
              {existingSkill ? "Already in Roadmap" : "Add to Roadmap"}
            </button>
          </div>
        </div>
      );
    })}
  </div>
)}




      </div>
    )}
  </div>
)}



{active === "Skill Roadmap" && (() => {
  const allSkills = [
    ...roadmapSkills,
    ...customSkills,
  ];

  const visibleSkills = allSkills.filter((skill) =>
    skill.title.toLowerCase().includes(skillSearch.toLowerCase()) ||
    skill.category.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const completedCount = allSkills.filter((skill) =>
    completedSkills.includes(skill.id)
  ).length;

  const progress = allSkills.length
    ? Math.round((completedCount / allSkills.length) * 100)
    : 0;

  return (
    <div className="panel tool-card">
      <h3>Your learning roadmap</h3>
      <p>
        Select the skills you want to develop for software and AI
        engineering roles. Track each skill as you complete it.
      </p>

      <div className="roadmap-summary">
        <div>
          <span className="stat-caption">COMPLETED SKILLS</span>
          <h2>{completedCount} / {allSkills.length}</h2>
        </div>

        <div className="roadmap-progress">
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}% complete</span>
        </div>
      </div>

      <div className="roadmap-add-skill">
        <input
          type="text"
          value={skillSearch}
          onChange={(event) => setSkillSearch(event.target.value)}
          placeholder="Search skills or categories..."
          aria-label="Search skills"
        />


<form
  onSubmit={(event) => {
    event.preventDefault();

    const title = newSkill.trim();
    if (!title) return;

    const exists = [...roadmapSkills, ...customSkills].some(
      (skill) => skill.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) {
      alert("This skill already exists.");
      return;
    }

    setCustomSkills((previous) => [
      ...previous,
      {
        id: `custom-${Date.now()}`,
        title,
        detail: newSkillDetail.trim() || "Custom skill added by you",
        time: newSkillTime,
        category: newSkillCategory,
      },
    ]);

    setNewSkill("");
    setNewSkillDetail("");
    setNewSkillTime("2 weeks");
    setNewSkillCategory("Programming");
  }}
>
  <input
    type="text"
    value={newSkill}
    onChange={(event) => setNewSkill(event.target.value)}
    placeholder="Skill name (e.g. Cloud Computing)"
    required
  />

  <input
    type="text"
    value={newSkillDetail}
    onChange={(event) => setNewSkillDetail(event.target.value)}
    placeholder="Description (e.g. AWS and cloud deployment)"
  />

  <select
    value={newSkillTime}
    onChange={(event) => setNewSkillTime(event.target.value)}
  >
    <option value="1 week">1 week</option>
    <option value="2 weeks">2 weeks</option>
    <option value="3 weeks">3 weeks</option>
    <option value="4 weeks">4 weeks</option>
    <option value="6 weeks">6 weeks</option>
    <option value="8 weeks">8 weeks</option>
    <option value="Self-paced">Self-paced</option>
  </select>

  <select
    value={newSkillCategory}
    onChange={(event) => setNewSkillCategory(event.target.value)}
  >
    <option value="Programming">Programming</option>
    <option value="DSA">DSA</option>
    <option value="Web Development">Web Development</option>
    <option value="Backend">Backend</option>
    <option value="Databases">Databases</option>
    <option value="AI & ML">AI & ML</option>
    <option value="AI Engineering">AI Engineering</option>
    <option value="Cloud & DevOps">Cloud & DevOps</option>
    <option value="Tools">Tools</option>
    <option value="Soft Skills">Soft Skills</option>
    <option value="Custom">Other</option>
  </select>

  <button type="submit" disabled={!newSkill.trim()}>
    Add skill
  </button>
</form>

      </div>

      {visibleSkills.length === 0 && (
        <p>No skills found. Try another search or add a custom skill.</p>
      )}

      {visibleSkills.map((skill) => {
        const done = completedSkills.includes(skill.id);

        return (
          <label
            className={`roadmap-item ${done ? "roadmap-done" : ""}`}
            key={skill.id}
          >
            <input
              type="checkbox"
              checked={done}
              onChange={() =>
                setCompletedSkills((previous) =>
                  done
                    ? previous.filter((id) => id !== skill.id)
                    : [...previous, skill.id]
                )
              }
            />

            <div className="roadmap-skill">
              <strong>{skill.title}</strong>
              <p>{skill.detail}</p>
              <span>
                <Clock size={13} /> {skill.time} · {skill.category}
              </span>
            </div>


<span className="roadmap-status">
  {done ? "Completed" : "In progress"}
</span>

{String(skill.id).startsWith("custom-") && (
  <button
    type="button"
    className="delete-skill-button"
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();

      setCustomSkills((previous) =>
        previous.filter((item) => item.id !== skill.id)
      );

      setCompletedSkills((previous) =>
        previous.filter((id) => id !== skill.id)
      );
    }}
  >
    Delete
  </button>
)}

          </label>
        );
      })}
    </div>
  );
})()}





{active === "Interview Prep" && (
  <div className="panel tool-card interview-card">
    <h3>Practice an interview</h3>
    <p>Build confidence one question at a time.</p>

    <div className="interview-categories">
      {["DSA", "Technical", "HR"].map((type) => (
        <button
          key={type}
          className={`interview-category ${
            interviewType === type ? "selected" : ""
          }`}
          onClick={() => {
            setInterviewType(type);
            setInterviewQuestionIndex(0);
            setInterviewAnswer("");
            setInterviewFeedback("");
          }}
        >
          {type === "DSA" ? "Data Structures" : type === "HR" ? "HR Round" : "Technical"}
        </button>
      ))}
    </div>

    <div className="question-meta">
      <span>QUESTION {interviewQuestionIndex + 1} OF 3</span>
      <span>{interviewType} ROUND</span>
    </div>

    <h2 className="interview-question">
  {questionsLoading
    ? "Loading questions..."
    : questionsFromApi[interviewQuestionIndex] ??
      "No questions available."}
</h2>



    <label htmlFor="interview-answer">Your answer</label>
    <textarea
      id="interview-answer"
      className="tool-textarea"
      rows={6}
      value={interviewAnswer}
      onChange={(e) => {
        setInterviewAnswer(e.target.value);
        setInterviewFeedback("");
      }}
      placeholder="Write your answer here..."
    />

    <div className="interview-actions">
      <button
        className="secondary-button"
        onClick={() => {
          setInterviewAnswer("");
          setInterviewFeedback("");
        }}
      >
        Clear answer
      </button>


<button
  className="primary-button"
  disabled={!interviewAnswer.trim()}
  onClick={async () => {
    try {
      setInterviewFeedback("Evaluating your answer...");

      const result = await api.evaluateInterview({
        question:
          interviewQuestions[interviewType][interviewQuestionIndex].question,
        answer: interviewAnswer.trim(),
        category: interviewType,
      });

      const feedback = Array.isArray(result.feedback)
        ? result.feedback
            .map((item) =>
              typeof item === "string"
                ? item
                : item?.message ?? JSON.stringify(item)
            )
            .join("\n")
        : typeof result.feedback === "string"
          ? result.feedback
          : "";

      const feedbackText = [
        result.ai_feedback
          ? `AI Interview Evaluation:\n${result.ai_feedback}`
          : "",
        feedback,
        result.message ?? "",
      ]
        .filter(Boolean)
        .join("\n\n");

      setInterviewFeedback(
        feedbackText || "Evaluation completed."
      );
    } catch (error) {
      setInterviewFeedback(
        error.message || "Could not evaluate your answer."
      );
    }
  }}
>
  Submit answer
</button>

    </div>



{interviewFeedback && (
  <div className="helper-text interview-feedback" role="status">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h3>{children}</h3>,
        h2: ({ children }) => <h3>{children}</h3>,
        h3: ({ children }) => <h4>{children}</h4>,
        p: ({ children }) => <p>{children}</p>,
        ul: ({ children }) => <ul>{children}</ul>,
        ol: ({ children }) => <ol>{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong>{children}</strong>,
      }}
    >
      {typeof interviewFeedback === "string"
        ? interviewFeedback
        : Array.isArray(interviewFeedback)
          ? interviewFeedback.join("\n")
          : interviewFeedback.feedback
            ? Array.isArray(interviewFeedback.feedback)
              ? interviewFeedback.feedback.join("\n")
              : interviewFeedback.feedback
            : interviewFeedback.message ??
              JSON.stringify(interviewFeedback)}
    </ReactMarkdown>
  </div>
)}



    <button
  className="next-question"
  disabled={
    questionsLoading ||
    questionsFromApi.length === 0
  }
  onClick={() => {
    setInterviewQuestionIndex((previous) =>
      (previous + 1) % questionsFromApi.length
    );

    setInterviewAnswer("");
    setInterviewFeedback("");
  }}
>
  Next question →
</button>
  </div>
)}



{active === "Applications" && (
  <div className="panel tool-card">
    <div className="applications-title-row">
      <div>
        <h3>Application Tracker</h3>
        <p>Keep every opportunity and next step organized.</p>
      </div>
      <span className="application-count">
        {applicationList.length} applications
      </span>
    </div>

    <div className="application-stats">
      {[
        ["Applied", "Applications sent"],
        ["Interview", "Interviews"],
        ["Offer", "Offers received"],
      ].map(([status, label]) => (
        <div className="application-stat" key={status}>
          <span>{label}</span>
          <strong>
            {applicationList.filter((app) => app.status === status).length}
          </strong>
        </div>
      ))}
    </div>

    <h3 className="form-section-title">Add an application</h3>

    <form
      className="application-form"
     onSubmit={async (e) => {
  e.preventDefault();

  if (!companyInput.trim() || !roleInput.trim()) {
    return;
  }

  try {
    setSavingApplication(true);
    setApplicationsError("");

    const data = await api.createApplication({
      company: companyInput.trim(),
      role: roleInput.trim(),
      status: statusInput,
    });

    const newApplication = data.application ?? data;

    setApplicationList((previous) => [
      ...previous,
      newApplication,
    ]);

    setCompanyInput("");
    setRoleInput("");
    setStatusInput("Applied");
  } catch (error) {
    setApplicationsError(error.message);
  } finally {
    setSavingApplication(false);
  }
}}
    >
      <div className="application-form-grid">
        <div>
          <label htmlFor="company-name">Company</label>
          <input
            id="company-name"
            className="tool-input"
            placeholder="e.g. Google"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="job-role">Job role</label>
          <input
            id="job-role"
            className="tool-input"
            placeholder="e.g. Software Engineer"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            required
          />
        </div>
      </div>

      <label htmlFor="application-status">Current status</label>
      <select
        id="application-status"
        className="tool-input"
        value={statusInput}
        onChange={(e) => setStatusInput(e.target.value)}
      >
        <option value="Applied">Applied</option>
        <option value="Assessment">Assessment</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <button className="primary-button" type="submit" disabled={savingApplication}>
        <Plus size={17} /> Add application
      </button>
    </form>
{applicationsLoading && (
  <p>Loading applications...</p>
)}

{applicationsError && (
  <p role="alert">{applicationsError}</p>
)}
    <div className="application-list-heading">
      <h3>Your applications</h3>
      <span>{applicationList.length} total</span>
    </div>

    <input
      className="tool-input"
      aria-label="Search applications"
      placeholder="Search by company or role..."
      value={applicationSearch}
      onChange={(e) => setApplicationSearch(e.target.value)}
    />

    <div className="application-list">
      {applicationList
        .filter((app) =>
          `${app.company} ${app.role}`
            .toLowerCase()
            .includes(applicationSearch.trim().toLowerCase())
        )
        .map((app) => (
          <div className="application-row" key={app.id ?? app.company}>
            <div className="company-mark">
              {app.company[0].toUpperCase()}
            </div>

            <div className="application-info">
              <strong>{app.company}</strong>
              <span>{app.role}</span>
            </div>

            <select
  aria-label={`Update status for ${app.company}`}
  className="application-status-select"
  value={app.status}
  onChange={async (e) => {
    const newStatus = e.target.value;

    try {
      setApplicationsError("");

      const data = await api.updateApplication(app.id, {
        status: newStatus,
      });

      const updatedApp = data.application ?? data;

      setApplicationList((previous) =>
        previous.map((item) =>
          item.id === app.id ? updatedApp : item
        )
      );
    } catch (error) {
      setApplicationsError(error.message);
    }
  }}
>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              type="button"
              className="remove-application"
              aria-label={`Remove ${app.company}`}
              onClick={async () => {
  try {
    setApplicationsError("");

    await api.deleteApplication(app.id);

    setApplicationList((previous) =>
      previous.filter((item) => item.id !== app.id)
    );
  } catch (error) {
    setApplicationsError(error.message);
  }
}}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

      {applicationList.filter((app) =>
        `${app.company} ${app.role}`
          .toLowerCase()
          .includes(applicationSearch.trim().toLowerCase())
      ).length === 0 && (
        <p className="empty-state">No matching applications found.</p>
      )}
    </div>
  </div>
)}

            </section>
          )}

          {active === "Overview" && (
            <>
  <div className="welcome-row">
            <div>
              <div className="eyebrow"><span className="status-dot" /> YOUR CAREER, IN FOCUS</div>
              <h1>
  Good afternoon, {currentUser?.name || "there"}{" "}
  <span className="wave">✦</span>
</h1>
              <p className="page-subtitle">Small steps today. Big opportunities tomorrow.</p>
            </div>
            <button className="primary-button" onClick={() => setActive("Resume Analyzer")}><Plus size={18} /> Analyze my resume</button>
          </div>

          <section className="hero-card">
            <div className="hero-content">
              <div className="hero-badge"><Sparkles size={14} /> YOUR CAREER COPILOT</div>
              <h2>Turn your potential<br />into your next opportunity.</h2>
              <p>Get a clearer picture of your strengths, discover relevant roles, and build a plan to get there.</p>
              <button className="hero-button" onClick={() => setActive("Job Matching")}>Explore job matches <ArrowUpRight size={17} /></button>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="art-core"><Sparkles size={38} /></div>
              <div className="float-card float-one"><Target size={17} /><span><b>Find your fit</b><small>Skills + interests</small></span></div>
              <div className="float-card float-two"><CircleCheck size={17} /><span><b>Track progress</b><small>One step at a time</small></span></div>
              <div className="art-glow" />
            </div>
          </section>

          <div className="section-heading">
            <div><h2>Your career snapshot</h2><p>A quick look at where you stand.</p></div>
            <button className="text-button" onClick={() => setActive("Applications")}>View activity <ArrowUpRight size={15} /></button>
          </div>


<section className="stats-grid">
  <article className="stat-card">
    <div className="stat-top">
      <span className="stat-icon purple">
        <BriefcaseBusiness size={19} />
      </span>
      <span className="stat-caption">APPLICATIONS</span>
    </div>
    <div className="stat-value">{totalApplications}</div>
    <div className="stat-label">Applications tracked</div>
    <div className="stat-foot">
      {totalInterviews} interview{totalInterviews !== 1 ? "s" : ""} scheduled or in progress
    </div>
  </article>

  <article className="stat-card">
    <div className="stat-top">
      <span className="stat-icon blue">
        <FileText size={19} />
      </span>
      <span className="stat-caption">RESUME</span>
    </div>
    <div className="stat-value">
      {resumeAnalysis ? resumeAnalysis.word_count ?? "—" : "—"}
    </div>
    <div className="stat-label">Resume words analyzed</div>
    <div className="stat-foot">
      {resumeAnalysis ? "Analysis available" : "Analyze a resume to get started"}
    </div>
  </article>

  <article className="stat-card">
    <div className="stat-top">
      <span className="stat-icon green">
        <Target size={19} />
      </span>
      <span className="stat-caption">JOB MATCH</span>
    </div>
    <div className="stat-value">
      {jobMatchResult?.match_percentage == null
        ? "—"
        : `${jobMatchResult.match_percentage}%`}
    </div>
    <div className="stat-label">Latest job match</div>
    <div className="stat-foot">
      {jobMatchResult?.match_percentage == null
        ? "Analyze a job description to compare skills"
        : "Based on keyword overlap"}
    </div>
  </article>

  <article className="stat-card">
    <div className="stat-top">
      <span className="stat-icon orange">
        <GraduationCap size={19} />
      </span>
      <span className="stat-caption">YOUR LEARNING</span>
    </div>
    <div className="stat-value">
      {completedSkillCount}
      <span className="stat-unit">/{totalRoadmapSkills}</span>
    </div>
    <div className="stat-label">Skills completed</div>
    <div className="progress-track orange-track">
      <span style={{ width: `${roadmapPercentage}%` }} />
    </div>
  </article>
</section>


          <section className="lower-grid">
            <article className="panel applications-panel">
              <div className="panel-heading"><div><h3>Recent applications</h3><p>Keep your next steps in sight.</p></div><button className="icon-button" onClick={() => setActive("Applications")}><ArrowUpRight size={18} /></button></div>
              <div className="application-list">
                {filteredApps.length ? filteredApps.map((app) => (
                  <div className="application-row" key={app.id}>
                    <div className="company-mark" style={{ "--company-color": app.color }}>{app.company[0]}</div>
                    <div className="application-info"><strong>{app.company}</strong><span>{app.role}</span></div>
                    <span className={`status-pill status-${app.status.toLowerCase().replace(" ", "-")}`}>{app.status}</span>
                  </div>
                )) : <div className="empty-state">No matching applications found.</div>}
              </div>
              <button className="panel-footer-button" onClick={() => setActive("Applications")}>View all applications <ArrowUpRight size={16} /></button>
            </article>

            <article className="panel focus-panel">
              <div className="panel-heading"><div><h3>Your next best steps</h3><p>Keep the momentum going.</p></div><span className="sparkle-small"><Sparkles size={18} /></span></div>
              <div className="focus-item"><div className="focus-number">01</div><div><strong>Strengthen your resume</strong><p>Highlight your projects and measurable impact.</p><button onClick={() => setActive("Resume Analyzer")}>Review resume <ArrowUpRight size={14} /></button></div></div>
              <div className="focus-item">
  <div className="focus-number">02</div>
  <div>
    <strong>Practice for interviews</strong>
    <p>Build confidence with focused practice.</p>
    <button onClick={() => setActive("Interview Prep")}>

      Start practicing <ArrowUpRight size={14} />
    </button>
  </div>
</div>
              <div className="focus-item">
  <div className="focus-number">03</div>
  <div>
    <strong>Find your job match</strong>
    <p>Compare your skills with the requirements of a target role.</p>
    <button onClick={() => setActive("Job Matcher")}>
      Check job match <ArrowUpRight size={14} />
    </button>
  </div>
</div>
            </article>
          </section>
          </>
          )}
          <footer className="page-footer"><span>© 2026 CareerForge</span><span>Built for your next chapter <span className="footer-sparkle">✦</span></span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
