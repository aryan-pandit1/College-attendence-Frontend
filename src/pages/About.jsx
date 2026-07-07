import React from "react";
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
    icon: <FaUserGraduate />,
    title: "Student Dashboard",
    description:
      "A centralized dashboard where students can access attendance, academic performance, semester information, and personal details."
  },
  {
    icon: <FaDatabase />,
    title: "Attendance Tracking",
    description:
      "Students can monitor attendance subject-wise with clear percentages and real-time records."
  },
  {
    icon: <FaLaptopCode />,
    title: "Internal Marks",
    description:
      "Track internal assessment marks, practical scores, and semester performance from one place."
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Authentication",
    description:
      "JWT-based authentication ensures safe login, protected APIs, and secure user sessions."
  },
  {
    icon: <FaCloud />,
    title: "Cloud Deployment",
    description:
      "Frontend deployed on Vercel and backend hosted on Render for reliable cloud accessibility."
  },
  {
    icon: <FaCode />,
    title: "Modern Architecture",
    description:
      "Built using React, Django REST Framework, PostgreSQL, and RESTful APIs following industry standards."
  },
];

const technologies = [
  {
    icon: <FaReact />,
    title: "React",
  },
  {
    icon: <SiVite />,
    title: "Vite",
  },
  {
    icon: <SiDjango />,
    title: "Django",
  },
  {
    icon: <FaServer />,
    title: "Django REST",
  },
  {
    icon: <SiPostgresql />,
    title: "PostgreSQL",
  },
  {
    icon: <SiJsonwebtokens />,
    title: "JWT",
  },
  {
    icon: <SiGit />,
    title: "Git",
  },
  {
    icon: <FaGithub />,
    title: "GitHub",
  },
  {
    icon: <SiRender />,
    title: "Render",
  },
  {
    icon: <SiVercel />,
    title: "Vercel",
  },
];

const About = () => {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-blur blur1"></div>
        <div className="hero-blur blur2"></div>
        <div className="hero-blur blur3"></div>

        <div className="hero-content">

          <span className="badge">
            Academic Management System
          </span>

          <h1>
            Simplifying Academic
            <span> Management</span>
          </h1>

          <p>
            A modern full-stack academic platform designed to streamline
            attendance, student records, internal marks, authentication,
            and academic management through a secure, scalable,
            and responsive web application.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Explore Project
            </button>

            <button className="secondary-btn">
              Meet Developers
            </button>

          </div>

        </div>

        <div className="scroll-down">

          <FaArrowDown />

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section className="about-section">

        <div className="section-title">

          <h2>About The Project</h2>

          <p>
            Built with modern web technologies to improve academic
            management and provide a seamless experience for students
            and administrators.
          </p>

        </div>

        <div className="about-grid">

          <div className="glass-card">

            <h3>Our Vision</h3>

            <p>

              Academic Management System was developed with the goal of
              providing a single platform where students can easily
              access their attendance, academic records, internal marks,
              semester details, and much more.

            </p>

            <p>

              Instead of navigating through multiple systems, this
              platform offers an intuitive dashboard backed by secure
              authentication and scalable APIs.

            </p>

          </div>

          <div className="glass-card">

            <h3>Why This Project?</h3>

            <p>

              Many educational institutions still rely on fragmented
              systems that make accessing academic information
              unnecessarily complicated.

            </p>

            <p>

              Our objective was to create a modern solution using
              React and Django that combines simplicity,
              performance, and security into one unified platform.

            </p>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="section-title">

          <h2>Key Features</h2>

          <p>

            Everything students need in one place.

          </p>

        </div>

        <div className="features-grid">

          {features.map((feature, index) => (

            <div
              className="feature-card"
              key={index}
            >

              <div className="feature-icon">

                {feature.icon}

              </div>

              <h3>

                {feature.title}

              </h3>

              <p>

                {feature.description}

              </p>

            </div>

          ))}

        </div>

      </section>

      {/* ================= TECH STACK ================= */}

      <section className="tech-section">

        <div className="section-title">

          <h2>Technology Stack</h2>

          <p>

            Industry-standard technologies used to build
            a fast, secure, and scalable application.

          </p>

        </div>

        <div className="tech-grid">

          {technologies.map((tech, index) => (

            <div
              key={index}
              className="tech-card"
            >

              <div className="tech-icon">

                {tech.icon}

              </div>

              <h3>

                {tech.title}

              </h3>

            </div>

          ))}

        </div>

      </section>

            {/* ================= DEVELOPERS ================= */}

      <section className="developers-section">

        <div className="section-title">
          <h2>Meet The Developers</h2>

          <p>
            This project was collaboratively developed with clearly
            defined frontend and backend responsibilities.
          </p>
        </div>

        <div className="developers-grid">

          {/* ================= BACKEND ================= */}

          <div className="developer-card">

            <div className="developer-image">

              {/* Replace with your image later */}

              <img
                src="/images/backend-placeholder.png"
                alt="Raj Aryan Pandey"
              />

            </div>

            <span className="developer-role">
              Backend Developer
            </span>

            <h3>
              Raj Aryan Pandey
            </h3>

            <p className="developer-description">

              Responsible for designing and developing the complete
              backend architecture including REST APIs, authentication,
              authorization, database design, deployment configuration,
              and backend integration using Django REST Framework.

            </p>

            <div className="skills">

              <span>Django</span>
              <span>DRF</span>
              <span>JWT</span>
              <span>PostgreSQL</span>
              <span>REST APIs</span>
              <span>Deployment</span>

            </div>

            <div className="developer-links">

              {/* Replace href later */}

              <a
                href=""
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                <FaGithub />
                GitHub
              </a>

              <a
                href=""
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                <FaLinkedin />
                LinkedIn
              </a>

            </div>

          </div>

          {/* ================= FRONTEND ================= */}

          <div className="developer-card">

            <div className="developer-image">

              {/* Replace with your friend's image later */}

              <img
                src="/images/frontend-placeholder.png"
                alt="Aryan Pandit"
              />

            </div>

            <span className="developer-role">
              Frontend Developer
            </span>

            <h3>
              Aryan Pandit
            </h3>

            <p className="developer-description">

              Designed and developed the complete user interface,
              user experience, reusable React components,
              responsive layouts, skeleton loading screens,
              frontend architecture, and seamless API integration.

            </p>

            <div className="skills">

              <span>React</span>
              <span>UI / UX</span>
              <span>Responsive Design</span>
              <span>Animations</span>
              <span>Skeleton Loading</span>
              <span>API Integration</span>

            </div>

            <div className="developer-links">

              <a
                href=""
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                <FaGithub />
                GitHub
              </a>

              <a
                href=""
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                <FaLinkedin />
                LinkedIn
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* ================= PROJECT STATS ================= */}

      <section className="stats-section">

        <div className="section-title">

          <h2>Project Statistics</h2>

          <p>
            A quick overview of the development effort.
          </p>

        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <h1>20+</h1>
            <p>React Components</p>
          </div>

          <div className="stat-card">
            <h1>35+</h1>
            <p>REST APIs</p>
          </div>

          <div className="stat-card">
            <h1>10+</h1>
            <p>Database Models</p>
          </div>

          <div className="stat-card">
            <h1>100%</h1>
            <p>Responsive</p>
          </div>

        </div>

      </section>

      {/* ================= TIMELINE ================= */}

      <section className="timeline-section">

        <div className="section-title">

          <h2>Development Journey</h2>

        </div>

        <div className="timeline">

          <div className="timeline-item">
            <span>01</span>
            <h3>Project Planning</h3>
            <p>Requirement analysis and project architecture.</p>
          </div>

          <div className="timeline-item">
            <span>02</span>
            <h3>Frontend Development</h3>
            <p>Modern React UI with reusable components.</p>
          </div>

          <div className="timeline-item">
            <span>03</span>
            <h3>Backend Development</h3>
            <p>Django REST APIs with PostgreSQL integration.</p>
          </div>

          <div className="timeline-item">
            <span>04</span>
            <h3>Authentication</h3>
            <p>JWT authentication and protected routes.</p>
          </div>

          <div className="timeline-item">
            <span>05</span>
            <h3>Deployment</h3>
            <p>Frontend on Vercel and backend on Render.</p>
          </div>

        </div>

      </section>

      {/* ================= ROADMAP ================= */}

      <section className="roadmap-section">

        <div className="section-title">

          <h2>Future Roadmap</h2>

          <p>
            Features planned for future releases.
          </p>

        </div>

        <div className="roadmap-grid">

          <div className="roadmap-card completed">
            ✅ Student Dashboard
          </div>

          <div className="roadmap-card completed">
            ✅ Attendance Tracking
          </div>

          <div className="roadmap-card completed">
            ✅ JWT Authentication
          </div>

          <div className="roadmap-card completed">
            ✅ Internal Marks
          </div>

          <div className="roadmap-card upcoming">
            🚀 Google Authentication
          </div>

          <div className="roadmap-card upcoming">
            🚀 Assignment Submission
          </div>

          <div className="roadmap-card upcoming">
            🚀 Timetable
          </div>

          <div className="roadmap-card upcoming">
            🚀 AI Academic Assistant
          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="about-footer">

        <h2>
          Academic Management System
        </h2>

        <p>

          Built with passion, teamwork, and modern web technologies
          to simplify academic management.

        </p>

        <small>

          ©️ 2026 Academic Management System.
          All Rights Reserved.

        </small>

      </footer>

    </div>
  );
};

export default About;