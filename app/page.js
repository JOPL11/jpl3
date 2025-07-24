'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const PrivacyModal = dynamic(() => import('../components/PrivacyModal'), {
  ssr: false,
});
import styles from "./page.module.css";
import ProjectCard from './components/ProjectCard';
import VideoProjectCard from './components/VideoProjectCard';
import ContactForm from './components/ContactForm';

function CopyrightYear() {
  const [year] = useState(new Date().getFullYear());
  return <>{year}</>;
}

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [modalContent, setModalContent] = useState('privacy');

  const openModal = (type) => {
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Set modal content and show modal
    setModalContent(type);
    setShowPrivacyModal(true);
    
    // Prevent default anchor behavior
    return false;
  };

  useEffect(() => {
    const handleOpenPrivacyModal = () => {
      openModal('privacy');
    };

    window.addEventListener('openPrivacyModal', handleOpenPrivacyModal);
    
    return () => {
      window.removeEventListener('openPrivacyModal', handleOpenPrivacyModal);
    };
  }, []);

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
            <p>My name is Jan Peiro.</p>

            <p>I studied communication design in 
            Munich Germany.</p>

            <p>Passionate about code, 
            design & animation. </p>

            <p>20 years experience spans clients in the 
            entertainment, automotive, software and 
            aerospace industries - such as Airbus Group, 
            Spiegel TV, Red Bull Austria, BMW Group, Audi, NATO, 
            Pro7, Warner Brothers, and many others.</p>

            <p>Throughout that time I&apos;ve worked freelance and employed 
            in capacities ranging from visual concept artist, designer, 
            art director, creative developer & motion designer.</p>
           
            <p>I build immersive interfaces and video content for corporations and governments — merging design, animation, and bulletproof code.</p>
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
            <div className={styles.languagesContainer}>
              <section className={styles.section} aria-labelledby="languages-heading">
                <h2 id="languages-heading">Languages</h2>
                <ul className={styles.skillsList} role="list">
                  <li role="listitem">English (native)</li>
                  <li role="listitem">German (native)</li>
                  <li role="listitem">Spanish (fluent)</li>
                  <li role="listitem">French (fluent)</li>
                </ul>
              </section>
              <div className={styles.profileImageContainer}>
              {/*  <Image 
               src="/images/me3.jpg"
                  alt="Jan Peiro" 
                  width={200}
                  height={200}
                  className={styles.profileImage}
                  priority
                />*/}
              </div>
            </div>
            <hr className={styles.divider} />
            <section id="work" className={styles.section} aria-labelledby="projects-heading">
              <h2 id="projects-heading">Selected Projects</h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Projects">
              <ProjectCard 
                  title="Airbus Group Berlin Showroom Expo Interface"
                  image="/images/JPL3Poster_AB.jpg"
                  alt="Airbus Group Berlin Showroom Expo piece"
                  client={{
                    name: "SMMD Munich",
                    website: "https://www.smmd.team"
                  }}
                  modalContent={{
                    description: `Touchtable interface / 7680 x 1080 // Dynamic Content / 4 Chapters`,
                    images: [
                      { src: "/images/airbus_berlin/table2.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/airbus_berlin/table1.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/airbus_berlin/table3.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/airbus_berlin/table4.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/airbus_berlin/table6.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/airbus_berlin/table7.jpg", alt: "Project Screenshot 7" },
                      { src: "/images/airbus_berlin/table8.jpg", alt: "Project Screenshot 8" },
                      { src: "/images/airbus_berlin/table9.jpg", alt: "Project Screenshot 9" },
                      { src: "/images/airbus_berlin/table10.jpg", alt: "Project Screenshot 10" }
                    ]
                  }}>
                  <p>An interactive catalogue of Airbus technology and the company&apos;s history made for visiting foreign state officials and clients.</p>
                  <p><strong>Target Audience:</strong> Visitors at Airbus Group Berlin Showroom, Berlin</p>
                  <p><strong>Project Type:</strong> Touchtable Interface</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 3 months and years of updates</p>
                  
                </ProjectCard>
                <ProjectCard 
                  title="Airbus Group Ottobrunn Showroom Expo Interface"
                  image="/images/JPL3Poster_AB3.jpg"
                  alt="Airbus Group Ottobrunn Showroom Expo piece"
                  client={{
                    name: "SMMD Munich",
                    website: "https://www.smmd.team"
                  }}
                  modalContent={{
                    description: `15 Chapters // RFID Powered Touchscreen Interface // 3D Models`,
                    images: [
                      { src: "/images/airbus_ottobrunn/bgbg.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/airbus_ottobrunn/posterC.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/airbus_ottobrunn/airbus_14B.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/airbus_ottobrunn/airbus_18B.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/airbus_ottobrunn/airbus_21B.jpg", alt: "Project Screenshot 5" },
                    ]
                  }}
                >
                  <p>A physically interactive showcase of Airbus technology explained on interactive touchscreens</p>
                  <p><strong>Target Audience:</strong> Visitors at Airbus Group Ottobrunn Showroom, Ottobrunn</p>
                  <p><strong>Project Type:</strong> RFID Driven Interactive Experience</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 3 months and years of updates</p>
                </ProjectCard>
                <ProjectCard 
                  title="Stadtberichter Info Page"
                  image="/images/JPL3Poster_SB.jpg"
                  alt="Stadtberichter Info Page"
                  text="A GDPR-compliant info page for a civics oriented app."
                  link="#"
                >
                  <p><strong>Target Audience:</strong> Municipal Authorities</p>
                  <p><strong>Project Type:</strong> Infopage about an Application</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 4 days</p>
                </ProjectCard>
                <ProjectCard 
                  title="Stadtberichter App"
                  image="/images/JPL3Poster_SB2.jpg"
                  alt="Stadtberichter App"
                  link="#"
                  text="A GDPR-compliant civics oriented app with encrypted geodata, rate-limiting and other security features feeding into a real-time municipal dashboard — reducing incident response time by 30%"
                >
                  <p><strong>Target Audience:</strong> Municipal Citizens</p>
                  <p><strong>Project Type:</strong> Citizen Reporting App</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 2 Months</p>
                </ProjectCard>
                <ProjectCard 
                  title="PFP Caribbean Festival"
                  image="/images/JPL3Poster_BB.jpg"
                  alt="PFP Caribbean Festival"
                  link="https://newest-ulf.vercel.app/"
                  text="A mobile app for the PFP Caribbean Festival"
                >
                  <p>Conceptual UI/UX</p>
                  <p><strong>Target Audience:</strong> Caribbean Party People</p>
                  <p><strong>Project Type:</strong> Simple Next.js/React/R3F website</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 4 Days</p>
                </ProjectCard>
            {/*     <ProjectCard 
                  title="Spiegel Geschichte TV Website"
                  image="/images/JPL3Poster_SG.jpg"
                  alt="Spiegel Geschichte TV Website"
                  link="#"
                  client={{
                    name: "Autentic GmbH",
                    website: "https://www.autentic.com/"
                  }}
                >
                  <p>Conceptual UI/UX</p>
                  <p><strong>Target Audience:</strong> Spiegel Geschichte TV Viewers</p>
                  <p><strong>Role:</strong> Lead Designer / Coder</p>
                  <p><strong>Duration:</strong> 1 Month</p>
                </ProjectCard> */}
                <ProjectCard 
                  title="Homeopathy Health App Design"
                  image="/images/JPL3Poster_HA2.jpg"
                  alt="Homeopathy Health App Design"
                  text="Logo, CI/CD, UI/UX of a health app for homeopathy."
                  client={{
                    name: "Uniqued",
                    website: "https://www.uniqued.de/"
                  }}
                  modalContent={{
                    description: `Logo, CI/CD, UI/UX of a health app for homeopathy.`,
                    images: [
                      { src: "/images/JPL3Poster_HA0.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/JPL3Poster_HA3.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/JPL3Poster_HA4.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/JPL3Poster_HA6.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/JPL3Poster_HA7.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/JPL3Poster_HA9.jpg", alt: "Project Screenshot 8" },
                      { src: "/images/JPL3Poster_HA5B.jpg", alt: "Project Screenshot 5" },
                      { src: "/images/JPL3Poster_HA10.jpg", alt: "Project Screenshot 9" },
                      { src: "/images/JPL3Poster_HA11.jpg", alt: "Project Screenshot 10" },
                      { src: "/images/JPL3Poster_HA12.jpg", alt: "Project Screenshot 11" },
                      { src: "/images/JPL3Poster_HA13.jpg", alt: "Project Screenshot 12" },
                    ]
                  }}
                >
                  <p>Conceptual UI/UX Design</p>
                  <p><strong>Target Audience:</strong> Health App Users</p>
                  <p><strong>Project Type:</strong> Next.js / React Interface Design</p>
                  <p><strong>Role:</strong> Lead Designer</p>
                  <p><strong>Duration:</strong> 1.5 weeks</p>
                </ProjectCard>
              </div>
            </section>
            <hr className={styles.divider} />
            <section className={styles.section}>
              <h2 id="showcase-heading">Showcase</h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
              <ProjectCard 
                  title="Schrödinger & Bohr Quantum Pocketwatches "
                  image="/images/JPL3Poster_QC.jpg"
                  alt="Homeopathy Health App Design"
                  link="https://quantum-pocketwatch.vercel.app/"
                  text="Featuring custom 3D models and interactions. Desktop Only."
                >
                  <p>Conceptual UI/UX</p>
                  <p><strong>Target Audience:</strong> Genius-level freaks</p>
                  <p><strong>Project Type:</strong> React Three Fiber</p>
                  <p><strong>Role:</strong> Concept / Animation / Developer</p>
                  <p><strong>Duration:</strong> 2 weeks</p>
                </ProjectCard>
                
    
              </div>

            </section>
            <hr className={styles.divider} />
            <section className={styles.section}>
              <h2 id="motion-heading">Motion</h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
                
              <VideoProjectCard 
                  title="Showreel 2025"
                  image="/images/JPL3Poster.jpg"
                  alt="Showreel 2025"
                  videoUrl="https://vimeo.com/1103891139"
                  text="2D / 3D Motion Reel featuring Commercial and Personal Work "
                >
                  <p>Concept, 3D Modeling, Animation, VFX, Design, Post-Production</p>
                  <p>Cinema4D, After Effects, Duik Tools, Bodymovin, Red Giant, Element3D, Stardust, Corona, Octane, Redshift, Media Encoder</p>
                  <p><strong>Role:</strong>Concept / Animation / Post-Production</p>
                  <p>3D Video Production for end-clients such as Airbus Group, MTU Aero Engines, Mercedes Benz, Audi, TÜV Süd, and more.</p>
                </VideoProjectCard>
              </div>
            </section>
            <hr className={styles.divider} />
            <section id="contact">
              <h2>Contact</h2>
              <a href="mailto:jan.peiro@protonmail.com">jan.peiro@protonmail.com</a>
              <ContactForm />
            </section>
          </section>

        
        </div>
      </main>
      <footer className={styles.footer} role="contentinfo">

        <div className={styles.footerLinks} role="navigation" aria-label="Footer">
          <p>&copy; <CopyrightYear /> Jan Peiro. All rights reserved.</p>
          <button 
            onClick={() => openModal('privacy')} 
            className={styles.footerLink} 
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </button>
          <span aria-hidden="true">  </span>
          <button 
            onClick={() => openModal('tos')} 
            className={styles.footerLink} 
            aria-label="Terms of Service"
          >
            Terms of Service
          </button>
          <span aria-hidden="true">  </span>
          <a href="#contact" className={styles.footerLink} aria-label="Contact">
            Contact
          </a>
        </div>
        <PrivacyModal 
          isOpen={showPrivacyModal} 
          onClose={() => setShowPrivacyModal(false)}
          type={modalContent}
        />
      </footer>
    </div>
  );
}
