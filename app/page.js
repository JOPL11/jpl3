'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from "./page.module.css";
import ProjectCard from './components/ProjectCard';
import ContactForm from './components/ContactForm';

function CopyrightYear() {
  const [year] = useState(new Date().getFullYear());
  return <>{year}</>;
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

            <p>Passionate about code, 
            visualization & animation. </p>

            <p>20 years experience spans clients in the 
            entertainment, automotive, software and 
            aerospace industries - such as Airbus Group, 
            Spiegel TV, BMW Group, Audi, NATO, 
            Pro7, and many others.</p>

            <p>Throughout this time I&apos;ve worked freelance and employed 
            in capacities ranging from visual concept artist, designer, 
            art director, creative developer & motion designer.</p>

            <p>This site is under development. In the interim, feel free to drop me a line if you have specific questions.</p>
            
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
                
                  modalContent={{
                    description: `Touchtable interface`,
                    images: [
                      { src: "/images/airbus_berlin/table2.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/airbus_berlin/table1.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/airbus_berlin/table3.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/airbus_berlin/table4.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/airbus_berlin/table5.png", alt: "Project Screenshot 5" },
                      { src: "/images/airbus_berlin/table6.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/airbus_berlin/table7.jpg", alt: "Project Screenshot 7" },
                      { src: "/images/airbus_berlin/table8.jpg", alt: "Project Screenshot 8" },
                      { src: "/images/airbus_berlin/table9.jpg", alt: "Project Screenshot 9" },
                      { src: "/images/airbus_berlin/table10.jpg", alt: "Project Screenshot 10" }
                    ]
                  }}>
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
                  title="Spiegel Geschichte TV Website"
                  image="/images/JPL3Poster_SG.jpg"
                  alt="Spiegel Geschichte TV Website"
                  link="#"
                >
                  <p>Conceptual UI/UX</p>
                  <p>Target Audience: Spiegel Geschichte TV Viewers</p>
                  <p>Role: Lead Designer / Coder</p>
                  <p>Duration: 1 Month</p>
                </ProjectCard>
                <ProjectCard 
                  title="Homeopathy Health App Design"
                  image="/images/JPL3Poster_HA2.jpg"
                  alt="Homeopathy Health App Design"
    
                  modalContent={{
                    description: `Logo, CI/CD, UI/UX, and development of a health app for homeopathy.`,
                    images: [
                      { src: "/images/JPL3Poster_HA0.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/JPL3Poster_HA3.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/JPL3Poster_HA4.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/JPL3Poster_HA6.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/JPL3Poster_HA5.jpg", alt: "Project Screenshot 5" },
                      { src: "/images/JPL3Poster_HA7.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/JPL3Poster_HA8.jpg", alt: "Project Screenshot 7" },
                      { src: "/images/JPL3Poster_HA9.jpg", alt: "Project Screenshot 8" },
                      { src: "/images/JPL3Poster_HA10.jpg", alt: "Project Screenshot 9" },
                      { src: "/images/JPL3Poster_HA11.jpg", alt: "Project Screenshot 10" },
                      { src: "/images/JPL3Poster_HA12.jpg", alt: "Project Screenshot 11" },
                      { src: "/images/JPL3Poster_HA13.jpg", alt: "Project Screenshot 12" },
                    ]
                  }}
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
            <hr className={styles.divider} />
            <section id="contact">
              <h2>Let&apos;s talk</h2>
              <a href="mailto:jan.peiro@protonmail.com">jan.peiro@protonmail.com</a>
              <ContactForm />
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
