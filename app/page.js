'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import SectionTracker from './components/SectionTracker';
import MouseGradient from './components/MouseGradient';
import AnimatedText from './components/AnimatedText';
import ThrowableProjects from './components/ThrowableProjects';
import LogoCard from './components/LogoCard';
//import HorizontalScroller from './components/Horizontal'
import { useMemo } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap';
import { createPortal } from 'react-dom';
import { useModal } from './components/ModalContext';
import PrivacyContent from './components/PrivacyContent';
import styles from './css/page.module.css';
//import ProfileCarousel from './components/ProfileCarousel';
   import PlaygroundContent from './components/PlaygroundContent';
   import ReactContent from './components/ReactContent';
   import MotionContent from './components/MotionContent';
   import ProductContent from './components/ProductContent';
  {/*
// Dynamically import the component with SSR disabled
const BelowFooterWorld = dynamic(
  () => import('./components/BelowFooterWorld'),
  { ssr: false }
);
*/}
const MuxPlayer = dynamic(
  () => import('@mux/mux-player').then(() => {
    return function MuxPlayerWrapper(props) {
      return <mux-player {...props} />;
    };
  }),
  { ssr: false }
);

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


//import ProjectCard from './components/ProjectCard';
//import VideoProjectCard from './components/VideoProjectCard';
import ContactForm from './components/ContactForm';
import Core from './components/Core';
// Wrapper component to handle Playground and iOS interaction
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
  const { openModal, closeModal } = useModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHamburger, setShowHamburger] = useState(true);
  const [showDesktopNav, setShowDesktopNav] = useState(false);

console.log('[Home] render');
useEffect(() => {
  const t = setTimeout(() => setShowDesktopNav(true), 2500); // 2.5s delay
  return () => clearTimeout(t);
}, []);

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
const MODAL_SECTIONS = {
  playground: () => <PlaygroundContent />,
  react:      () => <ReactContent />,
  code:       () => <ReactContent />, 
  motion:     () => <MotionContent />,
  product:    () => <ProductContent />,
};

const scrollToSection = (e, sectionId) => {
  e.preventDefault();

  const make = MODAL_SECTIONS[sectionId];
  if (make) {
    setActiveSection(sectionId);
    openModal(make(), `${sectionId}Modal`);
    return;                 // no scrolling, no closeModal
  }

  closeModal();             // other items: close any modal, then scroll
  setActiveSection(sectionId);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop + 110,
          behavior: 'smooth'
        });
        setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 1000);
      }
    });
  });
};


  // Refs for animated headings
  const overviewHeadingRef = useRef(null)
  const aboutHeadingRef = useRef(null);
  const playgroundHeadingRef = useRef(null);
  const servicesHeadingRef = useRef(null);
  const workHeadingRef = useRef(null);
  const contactHeadingRef = useRef(null);
  const motionHeadingRef = useRef(null);
  const productHeadingRef = useRef(null);
  const bytes101TextRef = useRef(null);
 // const citylink1TextRef = useRef(null);
 // const citylink2TextRef = useRef(null);
 // const bumpiTextRef = useRef(null);
 // const airbusTextRef = useRef(null);
 // const airbus2TextRef = useRef(null);
 // const motionTextRef = useRef(null);
 // const streetlampTextRef = useRef(null);
//  const qcTextRef = useRef(null);
 // const facilityTextRef = useRef(null);
  const roadrichTextRef = useRef(null);
 // const artstationHeadingRef = useRef(null);
const scrollVelocity = useRef(0);
const animationFrameId = useRef(null);
const isNarrow = viewportWidth > 0 && viewportWidth <= 1650;
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

  // Map section IDs to their refs
  const sectionRefs = useMemo(() => ({
    'about': aboutHeadingRef,
    'overview': overviewHeadingRef,
    'react': workHeadingRef,
    'services': servicesHeadingRef,
    'product': productHeadingRef,
    'motion': motionHeadingRef,
    'video-plane': null,
    'Playground': playgroundHeadingRef,
    'contact': contactHeadingRef,
  }), [aboutHeadingRef, overviewHeadingRef, workHeadingRef, playgroundHeadingRef, servicesHeadingRef, contactHeadingRef, motionHeadingRef, productHeadingRef]);
  
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
}, [activeSection, sectionRefs, isIOS]);

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
}, []);
             
useEffect(() => {
  console.log(`
***************************************************************
***************************************************************
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                 Webapp Analysis Active                  ***
***                                                         ***
***                 Welcome to The Console                  ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***                                                         ***
***************************************************************
***************************************************************
  `);
}, []); 

  return (
    <div className={styles.container} role="document">
      <MouseGradient />
         {mounted && createPortal(
          <>
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
        src="/images/logo2.png" 
        alt="JP Logo" 
        width={25} 
        height={10} 
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
         {['Overview', 'About',  'Services', 'React', 'Playground', 'Product', 'Motion', 'Contact'].map((item) => (
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
    
      
       
          <div
            className={styles.menuContainer}
            style={
              isNarrow
                ? undefined
                : {
                  opacity: isMenuOpen || !showDesktopNav ? 0 : 1,
                  pointerEvents: isMenuOpen || !showDesktopNav ? 'none' : 'auto',
                  transition: 'opacity 0.8s ease-in-out',
                  }
            }
          >
          {/* <InteractiveMenu activeSection={activeSection} onSectionChange={setActiveSection} /> 
          {/* <InteractiveMenu activeSection={activeSection} onSectionChange={setActiveSection} /> */}
         {/* */}
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
                  href="#react"
                  className={`${styles.navLink} ${activeSection === 'react' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'react')}
                >
                  React
                </a>
                     <a 
                  href="#Playground" 
                  className={`${styles.navLink} ${activeSection === 'Playground' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'playground')}
                >
                  Playground
                </a>
                     <a 
                  href="#product" 
                  className={`${styles.navLink} ${activeSection === 'product' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'product')}
                >
                  Product
                </a>
                  <a 
                  href="#motion" 
                  className={`${styles.navLink} ${activeSection === 'motion' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'motion')}
                >
                  Motion
                </a>
           
                <a 
                  href="#contact" 
                  className={`${styles.navLink} ${activeSection === 'contact' ? styles.active : ''}`}
                  onClick={(e) => scrollToSection(e, 'contact')}
                >
                  Contact
                </a>
                         <a 
                  href="https://jopl.artstation.com/" 
                  className={styles.navLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Artstation
                </a>
                </nav>
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
            </>,
            document.body
            )}
        <div className="content-wrapper">
          <main className={styles.main} role="main" id="main-content">
        <div className={styles.contentWrapper}>
         
          <div className={styles.logoSidebar} role="complementary" aria-label="Logo and Navigation">
            <div>
              <div className={styles.contentLogo}>
             
                <Suspense fallback={<div style={{ width: '350px', height: '250px' }} />}>
                  <Logo3DWrapper />
                </Suspense>
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
            <section id="overview" className={`${styles.content} ${styles.scrollTarget} `} aria-labelledby="overview">
                <SectionTracker onSectionChange={setActiveSection} />
                <h2 style={{paddingTop: "118px"}}><AnimatedText ref={overviewHeadingRef}>Overview</AnimatedText></h2>
                <div style={{paddingBottom:"2rem"}}>
                  <div className={styles.divider3}></div>
                  <div style={{height: "33px"}}></div>
             <p>Developing mission-critical digital experiences for global leaders. Trusted by major brands to translate brand vision into immersive interactive, motion, and installation design.</p><br></br>
              <p>Each logo opens a closer look at a project.</p></div>
                  <LogoCard />
            </section>

          <div data-section="about"></div>
          <section id="about" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="about">
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={aboutHeadingRef}>About</AnimatedText>
            </h2>
          
            <p>Hi! I&apos;m Jan Peiro.</p>
            <div className={styles.divider3}></div>
            <br />
            <p>A multidisciplinary designer and creative who bridges the gap between visuals and technology. I hold a diploma in Communications Design from the Blocherer Schule für Kommunikationsdesign in Munich, Germany, and have spent my career transforming ideas into engaging experiences for a global clientele.</p>

            <p>Specialized in <strong>2D / 3D design, animation and interactive content.</strong></p>

            <p>My core principle is merging design, animation and code to create work that is aesthetic, functional and scalable.</p>

            <p>I started out as a junior art director and gained proficiency in motion design, 3D visualization and creative development, while also building a strong foundation in web development and interactive design. I've art directed, coded, animated and designed various international and national projects across the fashion, entertainment, automotive, broadcast and aerospace industries — spanning online, physical expo installations and motion design fields.</p>

            <p>Born in Barcelona, raised in Montreal. I've also lived in Philadelphia, Toronto, Munich and Barcelona.</p>

            <p>Canadian / Spanish citizenship. Global Remote | EST / CET / EET</p>

            <p>Recently left Germany after 25 years due to over-exposure to creeping renazification. Rather than participate in the chronic German nightmare of atavistic darkness, I bailed to a sunny villa with a private beach in Egypt.</p>

            <p>Available for select projects, not seeking German-based roles.</p>

            <div style={{height: '1rem'}}></div>
         {/*
            <ProfileCarousel
<p>After 20 years paying insane taxes with nothing but a kick in the head to show for it, I recently left Germany for good due to its renazification, its outdated tech stack, its contempt for creativity and its extremely limited capacity for self-reflection. I could go on and on. A lurking phenotype-based gatekeeper caste-system posing as a liberal democracy. Widespread dark triad psychologies. Careful, Europe - Germany is a predator masquerading as an altruist. Germany is a guy who steals your wallet, drowns you in the lake and then tells everyone how he only tried to help you.</p> 
                   <p>After 20 years paying insane taxes with nothing but a kick in the head to show for it, I recently left Germany for good due to its renazification and its outdated tech stack, and a whole lot of other reasons.</p> 
              images={[
                { src: '/images/me5.jpg', alt: 'JPL' },
                { src: '/images/me4.jpg', alt: 'JPL' },
                { src: '/images/me6.jpg', alt: 'JPL' },
                { src: '/images/me9.jpg', alt: 'JPL' },
                { src: '/images/me7.jpg', alt: 'Wild hair' },
                // Add more images as needed ]}
              activeSize={250}
              dormantSize={120}
            /> */}
            <br /><p style={{color: 'white', fontSize: '0.8rem', width: "200px", marginTop: '-20px'}}></p>
            </section>


            <section id="services" aria-labelledby="services">
              <Core headingRef={servicesHeadingRef} onSectionChange={setActiveSection} />
            </section>
       
              {/* About section End 
             
          
           
            <div data-section="product-heading"></div>
            <section id="product" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="product">
          
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={productHeadingRef}>Current Projects</AnimatedText>
            </h2>
            <div style={{height: '0.1rem', marginBottom: '3rem'}}>Tap or click the images.</div>
              
              <div className={styles.divider3}></div>
              <div className={styles.introText}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', paddingTop: "3rem" }}>
                  Project: <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#acfeff' }}>&nbsp;Various Mediums</span>
                </div>
             
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                  My Task: <span style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#acfeff', marginBottom:'3rem', display: 'block', lineHeight: '1.4' }}>Works In Progress</span>
                </div>
              </div>
              <ThrowableProjects />
            </section>

*/}
           
            {/*   MOTION ENDS HERE             <hr className={styles.divider2} /> */}  
            <div data-section="contact"></div>
            <section id="contact" className={`${styles.content} ${styles.scrollTarget}`} aria-labelledby="contact">
            
             <SectionTracker onSectionChange={setActiveSection} />
            <h2 style={{paddingTop: "5rem"}}>
              <AnimatedText ref={contactHeadingRef}>Contact</AnimatedText>
            </h2>
            <div style={{height: '0.1rem', marginBottom: '3rem', fontSize: '1.2rem'}}>Get in touch. I'll get back to you.</div>
                          <div style={{width: '30rem'}} className={styles.divider3}></div>
                          <div style={{height: '0.1rem', marginBottom: '3rem'}}></div>
              <ContactForm />
            </section>
        </div>
      </main>
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerContainer}>
          <nav className={styles.footerLinks} role="navigation" aria-label="Footer navigation">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
              className={styles.backToTopFooter}
              aria-label="Back to top"
            >
              ↑
            </button>
            <div style={{fontSize: '1.2rem'}}>
            <p>&copy; <CopyrightYear /> Jan Peiro</p>
            </div>
           {/*   <button 
              onClick={() => window.open('https://github.com/JOPL11/jpl3', '_blank', 'noopener,noreferrer')} 
              className={styles.footerLink} 
              aria-label="View on GitHub"
            >
              GitHub
            </button>
              <BelowFooterWorld />  <div  >
            <Link href="/blog" className={styles.footerLink}>
                  DevBlog
                </Link>
                </div>
                            <button 
              onClick={(e) => {
                e.preventDefault();
                setShowImpressumModal(true);
              }} 
              className={styles.footerLink} 
              aria-label="Impressum"
            >
              Impressum
            </button>   */}
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              openModal(<PrivacyContent />, 'privacyModal');
            }} 
            className={styles.footerLink} 
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              openModal(
                <PrivacyContent scrollToTerms />, 
                'privacyModal'
              );
            }} 
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
              <a 
                href="/assets/CV_2026_JanPeiro.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.footerLink}
                aria-label="Curriculum Vitae"
                style={{ textAlign: 'left', display: 'inline-block' }}
              >
                CV
              </a>
          </nav>
        </div>      
      </footer> 
      </div>
    </div>
  );
}
