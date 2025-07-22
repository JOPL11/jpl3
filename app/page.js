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
    <div className={styles.container}>


      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.logoSidebar}>
            <Image 
              src="/images/jp.svg" 
              alt="JP Logo" 
              width={380}
              height={380}
              className={styles.contentLogo}
              priority
            />
          </div>
          <section className={styles.content}>
            <h2>Welcome to my Website</h2>
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

            <p>More on these projects coming soon.</p>

            <div>
            <section id="work" className={styles.section}>
          <h2>Selected Projects</h2>
          <p>More coming soon</p>
          <div className={styles.projectsGrid}>
            {/* Add your project cards here */}
            <div className={styles.projectCard}>
              <h3>Stadtberichter</h3>
              <p>Next.js/React</p>
            </div>
            <div className={styles.projectCard}>
              <h3>PFP Festival</h3>
              <p>Next.js</p>
            </div>
            <div className={styles.projectCard}>
              <h3>Hoyieo Health</h3>
              <p>Conceptual UI/UX</p>
            </div>
            <div className={styles.projectCard}>
              <h3>Airbus Group Headquarters Berlin Touchtable</h3>
              <p>Conceptual UI/UX</p>
            </div>
            <div className={styles.projectCard}>
              <h3>Airbus Group Ottobrunn Showroom Expo piece</h3>
              <p>Conceptual UI/UX</p>
            </div>
            <div className={styles.projectCard}>
              <h3>Spiegel TV</h3>
              <p>Conceptual UI/UX</p>
            </div>
            <div className={styles.projectCard}>
              <h3>RedBull Austria</h3>
              <p>Intranet Project</p>
            </div>
          </div>
        </section>

              <h2>Technical Skills</h2>
              <ul className={styles.skillsList}>
                <li>React, Next.js</li>
                <li>Three.js, R3F</li>
                <li>GSAP Animation</li>
                <li>Cinema4D, Blender</li>
                <li>After Effects</li>
              </ul>
            </div>
            <div>
              <h2>Languages</h2>
              <ul className={styles.skillsList}>
                <li>English</li>
                <li>German</li>
                <li>Spanish</li>
                <li>French</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; <CopyrightYear /> Jan Peiro. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Privacy Policy</a>
          <span> | </span>
          <a href="#" className={styles.footerLink}>Terms of Service</a>
          <span> | </span>
          <a href="#" className={styles.footerLink}>Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
