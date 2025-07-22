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
            <h2 id="welcome-heading">Welcome to my Website</h2>
            <p>Hello, my name is Jan Peiro.</p>

            <p>I studied communication design in 
            Munich Germany.</p>

            <p> I am passionate about code, 
            visualization & animation. </p>

            <p>20 years experience spans clients in the 
            entertainment, automotive, software and 
            aerospace industries,such as Airbus Group, 
            Spiegel TV, BMW Group, Audi, NATO, 
            Pro7, and many others.</p>

            <p>Throughout this time I have worked freelance and employed 
            in capacities ranging from visual concept artist, designer, 
            art director, creative developer & motion designer.</p> 

            <section id="work" className={styles.section} aria-labelledby="projects-heading">
              <h2 id="projects-heading">Selected Projects</h2>
          <p>More coming soon</p>
          <div className={styles.projectsGrid} role="grid" aria-label="Projects">
            {/* Add your project cards here */}
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Stadtberichter</h3>
              <p>Next.js/React</p>
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>PFP Festival</h3>
              <p>Next.js</p>
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Hoyieo Health</h3>
              <p>Conceptual UI/UX</p>
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Airbus Group Headquarters Berlin Touchtable</h3>
              <p>Conceptual UI/UX</p>
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Airbus Group Ottobrunn Showroom Expo piece</h3>
              <p>Conceptual UI/UX</p>
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Spiegel TV</h3>
              <p>Conceptual UI/UX</p>
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>RedBull Austria</h3>
              <p>Intranet Project</p>
            </div>
          </div>
        </section>
        <section className={styles.section} aria-labelledby="skills-heading">
            <h2 id="skills-heading">Technical Skills</h2>
            <ul className={styles.skillsList} role="list">
              <li role="listitem">React, Next.js</li>
              <li role="listitem">Three.js, React 3 Fiber</li>
              <li role="listitem">GSAP Animation</li>
              <li role="listitem">Cinema4D, Blender</li>
              <li role="listitem">Octane, Redshift, Corona Render Engines</li>
              <li role="listitem">After Effects</li>
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="languages-heading">
            <h2 id="languages-heading">Languages</h2>
            <ul className={styles.skillsList} role="list">
              <li role="listitem">English</li>
              <li role="listitem">German</li>
              <li role="listitem">Spanish</li>
              <li role="listitem">French</li>
            </ul>
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
