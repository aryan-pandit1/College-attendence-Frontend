import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

import {
  FaGithub,
  FaLinkedin,
  FaReact,
  FaDatabase,
  FaServer,
  FaLaptopCode,
  FaUserGraduate,
  FaShieldAlt,
  FaCloud,
  FaCode,
  FaArrowDown,
  FaArrowLeft,
  FaBrain,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";

import {
  SiDjango,
  SiPostgresql,
  SiVite,
  SiRender,
  SiVercel,
  SiJsonwebtokens,
  SiGit,
} from "react-icons/si";

const features = [
  {
    icon: <FaBrain />,
    title: "Smart Attendance Math",
    description:
      "Skip a class without a doubt—our Safe Bunk math will sort you out! Know exactly when to stay or go while keeping your percentage high and in the flow.",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Timetable Automation",
    description:
      "No more logging day by day—your schedule tracks the automated way! Open your dashboard when morning starts, and attendance logs without manual charts.",
  },
  {
    icon: <FaChartLine />,
    title: "Real-Time GPA Engine",
    description:
      "Track your credits, boost your score—calculate your CGPA and more! Input your internals, predict your grade, and see how your semester goals are made.",
  },
  {
    icon: <FaUserGraduate />,
    title: "Centralized Student Hub",
    description:
      "From lecture halls to exam dates—Semtrek handles all your academic slates. Everything you need is in one clean space, running at a lightning-fast pace.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Enterprise-Grade Security",
    description:
      "Protected sessions, encrypted keys—log into your portal with absolute ease. Powered by JWTs and modern cloud armor to keep your student data calmer.",
  },
  {
    icon: <FaCloud />,
    title: "Cloud-Native Power",
    description:
      "Frontend on Vercel, Django on Render—built to be a high-speed contender. Accessible anywhere on mobile or Mac, keeping your college life right on track.",
  },
];

const technologies = [
  { icon: <FaReact />, title: "React 18" },
  { icon: <SiVite />, title: "Vite" },
  { icon: <SiDjango />, title: "Django 5" },
  { icon: <FaServer />, title: "Django REST" },
  { icon: <SiPostgresql />, title: "PostgreSQL" },
  { icon: <SiJsonwebtokens />, title: "JWT Auth" },
  { icon: <SiGit />, title: "Git Versioning" },
  { icon: <FaGithub />, title: "GitHub Actions" },
  { icon: <SiRender />, title: "Render Cloud" },
  { icon: <SiVercel />, title: "Vercel Edge" },
];

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ⚡ 1. FORCE SCROLL TO EXACT TOP PIXEL
    window.scrollTo(0, 0);

    // ⚡ 2. INVISIBLY COLLAPSE GLOBAL NAVBAR/HEADER
    const nav =
      document.querySelector("nav") ||
      document.querySelector(".navbar") ||
      document.querySelector("header.app-header");
    if (nav) nav.style.display = "none";

    return () => {
      if (nav) nav.style.display = "";
    };
  }, []);

  return (
    <div className="about-page">
      {/* ⚡ PERMANENTLY STICKY BACK BUTTON */}
      <button
        className="about-back-btn"
        onClick={() => navigate(-1)}
        title="Return to previous page"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-blur blur1"></div>
        <div className="hero-blur blur2"></div>
        <div className="hero-blur blur3"></div>

        <div className="hero-content">
          <span className="badge">⚡ Track your stats, skip the stress—Semtrek leads to your success!</span>

          <h1>
            Track Every Class, Ace Every Test—
            <span>Semtrek Handles All The Rest!</span>
          </h1>

          <p>
            No more guessing if your attendance is low, no more wondering how your GPA will go! 
            We combine automated timetables, smart bunk predictions, and instant grade analytics 
            into one lightning-fast academic companion built to guard your college trek.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Launch Dashboard
            </button>

            <a
              href="#architecture"
              className="secondary-btn"
              style={{ textDecoration: "none" }}
            >
              Explore Architecture
            </a>
          </div>
        </div>

        <div className="scroll-down">
          <FaArrowDown />
        </div>
      </section>

      {/* ================= ABOUT & ARCHITECTURE ================= */}
      <section id="architecture" className="about-section">
        <div className="section-title">
          <h2>Engineering The Solution</h2>
          <p>
            Why we built Semtrek and the core architectural principles that make
            it reliable, fast, and scalable.
          </p>
        </div>

        <div className="about-grid">
          <div className="glass-card">
            <h3>Our Core Vision</h3>
            <p>
              Traditional university portals are notoriously clunky, fragmented,
              and stressful to navigate. Semtrek was born out of a desire to create a
              single, seamless academic dashboard that actually works for students.
            </p>
            <p>
              By translating complex academic bylaws into automated background
              algorithms—like safe bunk math and timetable synchronization—we empower
              students to focus on learning rather than bookkeeping.
            </p>
          </div>

          <div className="glass-card">
            <h3>System Architecture</h3>
            <p>
              Built as a decoupled Single Page Application (SPA), the frontend leverages
              React and Vite for sub-second route transitions, optimistic UI updates,
              and robust local storage caching.
            </p>
            <p>
              The backend is driven by Django REST Framework (DRF) communicating with a
              relational PostgreSQL database, utilizing composite keys to flawlessly
              track recurring daily lectures without data duplication.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">
        <div className="section-title">
          <h2>Powerful Capabilities</h2>
          <p>Everything you need to master your academic lifecycle, integrated into one workspace.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="tech-section">
        <div className="section-title">
          <h2>Technology Stack</h2>
          <p>
            Built with production-grade tools and industry-standard frameworks to ensure
            uncompromising speed and data integrity.
          </p>
        </div>

        <div className="tech-grid">
          {technologies.map((tech, index) => (
            <div key={index} className="tech-card">
              <div className="tech-icon">{tech.icon}</div>
              <h3>{tech.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DEVELOPERS ================= */}
      <section className="developers-section">
        <div className="section-title">
          <h2>Meet The Engineers</h2>
          <p>
            Collaboratively architected with a clean separation of concerns across frontend UI/UX and backend systems.
          </p>
        </div>

        <div className="developers-grid">
          {/* ================= BACKEND ================= */}
          <div className="developer-card">
            <div className="developer-image">
              <img
                src="/images/backend-placeholder.png"
                alt="Raj Aryan Pandey"
              />
            </div>

            <span className="developer-role">Backend Architect</span>

            <h3>Raj Aryan Pandey</h3>

            <p className="developer-description">
              Spearheaded the server-side engineering, database schema design, and RESTful API development. Implemented complex backend logic including composite timetable indexing, automated daily attendance generation, JWT security layers, and cloud database optimization on PostgreSQL.
            </p>

            <div className="skills">
              <span>Django 5</span>
              <span>REST Framework</span>
              <span>PostgreSQL</span>
              <span>JWT Security</span>
              <span>Python 3.12</span>
              <span>Cloud Devops</span>
            </div>

            <div className="developer-links">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn">
                <FaGithub /> GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn">
                <FaLinkedin /> LinkedIn
              </a>
            </div>
          </div>

          {/* ================= FRONTEND ================= */}
          <div className="developer-card">
            <div className="developer-image">
              <img
                src="/images/frontend-placeholder.png"
                alt="Aryan Pandit"
              />
            </div>

            <span className="developer-role">Frontend Engineer & UI/UX</span>

            <h3>Aryan Pandit</h3>

            <p className="developer-description">
              Architected the client-side React application, focusing on responsive glassmorphism interfaces, sub-second state management, and intuitive user experiences. Integrated optimistic UI updates, custom skeleton loading engines, cross-tab synchronization, and predictive attendance visualization.
            </p>

            <div className="skills">
              <span>React.js</span>
              <span>Vite Ecosystem</span>
              <span>UI/UX Design</span>
              <span>State Management</span>
              <span>Responsive Web</span>
              <span>API Integration</span>
            </div>

            <div className="developer-links">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn">
                <FaGithub /> GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn">
                <FaLinkedin /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECT STATS ================= */}
      <section className="stats-section">
        <div className="section-title">
          <h2>By The Numbers</h2>
          <p>Key metrics demonstrating the depth and reliability of the platform.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h1>99.9%</h1>
            <p>Cloud Uptime</p>
          </div>
          <div className="stat-card">
            <h1>&lt;50ms</h1>
            <p>API Latency</p>
          </div>
          <div className="stat-card">
            <h1>35+</h1>
            <p>REST Endpoints</p>
          </div>
          <div className="stat-card">
            <h1>100%</h1>
            <p>Automated Workflow</p>
          </div>
        </div>
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="timeline-section">
        <div className="section-title">
          <h2>Development Roadmap</h2>
          <p>How Semtrek evolved from an initial concept into a production-ready platform.</p>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <span>01</span>
            <h3>Architecture & Scope</h3>
            <p>Mapped out ER diagrams, composite key requirements for timetables, and REST API endpoints.</p>
          </div>
          <div className="timeline-item">
            <span>02</span>
            <h3>UI/UX & Design System</h3>
            <p>Created a unified glassmorphism design system with responsive layouts and skeleton loading states.</p>
          </div>
          <div className="timeline-item">
            <span>03</span>
            <h3>Core API Engineering</h3>
            <p>Built Django REST endpoints, integrated PostgreSQL, and engineered automated daily attendance triggers.</p>
          </div>
          <div className="timeline-item">
            <span>04</span>
            <h3>Smart Algorithms</h3>
            <p>Developed predictive math models for safe bunks and real-time semester CGPA calculation engines.</p>
          </div>
          <div className="timeline-item">
            <span>05</span>
            <h3>Cloud Deployment</h3>
            <p>Deployed frontend on Vercel Edge and backend on Render with strict CORS and JWT authentication.</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="about-footer">
        <h2>Semtrek Academic Companion</h2>
        <p>
          Built with precision, passion, and modern engineering principles to redefine the student academic experience.
        </p>
        <small>
          ©️ 2026 Semtrek Systems. All Rights Reserved. Designed & Developed by Raj Aryan Pandey & Aryan Pandit.
        </small>
      </footer>
    </div>
  );
};

export default About;