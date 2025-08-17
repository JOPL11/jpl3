'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import SectionTracker from './components/SectionTracker';
import MouseGradient from './components/MouseGradient';
import AnimatedText from './components/AnimatedText';
import { useMemo } from 'react';
import LocomotiveScroll from 'locomotive-scroll';



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
    console.log('scrollToSection called with sectionId:', sectionId);
    e.preventDefault();
    console.log('Setting active section to:', sectionId);
    setActiveSection(sectionId); // Update active section to trigger animation
    
    const element = document.getElementById(sectionId);
    console.log('Found element for section:', sectionId, element);
    
    if (element) {
      console.log('Scrolling to section:', sectionId, 'at position:', element.offsetTop - 50);
      window.scrollTo({
        top: element.offsetTop - 110,
        behavior: 'smooth'
      });
      
      // Reset the flag after scroll completes
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
    } else {
      console.error('Could not find element with id:', sectionId);
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

  // Refs for animated headings
  const aboutHeadingRef = useRef(null);
  const webglHeadingRef = useRef(null);
  const skillsHeadingRef = useRef(null);
  const workHeadingRef = useRef(null);
  const contactHeadingRef = useRef(null);
  const motionHeadingRef = useRef(null);
  const bytes101TextRef = useRef(null);
  const citylink1TextRef = useRef(null);
  const citylink2TextRef = useRef(null);
  const bumpiTextRef = useRef(null);
  const airbusTextRef = useRef(null);
  const airbus2TextRef = useRef(null);
  const motionTextRef = useRef(null);
  const streetlampTextRef = useRef(null);
  const qcTextRef = useRef(null);
  const facilityTextRef = useRef(null);
  const roadrichTextRef = useRef(null);



  // Map section IDs to their refs
  const sectionRefs = useMemo(() => ({
    'welcome-heading': aboutHeadingRef,
    'projects-heading': workHeadingRef,
    'skills-heading': skillsHeadingRef,
    'webgl-heading': webglHeadingRef,
    'motion-heading': motionHeadingRef,
    'contact': contactHeadingRef
  }), [aboutHeadingRef, workHeadingRef, webglHeadingRef, skillsHeadingRef, contactHeadingRef, motionHeadingRef]);
  
  // Trigger animation when section changes
  useEffect(() => {
    console.log('Active section changed to:', activeSection);
    console.log('Section refs:', sectionRefs);
    //const locomotiveScroll = new LocomotiveScroll();

    const locomotiveScroll = new LocomotiveScroll({
      lenisOptions: {
          wrapper: window,
          content: document.documentElement,
          lerp: 0.1,
          duration: 1.2,
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          smoothTouch: false,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          normalizeWheel: true,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -15 * t)), // https://www.desmos.com/calculator/brs54l4xou
      },
  });
    if (activeSection && sectionRefs[activeSection]?.current) {
      console.log('Calling animate() on section ref:', activeSection, sectionRefs[activeSection].current);
      try {
        sectionRefs[activeSection].current.animate();
      } catch (error) {
        console.error('Error calling animate():', error);
      }
    } else {
      console.log('No animation triggered - section ref not found or not ready:', activeSection);
    }
  }, [activeSection, sectionRefs]);

  return (
    <div className={styles.container} role="document">
      <MouseGradient />
      <div className="content-wrapper">
      <header role="banner" className={styles.header}>
        <button 
          className={styles.backToTop}
          onClick={() => window.scrollTo({ top: 10, behavior: 'smooth' })}
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
          {/* <InteractiveMenu activeSection={activeSection} onSectionChange={setActiveSection} /> 
          {/* <InteractiveMenu activeSection={activeSection} onSectionChange={setActiveSection} /> */}
          
       
          </div>
         
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
              {/*<div className={styles.profileImageContainer}>
                <Image 
               src="/images/me3.jpg"
                  alt="Jan Peiro" 
                  width={200}
                  height={200}
                  className={styles.profileImage}
                  priority
                />
              </div>              </div>
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
            <h2 style={{paddingTop: "1rem"}}><AnimatedText ref={aboutHeadingRef}>&#47;&#47; About</AnimatedText></h2>
            <p>Hi! My name is Jan Peiro.</p>

            <p>Studied Communications Design in Munich, Germany.</p>
           
            <p>I build immersive interfaces merging design, animation, and code.</p>

            <p>Based in Germany.</p>

            
           
            <section className={styles.section} aria-labelledby="skills-heading">
              <h2 id="skills-heading"><AnimatedText ref={skillsHeadingRef}>&#47;&#47; Core Skills</AnimatedText></h2>
              <ul className={styles.skillsList} role="list">
                <li role="listitem">Design, Animation, Development, Rapid Prototyping</li>
                <li role="listitem">React, Next.js, Vue.js, html, css, .js</li>
                <li role="listitem">Typescript</li>
                <li role="listitem">Bootstrap, Tailwind, MaterialUI</li>
                <li role="listitem">Three.js, React 3 Fiber, WebXR</li>
                <li role="listitem">vite, git, npm, yarn</li>
                <li role="listitem">SQL / Supabase Experience</li>
                <li role="listitem">GSAP, Framer Motion, CSS Animations, Spring</li>
                <li role="listitem">SEO</li>
                <li role="listitem">Cinema4D, Blender, Adobe Suite</li>
                <li role="listitem">3D Modeling, Animation, Rendering</li>
                <li role="listitem">Octane, Corona, RenderFarms, After Effects</li>

                 {/*  
                <li role="listitem">Octane, Redshift, Corona Render Engines</li>
                <li role="listitem">After Effects, Video Edit, Video Post-Production</li>*/}
              </ul>
            </section>
       
            <div className={styles.languagesContainer}>
              <section className={styles.section} aria-labelledby="languages-heading">
                <h2 id="languages-heading">Languages</h2>
                <ul className={styles.skillsList} role="list">
                  <li role="listitem">English (native)</li>
                  <li role="listitem">German (fluent)</li>
                  <li role="listitem">Spanish (fluent)</li>
                  <li role="listitem">French (fluent)</li>
                </ul>
              </section>
            </div>

             {/* About section End */}

      
            <SectionTracker onSectionChange={setActiveSection} />
            <div data-section="projects-heading"></div>      


            <section id="work" className={styles.section} aria-labelledby="projects-heading">

              <h2 id="projects-heading" className={styles.scrollTarget}><AnimatedText ref={workHeadingRef}>&#47;&#47; Code</AnimatedText></h2>
          
              <div className={styles.projectsGrid} role="grid" aria-label="Projects">
              <ProjectCard 
                 onMoreClick={() => {
                  console.log('RoadRich More button clicked, triggering animation');
                  roadrichTextRef.current?.animate();
                }}
                  title="RoadRich App"
                  image="/images/corp/rr1.jpg"
                  alt="RoadRich App"
                  link="https://roadrich.vercel.app/"
                  textPosition="bottom"
                  text={`<b>Proof of concept Demo</b>
                  <br />
                  <br />
                  Share locations of cool Sperrmüll you encounter on the streets. Maybe you don't want it. Maybe someone else will.`}
                  client={{
                    name: "RoadRich |",
                    logo: "/images/rrlogolongwhite.svg",
                    //website: "#"
                  }}
                  logoWidth={250}
                  logoHeight={40}
                  logoStyle={{
                    height: '20px',
                    width: 'auto',   
                    maxWidth: '100%'
                  }}
                >
                  <p><strong>Target Audience:</strong> Sperrmüll Hunters</p>
                  <p><strong>Project Type:</strong> Neighborhood clean-up App</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Tools:</strong><AnimatedText ref={roadrichTextRef} type="project"> Next.js, Typescript, Tailwind, Supabase, Openstreetmap</AnimatedText></p>
                  <p><strong>Features:</strong> Photo capture / compression. Geolocation. Supabase. Openstreetmap.</p>
                  <p><strong>Goal:</strong> Make something fun, easy to use and secure in compliance with GDPR.</p>
                </ProjectCard>



              <ProjectCard
               onMoreClick={() => {
                console.log('citylink1 More button clicked, triggering animation');
                citylink1TextRef.current?.animate();
              }} 
                  title="CityLink Info Page"
                  image="/images/corp/sb.jpg"
                  alt="CityLink Info Page"
                  text="A GDPR-compliant info page for a civics oriented app."
                  link="https://sbinfo1.vercel.app"
                  client={{
                    name: "CityLink |",
                    logo: "/images/citylinklongwhite.svg",
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
                  <p><strong>Target Audience:</strong> Municipal officials</p>
                  <p><strong>Project Type:</strong> Infopage about the Neighborhood Clean-up mobile App</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Duration:</strong> 4 days</p>
                  <p><strong>Tools:</strong><AnimatedText ref={citylink1TextRef} type="project"> Next.js, react</AnimatedText></p>
                </ProjectCard>

                <ProjectCard 
                 onMoreClick={() => {
                  console.log('bumpi More button clicked, triggering animation');
                  bumpiTextRef.current?.animate();
                }}
                  title="Bumpi App"
                  image="/images/corp/sb3.jpg"
                  alt="Bumpi App"
                  link="https://sb202.vercel.app"
                  textPosition="bottom"
                  text={`<b>Current Project Pre-Alpha Demo.</b>
                  <br />
                  <br />
                  A GDPR-compliant civics-oriented app designed to help keep local neighborhoods clean. Some features get enabled and disabled based on current development stage.  
                   <br /> <br />The app uses geofencing, optional geolocation, text-input, voice-to-text. Hash3 deviceID, -ip address and user-agent scrambling and other security features feeding into a near real-time municipal dashboard.`}
                  client={{
                    name: "Bumpi App |",
                    logo: "/images/bumpilongwhite.svg",
                    website: "https://sbinfo1.vercel.app"
                  }}
                  logoWidth={250}
                  logoHeight={40}
                  logoStyle={{
                    height: '20px',
                    width: 'auto',   
                    maxWidth: '100%'
                  }}
                >
                  <p><strong>Target Audience:</strong> Municipal Citizens</p>
                  <p><strong>Project Type:</strong> Neighborhood clean-up App</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Tools:</strong><AnimatedText ref={bumpiTextRef} type="project"> Next.js, Supabase, Openstreetmap, dompurify</AnimatedText></p>
                  <p><strong>Features:</strong> Game Mode, Leaderboard, Score Distribution, manual or automatic Geolocation, Rate Limiting, CSRF Prevention, XSS Prevention, RLS, Optional Analytics, Optional Auth, Hashed IP Geofencing, Comprehensive Crash Guarding, i18n multilanguage support</p>
                  <p><strong>Goal:</strong> Make something fun, easy to use and secure in compliance with GDPR. At the same time making for a more streamlined and efficient process for municipal officials to manage environmental reports.</p>
                </ProjectCard>
                <ProjectCard 
                 onMoreClick={() => {
                  console.log('citylink2 More button clicked, triggering animation');
                  citylink2TextRef.current?.animate();
                }}
                  title="Bumpi Citylink Dashboard"
                  image="/images/corp/sb2.jpg"
                  alt="Bumpi Citylink - Municipal Backend"
                  text="<b>Currently in development.</b> A dashboard that lets a municipal authority manage citizen's reports, set participant scores if game-mode is activated, set up geofencing, and view data transmitted by the Bumpi app. 
                  <br /><br />Thus enabling the city to streamline its coordination of cleaning crews and manage city-wide cleaning events with pinpoint accuracy.
                  <br /><br />The dashboard is currently in development but available for live-testing. Login not yet functional."
                  link="https://glassmapperwip.vercel.app/"
                  client={{
                    name: "Bumpi |",
                    logo: "/images/citylinklongwhite.svg",
                    website: "https://sbinfo1.vercel.app"
                  }}    
                > 
                  <p><strong>Target Audience:</strong> Municipal officials</p>
                  <p><strong>Project Type:</strong> Municipal Dashboard</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Tools:</strong><AnimatedText ref={citylink2TextRef} type="project">Next.js, Supabase, Geoman-io, leaflet, Openstreetmap, REST</AnimatedText></p>
                </ProjectCard>
                <ProjectCard 
                  onMoreClick={() => {
                    console.log('Airbus1 More button clicked, triggering animation');
                    airbusTextRef.current?.animate();
                  }}
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
                  text={"An interactive catalogue of Airbus technology made for the Ottobrunn showroom. Situated at Airbus Group's Munich offices."}
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
                  <p><strong>Target Audience:</strong> Visitors at Airbus Group Ottobrunn Showroom</p>
                  <p><strong>Project Type:</strong><AnimatedText ref={airbusTextRef} type="project"> RFID Driven Interactive Experience</AnimatedText></p>
                  <p><strong>Role:</strong> Lead Designer, Lead Dev</p>
                  <p><strong>Duration:</strong> 3 months and years of updates</p>
                </ProjectCard>
                    
                <ProjectCard 
                onMoreClick={() => {
                    console.log('airbus2 More button clicked, triggering animation');
                    airbus2TextRef.current?.animate();
                  }}
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
                  text={"An interactive catalogue of Airbus technology and the company&apos;s history made for visiting foreign state officials and clients. Situated at Airbus Group's company headquarters."}
                  modalContent={{
                    description: `I had never designed things for big screens. 7680 x 1080. The content had to appear dynamically according to where the user was situated along its width. The UI consisted of a touchable fullscreen main menu which revealed 4 chapters of interactive content.
                    <br />
                    <br />
                    The first chapter was a history timeline of all of aviation history and how Airbus fit into it. 
                    <br />
                    <br />
                    The second chapter was a showcase featuring the corporations humanitarian projects and capacities. 
                    <br />
                    <br />
                    The third chapter was an interactive look at the future of the aerospace company and aviation in general.
                    <br />
                    <br />
                    The fourth chapter was an interactive showcase of the wide range of aircraft, satellites and spacecraft vehicles they build, interactively outlineing their capabilities using video, images and text. 
                    <br />
                    <br /> 
                    `,
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
                  <p><strong>Project Type:</strong><AnimatedText ref={airbus2TextRef} type="project"> Touchtable Interface</AnimatedText></p>
                  <p><strong>Role:</strong> Lead Designer, Lead Developer</p>
                  <p><strong>Duration:</strong> 3 months and years of updates</p>
                  
                </ProjectCard>
                
            
               
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
                    the UI would continue to cycle through its various sections of images and videos and interactive content, creating a never-ending slideshow of historical content acyclicly. Sometimes creating bizarre and unexpected semantic impressions.
                    All branded behind and inside the Spiegel's iconic bright red Visual Identity stripe as its main UI element.`,
                    images: [
                      { src: "/images/SGA_1.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/SGA_2.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/SGA_3.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/SG1.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/SG2.jpg", alt: "Project Screenshot 5" },
                      { src: "/images/SG3.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/SG4.jpg", alt: "Project Screenshot 7" },
                      { src: "/images/wsg3.jpg", alt: "Project Screenshot 8" },
                      { src: "/images/wsg5.jpg", alt: "Project Screenshot 9" },
                      { src: "/images/wsg6.jpg", alt: "Project Screenshot 10" },
                      { src: "/images/wsg7.jpg", alt: "Project Screenshot 11" },
                      { src: "/images/wsg8.jpg", alt: "Project Screenshot 12" },
                      { src: "/images/wsg9.jpg", alt: "Project Screenshot 13" },
                      { src: "/images/wsg10.jpg", alt: "Project Screenshot 14" },
                    ]
                  }}
                >
                  <p>Conceptual UI/UX</p>
                  <p><strong>Target Audience:</strong> Spiegel Geschichte TV Viewers</p>
                  <p><strong>Role:</strong> Lead Designer / Coder</p>
                  <p><strong>Duration:</strong> 3 months / 6 years of updates</p>
                </ProjectCard> 
               
            {/*   {/*  <ProjectCard 
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

            {/*   WebGL Section */}

         
            <SectionTracker onSectionChange={setActiveSection} />
        
            <div data-section="webgl-heading"></div>
            <section id="webgl-heading" className={`${styles.section} ${styles.scrollTarget}`}>
              <h2><AnimatedText ref={webglHeadingRef}>&#47;&#47; WebGL</AnimatedText></h2>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
              <ProjectCard 
                  onMoreClick={() => {
                    console.log('Bytes101 More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="Bytes101"
                  image="/images/bytes101.jpg"
                  alt="Bytes101"
                  link="https://bytes101.vercel.app"
                  text="Featuring custom 3D models and animations."
                  className="webglProject"
                >
                  <p>Concept Demo</p>
                  <p><strong>Project Type:</strong><AnimatedText ref={bytes101TextRef} type="project"> Three.js / React Three Fiber</AnimatedText></p>
                  <p><strong>Role:</strong> Concept / Animation / Dev</p>
                  <p><strong>Duration:</strong> 1 week</p>
                  <p><strong>Info:</strong>This was a learning project, I would do things differently today.</p>
                </ProjectCard>
                {!isMobile && (
                  <>
                    <ProjectCard 
                    onMoreClick={() => {
                      console.log('Bytes101 More button clicked, triggering animation');
                      qcTextRef.current?.animate();
                    }}
                      title="Schrödinger & Bohr Quantum Pocketwatches "
                      image="/images/JPL3Poster_QC.jpg"
                      alt="Quantum Pocketwatch Company"
                      link="https://quantum-pocketwatch.vercel.app/"
                      text="<strong>Desktop Only</strong>. Featuring custom 3D models and interactions." 
                      className="webglProject"
                    >
                      <p>Visual Concept Experiment</p>
                      <p><strong>Tools:</strong><AnimatedText ref={qcTextRef} type="project">Three.js / React 3 Fiber / GSAP / Router / Next.js</AnimatedText></p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 2 weeks</p>
                      <p><strong>Info:</strong>This was a learning project, I would do things differently today.</p>
                    </ProjectCard>
                    <ProjectCard 
                      onMoreClick={() => {
                        console.log('streetlamp More button clicked, triggering animation');
                        streetlampTextRef.current?.animate();
                      }}
                      title="Streetlamp 2044"
                      image="/images/JPL3Poster_R3F.jpg"
                      alt="Streetlamp 2044"
                      text="Featuring custom audiotracks, 3D models and animations."
                      link="https://jpl3d2.vercel.app/"
                      className="webglProject"
                    >
                      <p>R3F Concept Demo</p>
                      <p><strong>Tools:</strong><AnimatedText ref={streetlampTextRef} type="project">Three.js / React 3 Fiber / GSAP</AnimatedText></p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 3 weeks</p>
                      <p><strong>Info:</strong>This was a learning project, I would do things differently today.</p>
                    </ProjectCard>
                    <ProjectCard 
                      onMoreClick={() => {
                        console.log('Facility More button clicked, triggering animation');
                        facilityTextRef.current?.animate();
                      }}
                      title="The Facility"
                      image="https://cdna.artstation.com/p/assets/images/images/077/341/642/large/jan-peiro-box1.jpg?1719257986"
                      alt="The Facility"
                      text="Featuring custom audiotracks, 3D models and animations."
                      link="https://facility3.vercel.app/"
                      className="webglProject"
                    >
                      <p>Visual Concept Demo</p>
                      <p><strong>Tools:</strong><AnimatedText ref={facilityTextRef} type="project">Three.js / React 3 Fiber / GLSL / GSAP</AnimatedText></p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 3 weeks</p>
                      <p><strong>Info:</strong>This was a learning project, I would do things differently today.</p>
                    </ProjectCard>
                  </>
                )}
              </div>

            </section>
            
       {/*   Motion Section 

       <hr className={styles.divider2} />*/}
       <SectionTracker onSectionChange={setActiveSection} />
       <div data-section="motion-heading"></div>

        {/* Motion Section Detector Here */}
            <section id="motion-heading" className={`${styles.section} ${styles.scrollTarget}`}>
              <h2><AnimatedText ref={motionHeadingRef}>&#47;&#47; Motion</AnimatedText></h2>
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

            {/*   MOTION ENDS HERE             <hr className={styles.divider2} /> */}  
            <section id="contact" className={`${styles.section} ${styles.scrollTarget}`}>
              <h2><AnimatedText ref={contactHeadingRef}>&#47;&#47; Contact</AnimatedText></h2>
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
