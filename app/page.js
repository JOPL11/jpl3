'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from "./page.module.css";

function CopyrightYear() {
  const [year, setYear] = useState('');
  
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  
  return <>{year}</>;
}

function ProjectCard({ title, children, image, alt, link }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`${styles.projectCard} ${isExpanded ? styles.expanded : ''}`} role="gridcell" tabIndex="0">
      <h3>{title}</h3>
      <div className={`${styles.cardContent} ${isExpanded ? styles.showContent : ''}`}>
        {children}
      </div>
      <div className={styles.projectImage}>
        <Image 
          src={image} 
          alt={alt}
          width={800}
          height={600}
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          priority
        />
      </div>
      <div className={styles.cardActions}>
        <button 
          className={styles.moreButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.projectLink}
          >
            View Project
          </a>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.container} role="document">
      <header role="banner" className={styles.header}>
        {/* Header content would go here */}
      </header>
      <main className={styles.main} role="main" id="main-content">
        <div className={styles.contentWrapper}>
          <div className={styles.logoSidebar} role="complementary" aria-label="Logo">
            <Image 
              src="/images/jp.svg" 
              alt="" 
              width={380}
              height={380}
              className={styles.contentLogo}
              priority
              aria-hidden="true"
            />
          </div>
          <section className={styles.content} aria-labelledby="welcome-heading">
            <h2 id="welcome-heading">Welcome to my Portfolio</h2>
            <p>Hello, my name is Jan Peiro.</p>

            <p>I studied communication design in 
            Munich Germany.</p>

            <p> I am passionate about code, 
            visualization & animation. </p>

            <p>20 years experience spans clients in the 
            entertainment, automotive, software and 
            aerospace industries - such as Airbus Group, 
            Spiegel TV, BMW Group, Audi, NATO, 
            Pro7, and many others.</p>

            <p>Throughout this time I have worked freelance and employed 
            in capacities ranging from visual concept artist, designer, 
            art director, creative developer & motion designer.</p>

            <p> This site is under development. In the interim, feel free to drop me a line if you have specific questions.</p>
            
            <hr className={styles.divider} />

            <section id="work" className={styles.section} aria-labelledby="projects-heading">
              <h2 id="projects-heading">Selected Projects</h2>
              <p>More coming soon</p>
              <div className={styles.projectsGrid} role="grid" aria-label="Projects">
              <ProjectCard 
                  title="Stadtberichter Info Page"
                  image="/images/JPL3Poster_SB.jpg"
                  alt="Stadtberichter Info Page"
                  link="#"
                >
                  <p>Conceptual UI/UX</p>
                  <p>Target Audience: Municipal Authorities</p>
                  <p>Project Type: Infopage about an Application</p>
                  <p>Role: Lead Designer, Lead Developer</p>
                  <p>Duration: 4 days</p>
                </ProjectCard>
                <ProjectCard 
                  title="Stadtberichter App"
                  image="/images/JPL3Poster_SB2.jpg"
                  alt="Stadtberichter App"
                  link="#"
                >
                  <p>Conceptual UI/UX</p>
                  <p>Target Audience: Municipal Citizens</p>
                  <p>Project Type: Mobile Application</p>
                  <p>Role: Lead Designer, Lead Developer</p>
                  <p>Duration: 2 Months</p>
                </ProjectCard>
              <ProjectCard 
                  title="Airbus Group Berlin Showroom Expo piece"
                  image="/images/JPL3Poster_AB.jpg"
                  alt="Airbus Group Berlin Showroom Expo piece"
                  link="#"
                >
                  <p>Conceptual UI/UX</p>
                  <p>Target Audience: Visitors at Airbus Group Berlin Showroom, Berlin</p>
                  <p>Project Type: Touchtable Interface</p>
                  <p>Role: Lead Designer, Lead Developer</p>
                  <p>Duration: 3 months</p>
                </ProjectCard>
                <ProjectCard 
                  title="Airbus Group Ottobrunn Showroom Expo piece"
                  image="/images/JPL3Poster_AB3.jpg"
                  alt="Airbus Group Ottobrunn Showroom Expo piece"
                  link="#"
                >
                  <p>Conceptual UI/UX</p>
                  <p>Target Audience: Visitors at Airbus Group Ottobrunn Showroom, Ottobrunn</p>
                  <p>Project Type: RFID Driven Interactive Experience</p>
                  <p>Role: Lead Designer, Lead Developer</p>
                  <p>Duration: 3 months</p>
                </ProjectCard>
                <ProjectCard 
                  title="PFP Festival"
                  image="/images/JPL3Poster_BB.jpg"
                  alt="PFP Carribean Festival"
                  link="#"
                >
                  <p>Conceptual UI/UX</p>
                  <p>Target Audience: Festival Attendees</p>
                  <p>Project Type: Simple Next.js/React/R3F website</p>
                  <p>Role: Lead Designer, Lead Developer</p>
                  <p>Duration: 4 Days</p>
                </ProjectCard>
                <ProjectCard 
                  title="Homeopathy Health App Design"
                  image="/images/JPL3Poster_HA2.jpg"
                  alt="Homeopathy Health App Design"
                  link="#"
                >
                  <p>Conceptual UI/UX</p>
                  <p>Target Audience: Health App Users</p>
                  <p>Project Type: Next.js / React Interface Design</p>
                  <p>Role: Lead Designer</p>
                  <p>Duration: 1.5 weeks</p>
                </ProjectCard>
              </div>
            </section>
            <hr className={styles.divider} />
            <section className={styles.section} aria-labelledby="skills-heading">
              <h2 id="skills-heading">Technical Skills</h2>
              <ul className={styles.skillsList} role="list">
                <li role="listitem">React, Next.js</li>
                <li role="listitem">Three.js, React 3 Fiber</li>
                <li role="listitem">vite, git, npm</li>
                <li role="listitem">SQL / Supabase</li>
                <li role="listitem">GSAP Animation Engine</li>
                <li role="listitem">Cinema4D, Blender</li>
                <li role="listitem">Octane, Redshift, Corona Render Engines</li>
                <li role="listitem">After Effects, Video Edit, Video Post-Production</li>
                <li role="listitem">Adobe Suite</li>
                <li role="listitem">Design, Animation, Development, Rapid Prototyping</li>
                <li role="listitem">SEO</li>
              </ul>
            </section>
            <hr className={styles.divider} />
            <section className={styles.section} aria-labelledby="languages-heading">
              <h2 id="languages-heading">Languages</h2>
              <ul className={styles.skillsList} role="list">
                <li role="listitem">English (native)</li>
                <li role="listitem">German (native)</li>
                <li role="listitem">Spanish (fluent)</li>
                <li role="listitem">French (fluent)</li>
              </ul>
            </section>
            <hr className={styles.divider} />
            <section className={styles.section}>
              <h2 id="showcase-heading">Showcase</h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
              <ProjectCard 
                  title="Schrödinger & Bohr Quantum Pocketwatches featuring custom 3D models and interactions. Desktop Only."
                  image="/images/JPL3Poster_QC.jpg"
                  alt="Homeopathy Health App Design"
                  link="https://quantum-pocketwatch.vercel.app/"
                >
                  <p>Conceptual UI/UX</p>
                  <p>Target Audience: Genius level freaks</p>
                  <p>Project Type: React Three Fiber</p>
                  <p>Role: Concept / Animation / Developer</p>
                  <p>Duration: 2 weeks</p>
                </ProjectCard>
    
              </div>

            </section>
            <section id="contact">
              <h2>Let&apos;s talk</h2>
              <a href="mailto:jan.peiro@protonmail.com">jan.peiro@protonmail.com</a>
            </section>
          </section>

        
        </div>
      </main>
      <footer className={styles.footer} role="contentinfo">
        <p>&copy; <CopyrightYear /> Jan Peiro. All rights reserved.</p>
        <div className={styles.footerLinks} role="navigation" aria-label="Footer">
          <a href="#" className={styles.footerLink} aria-label="Privacy Policy">Privacy Policy</a>
          <span aria-hidden="true"> | </span>
          <a href="#" className={styles.footerLink} aria-label="Terms of Service">Terms of Service</a>
          <span aria-hidden="true"> | </span>
          <a href="#" className={styles.footerLink} aria-label="Contact Us">Contact</a>
        </div>
      </footer>
    </div>
  );
}
