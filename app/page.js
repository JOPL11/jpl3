'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
//import InteractiveMenu from './components/InteractiveMenu';
import SectionTracker from './components/SectionTracker';
import MouseGradient from './components/MouseGradient';

function useViewportWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Set initial width
    setWidth(window.innerWidth);
    
    // Update width on resize
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

const PrivacyModal = dynamic(() => import('../components/PrivacyModal'), {
  ssr: false,
});
import styles from "./css/page.module.css";
import PrivacyStyles from './css/PrivacyModal.module.css';
const ImpressumModal = dynamic(() => import('../components/ImpressumModal'), {
  ssr: false,
});
import ProjectCard from './components/ProjectCard';
import VideoProjectCard from './components/VideoProjectCard';
import ContactForm from './components/ContactForm';

// Dynamically import the 3D hero with SSR disabled
const Hero3D = dynamic(() => import('./components/Hero3D'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '60vh', background: '#000' }} />
});

function CopyrightYear() {
  const [year] = useState(new Date().getFullYear());
  return <>{year}</>;
}

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);
  const [modalContent, setModalContent] = useState('privacy');
  const [activeSection, setActiveSection] = useState('welcome-heading');
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth < 768;
  // Setup section detection using IntersectionObserver
  useEffect(() => {
    const handleScrollEnd = () => {
      isProgrammaticScroll.current = false;
    };

    window.addEventListener('scrollend', handleScrollEnd);
    
    // Track which section is currently most visible
    const updateActiveSection = (entries) => {
      if (isProgrammaticScroll.current) return;
      
      // Find the most visible section
      let mostVisible = { ratio: 0, id: null };
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const intersectionRatio = entry.intersectionRatio;
          console.log('Intersection observed:', entry.target.dataset.section, 'ratio:', intersectionRatio);
          
          if (intersectionRatio > mostVisible.ratio) {
            mostVisible = {
              ratio: intersectionRatio,
              id: entry.target.dataset.section
            };
          }
        }
      });
      
      // Update active section if we found a visible section
      if (mostVisible.id) {
        console.log('Most visible section:', mostVisible.id, 'with ratio:', mostVisible.ratio);
        setActiveSection(mostVisible.id);
      }
    };
    
    // Create observer with multiple thresholds for better detection
    const observer = new IntersectionObserver(updateActiveSection, {
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      rootMargin: '0px 0px -50% 0px'  // Consider an element "in view" when it's within the top 50% of the viewport
    });
    
    // Add observer to all section detectors with a small delay to ensure DOM is ready
    const setupObserver = () => {
      const detectors = document.querySelectorAll('[data-section]');
      console.log('Found section detectors:', detectors.length);
      
      if (detectors.length === 0) {
        console.warn('No section detectors found! Looking for elements with data-section attribute');
        return;
      }
      
      detectors.forEach(detector => {
        console.log('Observing section:', detector.dataset.section);
        observer.observe(detector);
      });
    };
    
    // Small delay to ensure all elements are rendered
    const timer = setTimeout(setupObserver, 500);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scrollend', handleScrollEnd);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      isProgrammaticScroll.current = true;
      
      // Update active section immediately
      setActiveSection(sectionId);
      
      // Scroll to the element
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Fallback in case scrollend event doesn't fire
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
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
    
    // Intersection Observer for section detection
    const sections = ['welcome-heading', 'projects-heading', 'webgl-heading', 'motion-heading'];
    const observers = [];

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    // Cleanup any existing detectors
    document.querySelectorAll('.section-detector').forEach(el => el.remove());
    
    return () => {
      window.removeEventListener('openPrivacyModal', handleOpenPrivacyModal);
      // Cleanup observers
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div className={styles.container} role="document">
      <MouseGradient />
      <div className="content-wrapper">
      <header role="banner" className={styles.header}>
        <button 
          className={styles.backToTop}
          onClick={() => window.scrollTo({ top: -50, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </button>
        <div className={styles.legalLinks}>
          <button 
            onClick={() => setShowImpressumModal(true)}
            className={styles.legalLink}
            aria-label="View Impressum"
          >
            Impressum
          </button>
          <span className={styles.legalSeparator}>|</span>
          <button 
            onClick={() => setShowPrivacyModal(true)}
            className={styles.legalLink}
            aria-label="View Privacy Policy"
          >
            Privacy
          </button>
        </div>
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
              <div className={styles.menuContainer}>
          {/* <InteractiveMenu activeSection={activeSection} onSectionChange={setActiveSection} /> */}
          </div>
              <hr className={styles.divider} />
              <nav className={styles.navLinks} aria-label="Main navigation">
                <a 
                  href="#welcome-heading" 
                  className={styles.navLink} 
                    onClick={(e) => scrollToSection(e, 'welcome-heading', 3000)}
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
                <a 
                  href="https://jopl.artstation.com/" 
                  className={styles.navLink}
                  target="_blank"
                >
                  Artstation
                </a>
                <a
                  href="https://github.com/JOPL11/jpl3" 
                  className={styles.navLink}
                  target="_blank">
                    Github
                </a>
                <Link href="/blog" className={styles.navLink}>
                  devBlog
                </Link>
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
          
          <section id="welcome-heading" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="welcome-heading">
            <div data-section="welcome-heading"></div>
              {/*     
           <div className={styles.heroContainer}>
              <Hero3D />
            </div>
            */} 
             {/*About Section Detector Here*/} 
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "4rem"}}>About</h2>
            <p>Hi! My name is Jan Peiro.</p>

            <p>Studied Communications Design in Munich, Germany.</p>
           
            <p>I build immersive interfaces merging design, animation, and code.</p>

            <p>Based in Germany.</p>

            
            <hr className={styles.divider2} />
            <section className={styles.section} aria-labelledby="skills-heading">
              <h2 id="skills-heading">Core Skills</h2>
              <ul className={styles.skillsList} role="list">
                <li role="listitem">Design, Animation, Development, Rapid Prototyping</li>
                <li role="listitem">React, Next.js</li>
                <li role="listitem">Three.js, React 3 Fiber, WebXR</li>
                <li role="listitem">vite, git, npm, yarn</li>
                <li role="listitem">SQL / Supabase Experience</li>
                <li role="listitem">GSAP, Framer Motion, CSS Animations, Spring</li>
                <li role="listitem">SEO</li>
                <li role="listitem">Cinema4D, Blender, Adobe Suite</li>
                <li role="listitem">3D Modeling, Animation, Rendering</li> 
                 {/*  
                <li role="listitem">Octane, Redshift, Corona Render Engines</li>
                <li role="listitem">After Effects, Video Edit, Video Post-Production</li>*/}
              </ul>
            </section>
            <hr className={styles.divider2} />
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

             {/* About section End */}

            <hr className={styles.divider2} />
            <SectionTracker onSectionChange={setActiveSection} />
            <div data-section="projects-heading"></div>      


            <section id="work" className={styles.section} aria-labelledby="projects-heading">
            <div data-section="projects-heading"></div>
              <h2 id="projects-heading" className={styles.scrollTarget}>Code</h2>
          
              <div className={styles.projectsGrid} role="grid" aria-label="Projects">

              <ProjectCard 
                  title="Stadtberichter Info Page"
                  image="/images/corp/sb0.jpg"
                  alt="Stadtberichter Info Page"
                  text="A GDPR-compliant info page for a civics oriented app."
                  link="https://sbinfo1.vercel.app"
                  client={{
                    name: "Stadtberichter |",
                    logo: "/images/agencies/sblogo_whitelong.svg",
                    website: "https://sbinfo1.vercel.app",
                  }}
                  logoWidth={300}
                  logoHeight={50}
                  logoStyle={{
                    height: '30px',  
                    width: 'auto', 
                    maxWidth: '100%'
                  }}
                >
                  <p><strong>Target Audience:</strong> Municipal Authorities</p>
                  <p><strong>Project Type:</strong> Infopage about the Neighborhood Clean-up mobile App</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Duration:</strong> 4 days</p>
                  <p><strong>Tools:</strong> Next.js, Vercel</p>
                </ProjectCard>
                <ProjectCard 
                  title="Stadtberichter App"
                  image="/images/corp/sb3.jpg"
                  alt="Stadtberichter App"
                  link="https://sb202.vercel.app/"
                  text={`<b>Pre-Alpha Demo.</b>
                  <br />
                  <br />
                  A GDPR-compliant civics-oriented app designed to help keep local neighborhoods clean. Some features get enabled and disabled based on current development stage.`}
                  client={{
                    name: "Stadtberichter |",
                    logo: "/images/agencies/sblogo_whitelong.svg",
                    website: "https://sbinfo1.vercel.app"
                  }}
                  logoWidth={300}
                  logoHeight={50}
                  logoStyle={{
                    height: '30px',
                    width: 'auto',   
                    maxWidth: '100%'
                  }}
                >
                  <p><strong>Target Audience:</strong> Municipal Citizens</p>
                  <p><strong>Project Type:</strong> Neighborhood clean-up App</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Tools:</strong> Next.js, Supabase</p>
                  <p><strong>More:</strong><br /> App uses geodata, voice-to-text, i18n language versioning, rate-limiting and other security features (auth csrf, xss prevention, rls, etc.) feeding into a near real-time municipal dashboard</p>
                </ProjectCard>

                <ProjectCard 
                  title="Stadtberichter Municipal Dashboard"
                  image="/images/corp/sb2.jpg"
                  alt="Stadtberichter Municipal Backend"
                  text="<b>Currently in development.</b> A dashboard that lets a municipal authority manage citizen reports, set participant scores, set up geofencing, and view data transmitted by the Stadtmelder app."
                  //link="https://sb-map.vercel.app/"
                  client={{
                    name: "Stadtberichter |",
                    logo: "/images/agencies/sblogo_whitelong.svg",
                    website: "https://sbinfo1.vercel.app"
                  }}
                  modalContent={{
                    description: `This is the Stadtberichter app Dashboard for municipal authorities to manage citizen reports, set participant scores, set up geofencing, and view data transmitted by the Stadtmelder app.`,
                    images: [
                      { src: "/images/SB_A1.jpg", alt: "Stadtberichter Municipal Dashboard Screenshot 1" },
                      { src: "/images/SB_A2.jpg", alt: "Stadtberichter Municipal Dashboard Screenshot 2" },
                      { src: "/images/SB_A3.jpg", alt: "Stadtberichter Municipal Dashboard Screenshot 3" },
                    ]
                  }}
                  
                  logoWidth={300}
                  logoHeight={50}
                  logoStyle={{
                    height: '30px', 
                    width: 'auto',   
                    maxWidth: '100%', 
                    
                  }}
                >
                  <p><strong>Target Audience:</strong> Municipal Authorities</p>
                  <p><strong>Project Type:</strong> Municipal Dashboard</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Tools:</strong> Next.js, Supabase, Geoman-io, leaflet, Openstreetmap</p>
                </ProjectCard>

              <ProjectCard 
                  title="Airbus Berlin Showroom Interface"
                 // image="/images/corp/airbus.jpg"
                 image="/images/JPL3Poster_AB.jpg"
                  alt="Berlin Showroom Expo piece"
                  client={{
                    name: "SMMD Team  |",
                    logo: "/images/agencies/SMMD_wide.png",
                    website: "https://www.smmd.team"
                  }}
                  logoWidth={300}
                  logoHeight={50}
                  logoStyle={{
                    height: '20px', 
                    width: 'auto', 
                    maxWidth: '100%'
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
                  <p><strong>Target Audience:</strong> Guests at Airbus Headquarters, Berlin</p>
                  <p><strong>Project Type:</strong> Touchtable Interface</p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 3 months and years of updates</p>
                  
                </ProjectCard>
                <ProjectCard 
                  title="Airbus Munich Interface"
                  image="/images/JPL3Poster_AB2.jpg"
                  alt="Ottobrunn Showroom Expo piece"
                  client={{
                    name: "SMMD Team |",
                    logo: "/images/agencies/SMMD_wide.png",
                    website: "https://www.smmd.team"
                  }}
                  logoWidth={300}
                  logoHeight={50}
                  logoStyle={{
                    height: '20px', 
                    width: 'auto',   
                    maxWidth: '100%'
                  }}
                  modalContent={{
                    description: `15 Chapters // RFID Powered Touchscreen Interface <br/>// Animated interactive 3D Models & 2D UI menu system & content.
                     A visitor would walk over to a wall mounted collection of plexiglass cubes which each contained a piece of Airbus tech, 
                     take one cube and place it on a recepticle, which read an RFID chip and opened a touchscreen interface explaining the
                     tech inside the cube.
                     <br />
                     Each tech was symbolized by a 3D model modeled after it, in the form of a symbolic kernel of the tech - a technocule , not a molecule -
                     and explained using text, images & video.`,
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
                  <p><strong>Role:</strong> Lead Designer, Lead Dev</p>
                  <p><strong>Duration:</strong> 3 months and years of updates</p>
                </ProjectCard>
                  {/*   */}   
            
               
                 <ProjectCard 
                  title="Spiegel Geschichte TV Website"
                 image="/images/corp/spg.jpg"
                  alt="Spiegel Geschichte TV Website"
                  text="<b>Legacy Project:</b> Official Website for the Pay TV channel."
                  client={{
                    name: "Autentic GmbH |",
                    website: "https://www.autentic.com/"
                  }}
                  modalContent={{
                    description: `Official Website for the Pay TV channel Spiegel Geschichte TV. Legacy project, not the current Spiegel Geschichte TV website.<br/>
                    It was more like generative historical thoughtprovoker. Well known images of historical photographs were used in a slideshow that was the backdrop for the UI, which had famous historical videoclip thumbnails. If left alone,
                    the UI would continue to cycle through its various sections of images and videos and interactive content, creating a never-ending slideshow of historical content acyclicly. Sometimes creating bizarre and unexpected semantic impressions.`,
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
                  <p><strong>Duration:</strong> 3 months / 6 years of updates</p>
                </ProjectCard> 
               
            {/*     <ProjectCard 
                  title="Middle Caicos Festival"
                  image="/images/JPL3Poster_BB.jpg"
                  alt="Middle Caicos Festival"
                  link="https://newest-ulf.vercel.app/"
                  text="A mobile app for the PFP Caribbean Festival"
                >
                  <p>Conceptual UI/UX</p>
                  <p><strong>Target Audience:</strong> Caribbean Festival Attendees</p>
                  <p><strong>Project Type:</strong> Simple Next.js/React/R3F website</p>
                  <p><strong>Role:</strong> Quick work for a friend, he paid me in fried chicken.</p>
                  <p><strong>Duration:</strong> 4 Days</p>
                  <p><strong>Tools:</strong> Next.js, React Three Fiber, Three.js</p>
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
                      { src: "/images/JPL3Poster_HA6.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/JPL3Poster_HA9.jpg", alt: "Project Screenshot 8" },
                      { src: "/images/JPL3Poster_HA5B.jpg", alt: "Project Screenshot 5" },
                      { src: "/images/JPL3Poster_HA10.jpg", alt: "Project Screenshot 9" },
                      { src: "/images/JPL3Poster_HA13.jpg", alt: "Project Screenshot 12" },
                    ]
                  }}
                >
                  <p>Conceptual UI/UX Design</p>
                  <p><strong>Target Audience:</strong> Health App Users</p>
                  <p><strong>Project Type:</strong> Next.js / React Interface Design</p>
                  <p><strong>Role:</strong> Lead Designer</p>
                  <p><strong>Duration:</strong> 1.5 weeks</p>
                </ProjectCard> */}
              </div>
            </section>

       {/*   Motion Section */}

       <hr className={styles.divider2} />
       <SectionTracker onSectionChange={setActiveSection} />
       <div data-section="motion-heading"></div>

        {/* Motion Section Detector Here */}
            <section id="motion-heading" className={`${styles.section} ${styles.scrollTarget}`}>
              <h2> Motion</h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
                
              <VideoProjectCard 
                  title="Showreel 2025"
                  image="/images/JPL3Poster_Reel.jpg"
                  alt="Showreel 2025"
                  videoUrl="https://vimeo.com/1103891139"
                  text="2D / 3D Motion Reel featuring Commercial and Personal Work "
                >
                  <p><strong>Description:</strong> Concept, 3D Modeling, Motion, VFX, Design, Post-Production</p>
                  <p><strong>Tools:</strong> Cinema4D, After Effects, Duik, Bodymovin, Red Giant, Element3D, Stardust, Corona, Octane, Redshift, Media Encoder</p>
                  <p><strong>Role:</strong> Concept / Animation / Post-Production</p>
                  <p><strong>More:</strong><br /> Be advised this hasn&apos;t been rebranded with my new logo. Still uses the JPL logo instead, hope that doesn&apos;t cause any confusion.</p>
                </VideoProjectCard>
                 {/*   Motion Section 
                <ProjectCard 
                  title="Audi Nüremberg"
                  image="/images/corp/audi.jpg"
                  alt="Audi Nüremberg"
                  text="Cinemascreen sized animation for a VIP Event"
                  client={{
                    name: "Planstand |",
                    website: "https://www.planstand.com/",
                    logo: "/images/agencies/planstand_logo.png"
                  }}
                  logoWidth={300}
                  logoHeight={50}
                  logoStyle={{
                    height: '20px',  // Directly set the height
                    width: 'auto',   // Let width adjust to maintain aspect ratio
                    maxWidth: '100%' // Ensure it doesn't overflow
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
                    name: "Sieber & Wolf |",
                    website: "https://sieberundwolf.de/",
                    logo: "/images/agencies/sw_neu_white.png"
                  }}
                  logoWidth={300}
                  logoHeight={50}
                  logoStyle={{
                    height: '20px',  // Directly set the height
                    width: 'auto',   // Let width adjust to maintain aspect ratio
                    maxWidth: '100%' // Ensure it doesn't overflow
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
                    logo: "/images/agencies/SMMD_wide.png",
                    website: "https://www.smmd.team/",
                  }}
                  logoWidth={300}
                  logoHeight={50}
                  logoStyle={{
                    height: '20px',  // Directly set the height
                    width: 'auto',   // Let width adjust to maintain aspect ratio
                    maxWidth: '100%' // Ensure it doesn't overflow
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
                */}
          
              </div> 
            </section> 

            {/*   MOTION ENDS HERE */}  
            {/*   WebGL Section */}

            <hr className={styles.divider2} />
            <SectionTracker onSectionChange={setActiveSection} />
        
            <div data-section="webgl-heading"></div>
            <section id="webgl-heading" className={`${styles.section} ${styles.scrollTarget}`}>
              <h2>WebGL</h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
              <ProjectCard 
                  title="Bytes101"
                  image="/images/bytes101.jpg"
                  alt="Bytes101"
                  link="https://bytes101.vercel.app"
                  text="Featuring custom 3D models and animations."
                  className="webglProject"
                >
                  <p>Concept Demo</p>
                  <p><strong>Project Type:</strong>Three.js / React Three Fiber</p>
                  <p><strong>Role:</strong> Concept / Animation / Dev</p>
                  <p><strong>Duration:</strong> 1 week</p>
                  <p><strong>Info:</strong>This was a learning project, I would do things differently today.</p>
                </ProjectCard>
                {!isMobile && (
                  <>
                    <ProjectCard 
                      title="Schrödinger & Bohr Quantum Pocketwatches "
                      image="/images/JPL3Poster_QC.jpg"
                      alt="Quantum Pocketwatch Company"
                      link="https://quantum-pocketwatch.vercel.app/"
                      text="<strong>Desktop Only</strong>. Featuring custom 3D models and interactions." 
                      className="webglProject"
                    >
                      <p>Visual Concept Experiment</p>
                      <p><strong>Tools:</strong>Three.js / React Three Fiber / GSAP / Router / Next.js</p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 2 weeks</p>
                      <p><strong>Info:</strong>This was a learning project, I would do things differently today.</p>
                    </ProjectCard>
                    <ProjectCard 
                      title="Streetlamp 2044"
                      image="/images/JPL3Poster_R3F.jpg"
                      alt="Streetlamp 2044"
                      text="Featuring custom audiotracks, 3D models and animations."
                      link="https://jpl3d2.vercel.app/"
                      className="webglProject"
                    >
                      <p>R3F Concept Demo</p>
                      <p><strong>Tools:</strong>Three.js / React Three Fiber / GSAP</p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 3 weeks</p>
                      <p><strong>Info:</strong>This was a learning project, I would do things differently today.</p>
                    </ProjectCard>
                    <ProjectCard 
                      title="The Facility"
                      image="https://cdna.artstation.com/p/assets/images/images/077/341/642/large/jan-peiro-box1.jpg?1719257986"
                      alt="The Facility"
                      text="Featuring custom audiotracks, 3D models and animations."
                      link="https://facility3.vercel.app/"
                      className="webglProject"
                    >
                      <p>Visual Concept Demo</p>
                      <p><strong>Tools:</strong>Three.js / React Three Fiber / GLSL / GSAP</p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 3 weeks</p>
                      <p><strong>Info:</strong>This was a learning project, I would do things differently today.</p>
                    </ProjectCard>
                  </>
                )}
              </div>

            </section>






            <hr className={styles.divider2} />
            <section id="contact" className={`${styles.section} ${styles.scrollTarget}`}>
              <h2>Contact</h2>
              <ContactForm />
            </section>
          </section>
        </div>
      </main>
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerContainer}>
          <nav className={styles.footerLinks} role="navigation" aria-label="Footer navigation">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={styles.backToTopFooter}
              aria-label="Back to top"
            >
              ↑
            </button>
            <p>&copy; <CopyrightYear /> Jan Peiro. All rights reserved.</p>
            <button 
              onClick={() => openModal('privacy')} 
              className={styles.footerLink} 
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => openModal('tos')} 
              className={styles.footerLink} 
              aria-label="Terms of Service"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
              className={styles.footerLink} 
              aria-label="Contact"
            >
              Contact
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setShowImpressumModal(true);
              }} 
              className={styles.footerLink} 
              aria-label="Impressum"
            >
              Impressum
            </button>
          </nav>
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
    </div>
  );
}
