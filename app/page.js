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
            
            <hr className={styles.divider} />

            <section id="work" className={styles.section} aria-labelledby="projects-heading">
              <h2 id="projects-heading">Selected Projects</h2>
          <p>More coming soon</p>
          <div className={styles.projectsGrid} role="grid" aria-label="Projects">
            {/* Add your project cards here */}
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Stadtberichter</h3>
              <p>Next.js/React</p>
              <div className={styles.projectImage}>
                <Image 
                  src="/images/JPL3Poster_SB.jpg" 
                  alt="Stadtberichter project screenshot" 
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
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>PFP Festival</h3>
              <p>Next.js</p>
              <div className={styles.projectImage}>
                <Image 
                  src="/images/JPL3Poster_BB.jpg" 
                  alt="Stadtberichter project screenshot" 
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
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Hoyieo Health</h3>
              <p>Conceptual UI/UX App Design</p>
              <div className={styles.projectImage}>
                <Image 
                  src="/images/JPL3Poster_HA2.jpg" 
                  alt="Stadtberichter project screenshot" 
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
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Airbus Group Headquarters Berlin Touchtable</h3>
              <p>Conceptual UI/UX</p>
              <div className={styles.projectImage}>
                <Image 
                  src="/images/JPL3Poster_AB.jpg" 
                  alt="Stadtberichter project screenshot" 
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
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Airbus Group Ottobrunn Showroom Expo piece</h3>
              <p>Conceptual UI/UX</p>
              <div className={styles.projectImage}>
                <Image 
                  src="/images/JPL3Poster_AB3.jpg" 
                  alt="Stadtberichter project screenshot" 
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
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Spiegel TV Geschichte</h3>
              <p>Conceptual UI/UX</p>
              <div className={styles.projectImage}>
                <Image 
                  src="/images/JPL3Poster_SG.jpg" 
                  alt="Stadtberichter project screenshot" 
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
            </div>
            <div className={styles.projectCard} role="gridcell" tabIndex="0">
              <h3>Spiegel TV Wissen</h3>
              <p>Intranet Project</p>
              <div className={styles.projectImage}>
                <Image 
                  src="/images/JPL3Poster_SW.jpg" 
                  alt="Stadtberichter project screenshot" 
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
            </div>
          </div>
        </section>
        <hr className={styles.divider} />
        <section className={styles.section} aria-labelledby="skills-heading">
            <h2 id="skills-heading">Technical Skills</h2>
            <ul className={styles.skillsList} role="list">
              <li role="listitem">React, Next.js</li>
              <li role="listitem">Three.js, React 3 Fiber</li>
              <li role="listitem">vite, git, npm</li>
              <li role="listitem">GSAP Animation</li>
              <li role="listitem">Cinema4D, Blender</li>
              <li role="listitem">Octane, Redshift, Corona Render Engines</li>
              <li role="listitem">After Effects</li>
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
              <div className={styles.projectCard} role="gridcell" tabIndex="0">
                <h3>React Three Fiber / GSAP</h3>
                <a 
                  href="https://jpl3d2.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.showcaseLink}
                  aria-label="View React Three Fiber / GSAP project"
                >
                  View Project
                
                <div className={styles.projectImage}>
                  <Image 
                    src="/images/JPL3Poster_R3F.jpg" 
                    alt="React Three Fiber project visualization" 
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
                </a>
              </div>
              
              <div className={styles.projectCard} role="gridcell" tabIndex="0">
                <h3>Pure Three.js / GSAP</h3>
                <p>Coming soon</p>
              </div>
            </div>

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
