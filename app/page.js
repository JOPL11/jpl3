'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const PrivacyModal = dynamic(() => import('../components/PrivacyModal'), {
  ssr: false,
});
import styles from "./page.module.css";
import PrivacyStyles from '../components/PrivacyModal.module.css';
const ImpressumModal = dynamic(() => import('../components/ImpressumModal'), {
  ssr: false,
});
import ProjectCard from './components/ProjectCard';
import VideoProjectCard from './components/VideoProjectCard';
import ContactForm from './components/ContactForm';

function CopyrightYear() {
  const [year] = useState(new Date().getFullYear());
  return <>{year}</>;
}

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);
  const [modalContent, setModalContent] = useState('privacy');

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <div className={styles.logoSidebar} role="complementary" aria-label="Logo and Navigation">
            <div>
              <Image 
                src="/images/jp.svg" 
                alt="" 
                width={380}
                height={380}
                className={styles.contentLogo}
                priority
                aria-hidden="true"
              />
              <hr className={styles.divider} />
              <nav className={styles.navLinks} aria-label="Main navigation">
                <a 
                  href="#welcome-heading" 
                  className={styles.navLink} 
                  onClick={(e) => scrollToSection(e, 'welcome-heading')}
                >
                  About
                </a>
                <a 
                  href="#projects-heading" 
                  className={styles.navLink}
                  onClick={(e) => scrollToSection(e, 'projects-heading')}
                >
                  Code
                </a>
                <a 
                  href="#webgl-heading" 
                  className={styles.navLink}
                  onClick={(e) => scrollToSection(e, 'webgl-heading')}
                >
                  WebGL
                </a>
                <a 
                  href="#motion-heading" 
                  className={styles.navLink}
                  onClick={(e) => scrollToSection(e, 'motion-heading')}
                >
                  Motion
                </a>
                <a 
                  href="#contact" 
                  className={styles.navLink}
                  onClick={(e) => scrollToSection(e, 'contact')}
                >
                  Contact
                </a>


 
              </nav>
              <hr className={styles.divider} />
              {/*<div className={styles.profileImageContainer}>
                <Image 
               src="/images/me3.jpg"
                  alt="Jan Peiro" 
                  width={200}
                  height={200}
                  className={styles.profileImage}
                  priority
                />
              </div> */}  
            </div>
          </div>
          <section className={styles.content} aria-labelledby="welcome-heading">
            <h2 id="welcome-heading">About</h2>
            <p>Hi! My name is Jan.</p>

            <p>Passionate about code, 
            design & animation. </p>

            <p>15 years experience spans clients in the 
            entertainment, automotive, software and 
            aerospace industries - such as Airbus Group, 
            Spiegel TV, Red Bull Austria, BMW Group, Audi, NATO, 
            Pro7, Warner Brothers, and many others.</p>

            <p>Throughout this time I&apos;ve worked freelance and employed 
            in capacities ranging from visual concept artist, designer, 
            art director, creative developer & motion designer.</p>
           
            <p>I build immersive interfaces merging design, animation, and bulletproof code.</p>
            <hr className={styles.divider} />
            <section className={styles.section} aria-labelledby="skills-heading">
              <h2 id="skills-heading">Technical Skills</h2>
              <ul className={styles.skillsList} role="list">
                <li role="listitem">React, Next.js</li>
                <li role="listitem">Three.js, React 3 Fiber, WebXR</li>
                <li role="listitem">vite, git, npm</li>
                <li role="listitem">SQL / Supabase</li>
                <li role="listitem">GSAP Animation Engine, Framer Motion, css animations, Spring</li>
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
 
            </div>
            <hr className={styles.divider} />
            <section id="work" className={styles.section} aria-labelledby="projects-heading">
              <h2 id="projects-heading">Code</h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Projects">
                  {/*   */}   <ProjectCard 
                  title="Stadtberichter Info Page"
                  image="/images/corp/sb.jpg"
                  alt="Stadtberichter Info Page"
                  text="A GDPR-compliant info page for a civics oriented app."
                  link="https://sb-info.vercel.app/"
                >
                  <p><strong>Target Audience:</strong> Municipal Authorities</p>
                  <p><strong>Project Type:</strong> Infopage about an Application</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 4 days</p>
                </ProjectCard>
                <ProjectCard 
                  title="Stadtberichter App"
                  image="/images/corp/sb.jpg"
                  alt="Stadtberichter App"
                  link="https://sb-whole.vercel.app/"
                  text="Currently in development. A GDPR-compliant civics oriented app with encrypted geodata, voice-to-text, i18n language versioning, rate-limiting and other security features feeding into a real-time municipal dashboard"
                >
                  <p><strong>Target Audience:</strong> Municipal Citizens</p>
                  <p><strong>Project Type:</strong> Citizen Reporting App</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 3 Months</p>
                </ProjectCard>
             <ProjectCard 
                  title="Berlin Showroom Expo Interface"
                  image="/images/corp/airbus.jpg"
                  alt="Berlin Showroom Expo piece"
                  client={{
                    name: "SMMD Team  |",
                    logo: "/images/agencies/SMMD.png",
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
                  title="Ottobrunn Showroom Expo Interface"
                  image="/images/corp/airbus.jpg"
                  alt="Ottobrunn Showroom Expo piece"
                  client={{
                    name: "SMMD Team |",
                    logo: "/images/agencies/SMMD.png",
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
                  title="Spiegel Geschichte TV Website"
                 image="/images/corp/spg.jpg"
                  alt="Spiegel Geschichte TV Website"
                  text="<b>Legacy Project:</b> Official Website for the Pay TV channel Spiegel Geschichte TV"
                  client={{
                    name: "Autentic GmbH |",
                    website: "https://www.autentic.com/"
                  }}
                  modalContent={{
                    description: `Logo, CI/CD, UI/UX of a health app for homeopathy.`,
                    images: [
                      { src: "/images/SGA_1.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/SGA_2.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/SGA_3.jpg", alt: "Project Screenshot 3" },
                    ]
                  }}
                >
                  <p>Conceptual UI/UX</p>
                  <p><strong>Target Audience:</strong> Spiegel Geschichte TV Viewers</p>
                  <p><strong>Role:</strong> Lead Designer / Coder</p>
                  <p><strong>Duration:</strong> 1 Month / 6 years of updates</p>
                </ProjectCard> 
                
                 <ProjectCard 
                  title="Middle Caicos Festival"
                  image="/images/JPL3Poster_BB.jpg"
                  alt="Middle Caicos Festival"
                  link="https://newest-ulf.vercel.app/"
                  text="A mobile app for the PFP Caribbean Festival"
                >
                  <p>Conceptual UI/UX</p>
                  <p><strong>Target Audience:</strong> Caribbean Festival Attendees</p>
                  <p><strong>Project Type:</strong> Simple Next.js/React/R3F website</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 4 Days</p>
                </ProjectCard>
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
              <h2 id="webgl-heading">WebGL</h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
              <ProjectCard 
                  title="Bytes101"
                  image="/images/bytes101.jpg"
                  alt="Bytes101"
                  link="https://bytes101.vercel.app"
                  text="Featuring custom 3D models and animations."
                >
                  <p>Technical Demo</p>
                  <p><strong>Project Type:</strong> React Three Fiber</p>
                  <p><strong>Role:</strong> Concept / Animation / Development</p>
                  <p><strong>Duration:</strong> 1 week</p>
                  </ProjectCard>
              <ProjectCard 
                  title="Schrödinger & Bohr Quantum Pocketwatches "
                  image="/images/JPL3Poster_QC.jpg"
                  alt="Quantum Pocketwatch Company"
                  link="https://quantum-pocketwatch.vercel.app/"
                  text="<strong>Desktop Only</strong>. Featuring custom 3D models and interactions." 
                >
                  <p>Conceptual UI/UX</p>
                  <p><strong>Project Type:</strong>React Three Fiber</p>
                  <p><strong>Role:</strong> Concept / Animation / Developer</p>
                  <p><strong>Duration:</strong> 2 weeks</p>
                </ProjectCard>
                <ProjectCard 
                  title="Blade Runner 2033"
                  image="/images/JPL3Poster_R3F.jpg"
                  alt="Blade Runner 2033"
                  link="https://jpl3d2.vercel.app"
                  text="Featuring custom 3D models and animations."
                >
                  <p>Technical Demo</p>
                  <p><strong>Project Type:</strong> React Three Fiber</p>
                  <p><strong>Role:</strong> Concept / Animation / Development</p>
                  <p><strong>Duration:</strong> 3 weeks</p>
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
                <ProjectCard 
                  title="Audi Nüremberg"
                  image="/images/corp/audi.jpg"
                  alt="Audi Nüremberg"
                  text="Cinemascreen sized animation for a VIP Event"
                  client={{
                    name: "Planstand Agency  |",
                    website: "https://www.planstand.com/",
                    logo: "/images/agencies/planstand_logo.png"
                  }}
                  modalContent={{
                    description: `10 Minute long foreground / backdrop screen animation for VIP event, tailored to a stage setup featuring live dancers and a hi-tech sprinkler installation that could depict the Audi logo and more.
                    <p>Animated excerpts can be seen in the motion reel</p>`,
                    images: [
                      { src: "/images/audi_1.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/audi_2.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/audi_3.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/audi_4.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/audi_5.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/audi_6.jpg", alt: "Project Screenshot 8" },
                    ]
                  }}
                >
                  <p>Animation Event</p>
                  <p><strong>Target Audience:</strong> Showroom visitors</p>
                  <p><strong>Project Type:</strong> After Effects / Cinema4D</p>
                  <p><strong>Role:</strong> Lead Designer / animator</p>
                  <p><strong>Duration:</strong> 2 Months</p>
                </ProjectCard>
                <ProjectCard 
                  title="Mercedes Benz Animation"
                  image="/images/corp/mercedes.jpg"
                  alt="Mercedes Benz Animation"
                  text="Logo animation for Mercedes Benz"
                  client={{
                    name: "Sieber & Wolf Werbeagentur  |",
                    website: "https://sieberundwolf.de/",
                    logo: "/images/agencies/SW_white.png"
                  }}
                  modalContent={{
                    description: `Logo animation for Mercedes Benz.

                    <p>Animated excerpts can be seen in the motion reel</p>`,
                    images: [
                      { src: "/images/mercedes0.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/mercedes1.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/mercedes2.jpg", alt: "Project Screenshot 2" },
                    ]
                  }}
                >
                  <p>Logo Animation</p>
                  <p><strong>Project Type:</strong> After Effects / Cinema4D</p>
                  <p><strong>Role:</strong> Lead Designer / animator</p>
                  <p><strong>Duration:</strong> 2 weeks</p>
                </ProjectCard>
                <ProjectCard 
                  title="Airbus Group"
                  image="/images/corp/airbus.jpg"
                  alt="Audi Nüremberg"
                  text="Multimonitor animation for the Airbus Showroom Ottobrunn"
                  client={{
                    name: "SMMD Team |",
                    logo: "/images/agencies/SMMD.png",
                    website: "https://www.smmd.team/",
                    
                  }}
                  modalContent={{
                    description: `Multimonitor animation for the <strong>Airbus Showroom Ottobrunn</strong>.
  
                   <p>Animated excerpts can be seen in the motion reel</p>`,
                    images: [
                      { src: "/images/airbus_ottobrunn/video/1C.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/airbus_ottobrunn/video/1.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/airbus_ottobrunn/video/2.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/airbus_ottobrunn/video/3.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/airbus_ottobrunn/video/6.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/airbus_ottobrunn/video/8.jpg", alt: "Project Screenshot 8" },
                    ]
                  }}
                >
                  <p>Multi Monitor Animation</p>
                  <p><strong>Target Audience:</strong> Showroom visitors</p>
                  <p><strong>Project Type:</strong> After Effects / Cinema4D</p>
                  <p><strong>Role:</strong> Lead Designer / animator</p>
                  <p><strong>Duration:</strong> 2 weeks</p>
                </ProjectCard>
          
              </div>
            </section> 
            {/*    */}  
            <hr className={styles.divider} />
            <section id="contact">
              <h2>Contact</h2>
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
          <span aria-hidden="true">  </span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setShowImpressumModal(true);
            }} 
            className={styles.footerLink} 
            aria-label="Impressum"
            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', color: 'inherit' }}
          >
            Impressum
          </button>
        </div>
        <PrivacyModal 
          isOpen={showPrivacyModal} 
          onClose={() => setShowPrivacyModal(false)}
          type={modalContent}
        />
        <ImpressumModal 
          isOpen={showImpressumModal} 
          onClose={() => setShowImpressumModal(false)}
        />
      </footer>
    </div>
  );
}
