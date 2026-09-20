import React, { useState, useEffect, useMemo } from 'react';
import { portfolioData } from './data/portfolioData';
import Header from './components/Header';
import RecruiterSearch from './components/RecruiterSearch';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Coursework from './components/Coursework';
import SkillsMatrix from './components/SkillsMatrix';
import Education from './components/Education';
import Extracurriculars from './components/Extracurriculars';
import ResumeModal from './components/ResumeModal';
import Footer from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gyan_theme') || 'dark';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync theme with document root attribute & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gyan_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Recruiter Search matching engine
  const matches = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return {
        projects: [],
        experiences: [],
        courses: [],
        matchingProjectIds: new Set(),
        matchingExperienceIds: new Set(),
        matchingCourseIds: new Set()
      };
    }

    const matchedProjects = portfolioData.projects.filter((p) => {
      const techMatch = p.technologies.some((t) => t.toLowerCase().includes(q));
      const textMatch = p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return techMatch || textMatch;
    });

    const matchedExperiences = portfolioData.experiences.filter((e) => {
      const techMatch = e.technologies.some((t) => t.toLowerCase().includes(q));
      const companyMatch = e.company.toLowerCase().includes(q);
      const bulletMatch = e.bullets.some((b) => b.toLowerCase().includes(q));
      return techMatch || companyMatch || bulletMatch;
    });

    const matchedCourses = portfolioData.coursework.filter((c) => {
      const techMatch = c.technologies.some((t) => t.toLowerCase().includes(q));
      const titleMatch = c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
      return techMatch || titleMatch;
    });

    return {
      projects: matchedProjects,
      experiences: matchedExperiences,
      courses: matchedCourses,
      matchingProjectIds: new Set(matchedProjects.map((p) => p.id)),
      matchingExperienceIds: new Set(matchedExperiences.map((e) => e.id)),
      matchingCourseIds: new Set(matchedCourses.map((c) => c.id))
    };
  }, [searchQuery]);

  // Jump to specific item and momentarily pulse it
  const handleJumpToItem = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('is-matched');
      setTimeout(() => {
        // Keep matched if still part of query, or re-evaluate
      }, 2000);
    }
  };

  const handleSelectTag = (tag) => {
    setSearchQuery(tag);
    // Smooth scroll up toward search container if needed, or trigger matches
    const searchElem = document.querySelector('.search-container');
    if (searchElem && window.scrollY > 400) {
      searchElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-layout">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onOpenResume={() => setIsResumeOpen(true)} 
      />

      <main className="container">
        {/* Recruiter Skill / Technology Finder Bar */}
        <RecruiterSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          matches={matches}
          onJumpToItem={handleJumpToItem}
        />

        {/* Hero & Fast-Facts Snapshot */}
        <Hero
          personal={portfolioData.personal}
          badges={portfolioData.badges}
          socials={portfolioData.socials}
          onOpenResume={() => setIsResumeOpen(true)}
          onShowToast={showToast}
        />

        {/* Work Experience */}
        <Experience
          experiences={portfolioData.experiences}
          matchingExperienceIds={matches.matchingExperienceIds}
          searchQuery={searchQuery}
          onSelectTag={handleSelectTag}
        />

        {/* Projects */}
        <Projects
          projects={portfolioData.projects}
          matchingProjectIds={matches.matchingProjectIds}
          searchQuery={searchQuery}
          onSelectTag={handleSelectTag}
        />

        {/* Coursework */}
        <Coursework
          coursework={portfolioData.coursework}
          matchingCourseIds={matches.matchingCourseIds}
          searchQuery={searchQuery}
          onSelectTag={handleSelectTag}
        />

        {/* Technical Skills Matrix */}
        <SkillsMatrix
          skills={portfolioData.skills}
          searchQuery={searchQuery}
          onSelectSkill={handleSelectTag}
        />

        {/* Education */}
        <Education 
          education={portfolioData.education} 
        />

        {/* Leadership & Personal Interests */}
        <Extracurriculars 
          extracurriculars={portfolioData.extracurriculars} 
        />
      </main>

      <Footer socials={portfolioData.socials} />

      {/* Resume Viewer Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        pdfUrl={portfolioData.personal.resumePdfUrl}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="toast-notice" role="alert">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
