'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import SectionTracker from './components/SectionTracker';
import MouseGradient from './components/MouseGradient';
import AnimatedText from './components/AnimatedText';
import ThrowableImages from './components/ThrowableImages';
import LogoCard from './components/LogoCard';
import { useMemo } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap';

  {/*
// Dynamically import the component with SSR disabled
const BelowFooterWorld = dynamic(
  () => import('./components/BelowFooterWorld'),
  { ssr: false }
);
*/}
const checkIfIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

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
import VideoProjectCardCarousel from './components/VideoProjectCardCarousel';
import ContactForm from './components/ContactForm';

// Wrapper component to handle WebGL and iOS interaction
const Logo3DWrapper = dynamic(
  () => import('./components/Logo3DWrapperB').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => <div style={{ width: '100vw', height: '350px' }} />
  }
);


function CopyrightYear() {
  const [year] = useState(new Date().getFullYear());
  return <>{year}</>;
}

export default function Home() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHamburger, setShowHamburger] = useState(true);

  // Toggle menu-open class on body when menu state changes
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);


  const [modalContent, setModalContent] = useState('privacy');
  const [activeSection, setActiveSection] = useState('welcome-heading');
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);
  const viewportWidth = useViewportWidth();
  const navMenuRef = useRef(null);



  const isMobile = viewportWidth < 768;

  useEffect(() => {
  console.log('isMenuOpen state changed to:', isMenuOpen);
}, [isMenuOpen]);


  // Setup section detection using IntersectionObserver
 {/*   useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      // Get the navigation menu element
      const navMenu = document.querySelector(`.${styles.navLinks}`);
      if (!navMenu) return;
      
      // Get the position of the navigation menu
      const navRect = navMenu.getBoundingClientRect();
      // Show hamburger when nav menu is scrolled out of view (top < 0)
      setShowHamburger(navRect.bottom < 0);
    }; 
    const handleScrollEnd = () => {
      isProgrammaticScroll.current = false;
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scrollend', handleScrollEnd);
    // Initial check
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
    };
  }, []);
*/} 
  const scrollToSection = (e, sectionId) => {
    console.log('scrollToSection called with sectionId:', sectionId);
    e.preventDefault();
    console.log('Setting active section to:', sectionId);
    setActiveSection(sectionId); // Update active section to trigger animation
    
    const element = document.getElementById(sectionId);
    console.log('Found element for section:', sectionId, element);
    
    if (element) {
      console.log('Scrolling to section:', sectionId, 'at position:', element.offsetTop - 5);
      window.scrollTo({
        top: element.offsetTop - 5,
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
    
    return () => {
      window.removeEventListener('openPrivacyModal', handleOpenPrivacyModal);
    };
  }, []);

  // Refs for animated headings
  const overviewHeadingRef = useRef(null)
  const aboutHeadingRef = useRef(null);
  const webglHeadingRef = useRef(null);
  const servicesHeadingRef = useRef(null);
  const workHeadingRef = useRef(null);
  const contactHeadingRef = useRef(null);
  const motionHeadingRef = useRef(null);
  const productHeadingRef = useRef(null);
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
  const artstationHeadingRef = useRef(null);
const scrollVelocity = useRef(0);
const animationFrameId = useRef(null);


  // Map section IDs to their refs
  const sectionRefs = useMemo(() => ({
    'about': aboutHeadingRef,
    'overview': overviewHeadingRef,
    'code': workHeadingRef,
    'services': servicesHeadingRef,
    'webgl': webglHeadingRef,
    'motion': motionHeadingRef,
    'proto': productHeadingRef,
    'contact': contactHeadingRef
  }), [aboutHeadingRef, overviewHeadingRef, workHeadingRef, webglHeadingRef, servicesHeadingRef, contactHeadingRef, motionHeadingRef, productHeadingRef]);
  
  // Trigger animation when section changes
  const isIOS = checkIfIOS();
const scrollRef = useRef(null);
useEffect(() => {
  console.log('Active section changed to:', activeSection);
  console.log('Section refs:', sectionRefs);
  // Initialize LocomotiveScroll if it doesn't exist
  if (!scrollRef.current) {
    scrollRef.current = new LocomotiveScroll({
      lenisOptions: {
        wrapper: window,
        content: document.documentElement,
        lerp: isIOS ? 0.07 : 0.1,
        duration: isIOS ? 1.0 : 1.2,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: isIOS ? 0.8 : 1,
        touchMultiplier: isIOS ? 1.5 : 2,
        normalizeWheel: true,
        wrapper: (element) => {
          // Check for modal overlay visibility
          const modalOverlay = document.querySelector(`.${styles.modalOverlay}`);
          if (modalOverlay && window.getComputedStyle(modalOverlay).display === 'flex') {
            return null; // Return null when modal is open
          }
          return window; // Default to window when no modal is open
        },
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -15 * t)),
      },
    });
  }
  // Trigger animation if section ref is available
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
  // Cleanup function
  return () => {
    if (scrollRef.current) {
      scrollRef.current.destroy();
      scrollRef.current = null;
    }
  };
}, [activeSection, sectionRefs]);

// Add these refs before the useEffect (inside the Home component)

useEffect(() => {
  const handleWheel = (e) => {
    const modalContent = document.querySelector(`.${styles.modalOverlay} .${styles.scrollableContent}`);
    if (modalContent && modalContent.offsetParent !== null) {
      const isOverModal = modalContent.contains(e.target) || e.target === modalContent;
        if (isOverModal) {
          e.stopPropagation();
          e.preventDefault();
          
          const delta = e.deltaY || e.detail || -e.wheelDelta;
          const currentScroll = modalContent.scrollTop;
          
          // Accumulate velocity
          scrollVelocity.current += delta * 0.5;
          
          gsap.to(modalContent, {
            scrollTop: currentScroll + scrollVelocity.current * 10,
            duration: 1.2, // Reduced from 2.2 for responsiveness
            ease: "power3.out",
            overwrite: true,
            onComplete: () => {
              // Reset velocity when animation completes
              scrollVelocity.current = 0;
            }
          });
  
        return false;
      }
    }
    return true;
  };
  
  window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
  
  return () => {
    window.removeEventListener('wheel', handleWheel, { passive: false, capture: true });
  };
}, [styles.modalOverlay, styles.scrollableContent]);

useEffect(() => {
  console.log(`
***************************************************************
***************************************************************
***                                                         *** ***                                                         ***
***                                                         *** ***                                                         ***
***                 Website Analysis Mode                   ***         
***                                                         *** ***                                                         ***
***                 Welcome to my console                   ***
***                                                         *** ***                                                         *** ***                                                         *** ***                                                         *** ***                                                         ***
***************************************************************
***************************************************************
  `);
}, []); 

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
   <Link 
  href="/" 
  className={`${styles.logoLink} ${showHamburger ? styles.logoVisible : ''}`} 
  aria-label="Home"
  style={{
    opacity: showHamburger ? 1 : 0,
    pointerEvents: showHamburger ? 'auto' : 'none',
    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
    marginLeft: '50px',
    transform: 'translateY(0px)'
  }}
>
      <Image 
        src="/images/jp.svg" 
        alt="JP Logo" 
        width={25} 
        height={25} 
        className={styles.logo}
        style={{
           marginLeft: '0px',  // Add some space between the arrow and logo
           transform: 'translateY(1px)',  // Fine-tune vertical alignment
           filter: 'invert(0)',
           display: 'block'
           
  }}
      />
    </Link>
        <div className={styles.legalLinks}>
            <button 
              className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''} ${showHamburger ? styles.hamburgerVisible : ''}`} 
              onClick={() => {
                console.log('Hamburger clicked. Current isMenuOpen:', isMenuOpen);
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              style={{
                opacity: showHamburger ? 1 : 0,
                pointerEvents: showHamburger ? 'auto' : 'none',
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
            <span className={styles.hamburgerBox}>
              <span className={styles.hamburgerInner}></span>
            </span>
          </button>

          
        </div>
        {/* Header content would go here   |  Privacy */}

        
      </header>

    <>
        {/* Mobile Menu Overlay */}
        <div 
          className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
          onClick={() => {
            console.log('Overlay clicked, closing menu');
            setIsMenuOpen(false);
          }}
        />
        {/* Mobile Menu */}
        <nav 
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuActive : ''}`}
          aria-hidden={!isMenuOpen}
        >
          <ul className={styles.mobileMenuList}>
            {['Overview', 'About', 'Services', 'Code', 'WebGL', 'Motion', 'Proto', 'Contact'].map((item) => (
              <li key={item} className={styles.mobileMenuItem}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className={styles.mobileMenuLink}
                  onClick={async (e) => {
                      e.preventDefault();
                      setIsMenuOpen(false); // Close the menu first
                      
                      // Wait for the next tick to ensure the menu is closed
                      await new Promise(resolve => setTimeout(resolve, 0));
                      scrollToSection(e, item.toLowerCase());
                    //  const element = document.getElementById(item.toLowerCase());
                     // if (element) {
                     //   const yOffset = 50; // Match this with your scroll-margin-top or header height
                     //   const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                     //   window.scrollTo({ top: y, behavior: 'smooth' });
                     // setIsMenuOpen(false);
                   // }
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
            <li className={styles.mobileMenuItem}>
              <a 
                href="https://jopl.artstation.com/" 
                className={styles.mobileMenuLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                Artstation
              </a>
            </li>
          </ul>
        </nav>
      </>


            
      
      <main className={styles.main} role="main" id="main-content">
        <div className={styles.contentWrapper}>
          <div className={styles.logoSidebar} role="complementary" aria-label="Logo and Navigation">
            <div>
              <div className={styles.contentLogo}>
                <Suspense fallback={<div style={{ width: '350px', height: '250px' }} />}>
                  <Logo3DWrapper />
                </Suspense>
              </div>
              <div className={styles.menuContainer} >
          {/* <InteractiveMenu activeSection={activeSection} onSectionChange={setActiveSection} /> 
          {/* <InteractiveMenu activeSection={activeSection} onSectionChange={setActiveSection} /> */}
          
       
          
         {/* 
                <nav className={styles.navLinks} aria-label="Main navigation" >
                                   <a 
                  href="#overview" 
                  className={`${styles.navLink} ${activeSection === 'overview' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'overview')}
                >
                  Overview
                </a>
                <a 
                  href="#about" 
                  className={`${styles.navLink} ${activeSection === 'about' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'about')}
                >
                  About
                </a>
                <a 
                  href="#services" 
                  className={`${styles.navLink} ${activeSection === 'services' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'services')}
                >
                  Services
                </a>
                <a 
                  href="#code" 
                  className={`${styles.navLink} ${activeSection === 'code' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'code')}
                >
                  Code
                </a>
                  <a 
                  href="#motion" 
                  className={`${styles.navLink} ${activeSection === 'motion' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'motion')}
                >
                  Motion
                </a>
                <a 
                  href="#webgl" 
                  className={`${styles.navLink} ${activeSection === 'webgl' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'webgl')}
                >
                  WebGL
                </a>
                <a 
                  href="#proto" 
                  className={`${styles.navLink} ${activeSection === 'proto' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'proto')}
                >
                  Proto
                </a>
                <a 
                  href="#contact" 
                  className={`${styles.navLink} ${activeSection === 'contact' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'contact')}
                >
                  Contact
                </a>
            {/*     <a
                  href="/assets/CV_JanPeiro_2025_Intnl.pdf"
                  className={styles.navLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CV
                </a>  
                <a 
                  href="https://jopl.artstation.com/" 
                  className={styles.navLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Artstation
                </a>
               
             <Link href="/blog" className={styles.navLink}>
                  devBlog
                </Link>
             </nav>
             */}
                {/*  
                              <a
                  href="https://github.com/JOPL11/jpl3" 
                  className={styles.navLink}
                  target="_blank">
                    Git
                </a>
              
              
              <div className={styles.profileImageContainer}>
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
          </div>
                                 {/*     
           <div className={styles.heroContainer}>
              <Hero3D />
            </div>
            */} 
             {/*About Section Detector Here*/} 

              
                <div data-section="overview"></div>
            <section id="overview" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="overview">
                <SectionTracker onSectionChange={setActiveSection} />
                <h2 style={{paddingTop: "13px"}}><AnimatedText ref={overviewHeadingRef}>Overview</AnimatedText></h2>
                <div style={{paddingBottom:"2rem"}}>
                  <div style={{height: "33px"}}></div>
                <p>Developing mission-critical digital experiences for global leaders. Trusted by major brands to translate brand vision into immersive interactive, motion, and installation design. </p>
                 <p>It&apos;ll be in development for a few days. Tapping on the company logo reveals information about the projects.</p></div>
                  <LogoCard />
            </section>
          <div data-section="about"></div>
          <section id="about" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="about">
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={aboutHeadingRef}>About</AnimatedText>
            </h2>
            <p>Hi! I&apos;m Jan Peiro.</p><br></br>

            <p>A multidisciplinary designer and creative who bridges the gap between stunning visuals and robust technology. I studied Communications Design in Munich and have spent my career transforming ideas into engaging experiences for a global clientele.</p>

           <p>I am specialized in <strong>2D / 3D design, animation and interactive content.</strong></p>

            <p>My core principle is <strong>merging design, animation, and code</strong> to create work that is not only beautiful but also functional and scalable.</p>

            <p>I started my career as jr. art director and gained proficiency in motion design, 3D visualization and creative development, while also building a strong foundation in web development and interactive design, for companies such as Audi, Daimler Benz, Airbus Group, BMW Group, Spiegel TV, Pro7Sat1, Warner Bros., 20th Century Fox and many more.</p>

            <p>Global Remote | EST / CET / EET</p>

            <p>Eligible to work in the EU, UK, and Canada without visa sponsorship.</p>

              <div style={{height: '0.1rem'}}></div>
            </section>


             <section id="services" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="services">
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={servicesHeadingRef}>Core Services</AnimatedText>
            </h2>
            <div style={{height: '0.1rem', marginBottom: '5rem'}}>Tools</div>
              <p>My toolkit is extensive and constantly evolving, allowing me to own a project from concept to deployment. I&apos;ve split the skills into separate categories for clarity:</p>
              <ul className={styles.skillsList} role="list">
              <h3 style={{fontSize: '1.3rem', fontWeight: '400', marginTop: '1rem', color: 'white'}}>Languages</h3>
              <div style={{display: 'flex', gap: '0', justifyContent: 'flex-start'}}>
                  <ul className={styles.skillsList} role="list" style={{margin: 0, flex: 1}}>
                      <li role="listitem">English (native)</li>
                      <li role="listitem">German (fluent)</li>
                  </ul>
                  <ul className={styles.skillsList} role="list" style={{margin: '0 0 0 -11rem', flex: 1}}>
                      <li role="listitem">Spanish (fluent)</li>
                      <li role="listitem">French (fluent)</li>
                  </ul>
              </div>
                <h3 style={{fontSize: '1.3rem', fontWeight: '400', marginTop: '1rem', color: 'white'}}>Strategy & Creative Direction</h3>
                <li role="listitem">Brand Identity Systems</li>
                <li role="listitem">Customer Experience / Design Psychology</li>
                <li role="listitem">Creative Direction</li>
                <li role="listitem">Stakeholder Communication & Alignment</li>
                <li role="listitem">Strategic Writing & Presentations</li>
                <li role="listitem">Project Ideation & Pitching</li>
                <li role="listitem">Project Management</li>
                <li role="listitem">UI / UIX Architecture</li>
                <h3 style={{fontSize: '1.3rem', fontWeight: '400', marginTop: '1rem', color: 'white'}}>Design, Motion & Creative</h3>
                <li role="listitem">Design, Animation, Concept Development</li>
                <li role="listitem">Illustration, Typography, Logo Design, Layout, Branding</li>
                <li role="listitem">Cinema4D, Blender, Adobe Suite</li>
                <li role="listitem">3D Modeling, 3D Animation, 3D Rendering</li>
                <li role="listitem">Octane Render, Corona Render</li>
                <li role="listitem">After Effects, Cavalry, Lottie, Video Edit, Video Post-Production</li>
                <h3 style={{fontSize: '1.3rem', fontWeight: '400', marginTop: '1rem', color: 'white'}}>Code</h3>
                <li role="listitem">Development, Rapid Prototyping</li>
                <li role="listitem">React, Next.js, Vue.js, html, css, javascript</li>
                <li role="listitem">Three.js, React 3 Fiber, WebXR</li>
                <li role="listitem">Typescript</li>
                <li role="listitem">GSAP, Framer Motion, CSS Animations, Spring</li>
                <li role="listitem">Bootstrap, Tailwind, MaterialUI</li>
                <li role="listitem">vite, git, gitlab, npm, yarn</li>
                <li role="listitem">SQL / Supabase Experience</li>
                <li role="listitem">Unity, C#</li>
                <li role="listitem">GLSL, HLSL experience</li>
                <li role="listitem">SEO, Analytics</li>

                 {/*  
                <li role="listitem">Octane, Redshift, Corona Render Engines</li>
                <li role="listitem">After Effects, Video Edit, Video Post-Production</li>    */}
              </ul>
         </section>
       
    
             {/* About section End */}

                  <div data-section="code-heading"></div>
            <SectionTracker onSectionChange={setActiveSection} /> 
            <section id="code" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="code">
       
              <h2 id="code" style={{marginTop: '100px'}} className={styles.scrollTarget}><AnimatedText ref={workHeadingRef}>Code Case Studies</AnimatedText></h2>
                 <div style={{height: '0.1rem', marginBottom: '5rem'}}>Selected Case Studies</div>
              <div className={styles.projectsGrid} role="grid" aria-label="Projects">

              <ProjectCard 
                onMoreClick={() => {
                    console.log('airbus2 More button clicked, triggering animation');
                    airbus2TextRef.current?.animate();
                  }}
                  title="Airbus Berlin Showroom Interface"
                  image="/images/corp/airbus.jpg"
                 //image="/images/JPL3Poster_AB.jpg"
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
                  onMoreClick={() => {
                    console.log('Airbus1 More button clicked, triggering animation');
                    airbusTextRef.current?.animate();
                  }}
                  title="Airbus Munich Interface"
                  image="/images/corp/airbus.jpg"
                 // image="/images/JPL3Poster_AB2.jpg"
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
                  text={"A physically interactive catalogue of Airbus technology made for the Ottobrunn showroom. Situated at Airbus Group&apos;s Munich offices."}
                  modalContent={{
                    description: `15 Chapters 
                    <br/><br/>RFID Powered Touchscreen Interface 
                    <br/><br/>Animated interactive 3D Models & 2D UI menu system & content.
                    <br/><br/>A visitor would walk over to a wall mounted collection of plexiglass cubes which each contained a piece of Airbus tech, 
                     take one cube and place it on a recepticle, which read an RFID chip and opened a touchscreen interface on a 75" monitor explaining the
                     tech inside the cube.
                    <br/><br/>
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
                  console.log('RoadRich More button clicked, triggering animation');
                  roadrichTextRef.current?.animate();
                }}
                  title="RoadRich App"
                  image="/images/corp/rr2.jpg"
                  alt="RoadRich App"
                  link="https://roadrich.vercel.app/"
                  textPosition="bottom"
                  text={`<b>Proof of concept Demo</b>
                  <br />
                  <br />
                  Share locations of cool Sperrmüll you encounter on the streets of Berlin. Maybe you don't want it. Maybe someone else will.`}
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
                  <p><strong>Info:</strong> I designed and built the whole actual app this infopage describes (and the backend interface for it already too), but I&apos;m on the fence about showing it without making people sign an NDA &apos;cuz it is going ahead. Dunno what to do about that right now.</p>
                </ProjectCard>
              </div>
            </section>
            <div data-section="motion-heading"></div>
              <section id="motion" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="motion">
            
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={motionHeadingRef}>Motion Case Studies</AnimatedText>
            </h2>
                <div style={{height: '0.1rem', marginBottom: '5rem'}}>Selected Case Studies</div>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
              <VideoProjectCard 
                  title="Showreel 2025"
                  image="/images/JPL3Poster_Reel.jpg"
                  alt="Showreel 2025"
                  text="2D / 3D Motion Reel featuring Commercial and Personal Work "
                  videoUrl= "https://vimeo.com/1115973919"
                >
                    <p><strong>Description:</strong> Concept, 3D Modeling, Motion, VFX, Design, Post-Production</p>
                    <p><strong>Tools:</strong> Cinema4D, After Effects, Duik, Bodymovin, Red Giant, Element3D, Stardust, Corona, Octane, Redshift, Media Encoder</p>
                    <p><strong>Role:</strong> Concept / Animation / Post-Production</p>
                    <p><strong>More:</strong><br /> Be advised this hasn&apos;t been rebranded with my new logo. Still uses the JPL logo instead, hope that doesn&apos;t cause any confusion.</p>
                </VideoProjectCard>
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
                </ProjectCard>
                <ProjectCard 
                  title="MTU Aero-Engines"
                  image="/images/corp/mtu.jpg"
                  alt="Audi Nüremberg"
                  text="Multimonitor animation for the MTU Tradefair Booth at the Paris Intnl. Airshow"
                  client={{
                    name: "VRPE |",
                    logo: "/images/agencies/vrpe_logoNew.png",
                  }}
                  logoWidth={306}
                  logoHeight={25}
                  logoStyle={{
                    height: '10px',  // Directly set the height
                    width: 'auto',   // Let width adjust to maintain aspect ratio
                    maxWidth: '100%' // Ensure it doesn't overflow
                  }}
                  modalContent={{
                    description: `Multimonitor animation for the <strong>Paris International Airshow</strong> Exhibition Booth.
  
                   <p>Animated excerpts can be seen in the motion reel</p>`,
                    images: [
                      { src: "/images/mtu1.jpg", alt: "Project Screenshot 1" },
                      { src: "/images/mtu4.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/mtu5.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/mtu6.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/mtu2.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/mtu7.jpg", alt: "Project Screenshot 8" },
                    ]
                  }}
                >
                  <p>Multi Monitor Animation</p>
                  <p><strong>Target Audience:</strong> Showroom visitors</p>
                  <p><strong>Project Type:</strong> After Effects / Cinema4D</p>
                  <p><strong>Role:</strong> Solo Visual Concept, Designer & Animator</p>
                </ProjectCard>
               
          
              </div> 
            </section> 

            {/*   WebGL Section */}
               <div data-section="webgl-heading"></div>
            <section id="webgl" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="webgl">
            
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={webglHeadingRef}>WebGL Case Studies</AnimatedText>
            </h2>
                <div style={{height: '0.1rem', marginBottom: '5rem'}}>Selected Case Studies</div>
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
                </ProjectCard>

                {!isMobile && (
                  <>
               
                    <ProjectCard 
                      onMoreClick={() => {
                        console.log('streetlamp More button clicked, triggering animation');
                        streetlampTextRef.current?.animate();
                      }}
                      title="Streetlamp 2044"
                      image="/images/JPL3Poster_R3F.jpg"
                      alt="Streetlamp 2044"
                      text="<strong>Experimental</strong>. Featuring custom audiotracks, 3D models and animations."
                      link="https://jpl3d2.vercel.app/"
                      className="webglProject"
                    >
                      <p>R3F Concept Demo</p>
                      <p><strong>Tools:</strong><AnimatedText ref={streetlampTextRef} type="project">Three.js / React 3 Fiber / GSAP</AnimatedText></p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 3 weeks</p>
                      <p><strong>Info:</strong> An immersive 3D experience exploring a scifi landscape through motion and interaction.</p>
                    </ProjectCard>
                    <ProjectCard 
                      onMoreClick={() => {
                        console.log('Facility More button clicked, triggering animation');
                        facilityTextRef.current?.animate();
                      }}
                      title="The Facility"
                      image="https://cdna.artstation.com/p/assets/images/images/077/341/642/large/jan-peiro-box1.jpg?1719257986"
                      alt="The Facility"
                      text="<strong>Experimental / Desktop Only</strong>. Featuring custom audiotracks, 3D models and animations."
                      link="https://facility3.vercel.app/"
                      className="webglProject"
                    >
                      <p>Visual Concept Demo</p>
                      <p><strong>Tools:</strong><AnimatedText ref={facilityTextRef} type="project">Three.js / React 3 Fiber / GLSL / GSAP</AnimatedText></p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 3 weeks</p>
                      <p><strong>Info:</strong> A mysterious facility exploring the intersection of architecture and digital art.</p>
                    </ProjectCard>

                       <ProjectCard 
                    onMoreClick={() => {
                      console.log('S&B More button clicked, triggering animation');
                      qcTextRef.current?.animate();
                    }}
                      title="Schrödinger & Bohr Quantum Pocketwatches "
                      image="/images/JPL3Poster_QC.jpg"
                      alt="Quantum Pocketwatch Company"
                      link="https://quantum-pocketwatch.vercel.app/"
                      text="<strong>Experimental / Desktop Only</strong>. Featuring custom 3D models and interactions." 
                      className="webglProject"
                    >
                      <p>Visual Concept Experiment</p>
                      <p><strong>Tools:</strong><AnimatedText ref={qcTextRef} type="project">Three.js / React 3 Fiber / GSAP / Router / Next.js</AnimatedText></p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 2 weeks</p>
                      <p><strong>Info:</strong> nerdRage! A playful take on quantum physics concepts.</p>
                    </ProjectCard>
                  </>
                )} {/*  */}
        
                  </div>
            </section>
          <div data-section="product-heading"></div>
            <section id="proto" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="proto">
          
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={productHeadingRef}>Prototype Case Study</AnimatedText>
            </h2>
            <div style={{height: '0.1rem', marginBottom: '7rem'}}>Tap or click the images to look through the pile of photos.</div>
              <div className={styles.introText}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                  Project: <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#acfeff' }}>&nbsp;Daimler Benz dealership award.</span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                  Client: <a href="https://sieberundwolf.de/" target="_blank" rel="noopener" ><span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#acfeff' }}>&nbsp;Sieber & Wolf&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
                  
                  <Image src="/images/agencies/sw_neu_white.png" alt="Sieber & Wolf"  width={33} height={16} /></a>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                  My Task: <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#acfeff', marginBottom:'3rem', display: 'block', lineHeight: '1.4' }}>Invent a new type of dealership award for Mercedes Benz. I thought up the concept, designed the whole piece including UI and put together a working tech-stack for a fully functional prototype.</span>
                </div>
              </div>
              <ThrowableImages />
            </section>

            {/*   MOTION ENDS HERE             <hr className={styles.divider2} /> */}  
            <div data-section="contact"></div>
            <section id="contact" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="contact">
            
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={contactHeadingRef}>Contact</AnimatedText>
            </h2>
            <div style={{height: '0.1rem', marginBottom: '11rem'}}>I&apos;m available for local projects as well as potential employment opportunities. Use the form to inquire about rates and availability, or just to say hi.</div>
              <ContactForm />
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
              onClick={() => window.open('https://github.com/JOPL11/jpl3', '_blank', 'noopener,noreferrer')} 
              className={styles.footerLink} 
              aria-label="View on GitHub"
            >
              GitHub
            </button>
                        <div  >
            <Link href="/blog" className={styles.footerLink}>
                  DevBlog
                </Link>
                </div>
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
                    {/*      <button 
              onClick={() => window.open('/assets/CV_JanPeiro_2025.pdf', '_blank', 'noopener,noreferrer')} 
              className={styles.footerLink} 
              aria-label="Curriculum Vitae"
            >
              CV  <BelowFooterWorld />
            </button>*/}
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
