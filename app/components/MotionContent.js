'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AnimatedText from './AnimatedText';
import ProjectCard from './ProjectCard';
import ModalFooter from './ModalFooter';
import styles from '../css/page.module.css';

const MuxPlayer = dynamic(
  () => import('@mux/mux-player').then(() => {
    return function MuxPlayerWrapper(props) {
      return <mux-player {...props} />;
    };
  }),
  { ssr: false }
);

export default function MotionContent() {
  const bumpiTextRef = useRef(null);
  const citylink1TextRef = useRef(null);
  const motionHeadingRef = useRef(null);

  // Heading animation used to be fired by Home's activeSection effect.
  // Now each modal triggers its own, timed to the slide-up.
  useEffect(() => {
    const t = setTimeout(() => {
      try { motionHeadingRef.current?.animate?.(); } catch (e) { console.error(e); }
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
    <div className={`${styles.content} ${styles.modalColumn}`}>
            <h2>
              <AnimatedText ref={motionHeadingRef}>Motion Cases</AnimatedText>
            </h2>
            <div style={{height: 'auto', marginBottom: '1.4rem'}}>Video Edit / 2D / 3D</div>
            <div className={styles.divider3}></div>
            <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">
    

            <h2 style={{paddingTop: "1rem", fontSize: '1.5rem', color: "#a2feff"}}>Long Reel 2025</h2>
            <div>
            <div style={{height: 'auto', paddingTop: "0.2rem",  color: "#fff"}}>
            <p>2D / 3D Motion Reel featuring Commercial and Personal Work in Concept, 3D Modeling, Motion, VFX, Design, Post-Production.</p></div>
            <div style={{height: 'auto', paddingTop: "0.2rem", color: "#fff"}}>
            <p><strong>Tools:</strong><br />Cinema4D, After Effects, Duik, Bodymovin, Red Giant, Element3D, Stardust, Corona,   Octane, Redshift, Media Encoder</p>
            </div>
            <div style={{height: 'auto', paddingTop: "0.2rem",  color: "#fff"}}>
            <p><strong>Role:</strong><br /> Concept / Animation / Modeling / Post-Production</p>
            </div>
           
             
            
                    
              <div id='muxPlayer' style={{ 
              borderRadius: '15px',
                    }}>
                <div id='holder' style={{ 
                  width: '100%', 
                  maxWidth: '850px',
                  margin: '0',
                  position: 'relative',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 0 80px rgba(69, 218, 255, 0.7), 0 0 20px rgba(0, 0, 0, 0.2)'
                }}>
                  <MuxPlayer
                    playback-id="Li7lobGhBKhtYMn9HqXmm4005O00fWpbrVHLfiDePuTxA"
                    poster="https://image.mux.com/Li7lobGhBKhtYMn9HqXmm4005O00fWpbrVHLfiDePuTxA/thumbnail.png?width=960&height=540&time=12"
                    controls
                    disableTracking={true}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      display: 'block',
                    }}
                    accent-color="#0a5fcf"
                    primary-color="#ffffff"
                    secondary-color="transparent"
                  />
                </div>
            </div>
          </div>
          <h2 style={{paddingTop: "1rem", fontSize: '1.40rem', color: "#a2feff"}}>Short Reel 2025</h2>
            <div style={{height: '0.1rem', marginBottom: '1.5rem',marginTop: '-1.3rem', color: "#fff"}}>Bam</div>
              <div id='muxPlayer' style={{ 
                      borderRadius: '15px',
                    }}>
                <div id='holder' style={{ 
                  width: '100%', 
                  maxWidth: '850px',
                  margin: '0',
                  position: 'relative',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 0 80px rgba(69, 218, 255, 0.7), 0 0 20px rgba(0, 0, 0, 0.2)'
                }}>
                  <MuxPlayer
                    playback-id="jQpM2jwUgrzmGjMoY8UIG7tUXHSaBK6zvWXIlqxJkMs"
                    poster="https://image.mux.com/jQpM2jwUgrzmGjMoY8UIG7tUXHSaBK6zvWXIlqxJkMs/thumbnail.png?width=960&height=540&time=18"
                    controls
                    disableTracking={true}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      display: 'block',
                    }}
                    accent-color="#0a5fcf"
                    primary-color="#ffffff"
                    secondary-color="transparent"
                  />
                </div>
            </div>
                   {/* About section End 
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

                 <HorizontalScroller label="Selected work" snap>
              {projects.map((p) => (
                <article key={p.slug} className="hs-card">
                     <ProjectCard
                  onMoreClick={() => {
                    console.log('citylink1 More button clicked, triggering animation');
                    citylink1TextRef.current?.animate();
                  }} 
                  title="CityLink Info Page"
                  image="/images/corp/sb4.jpg"
                  alt="CityLink Info Page"
                  link="https://sbinfo1.vercel.app"
                  text="A GDPR-compliant info page for a civics oriented app."
                
               
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
                  <p><strong>Info:</strong> The app this page describes is currently in development and visible / testable in the projectCards below.</p>
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
                    top: '15px',
                    height: '25px',
                    width: 'auto',   
                    maxWidth: '100%'
                  }}
                >
                  <p><strong>Target Audience:</strong> Municipal Citizens</p>
                  <p><strong>Project Type:</strong> Neighborhood clean-up App</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Tools:</strong><AnimatedText ref={bumpiTextRef} type="project"> Next.js, Supabase, Openstreetmap,</AnimatedText></p>
                  <p><strong>Features:</strong> Game Mode, Leaderboard, Score Distribution, manual or automatic Geolocation, Rate Limiting, CSRF Prevention, XSS Prevention, RLS, Optional Analytics, Optional Auth, Hashed IP Geofencing, Comprehensive Crash Guarding, i18n multilanguage support</p>
                  <p><strong>Goal:</strong> Make something fun, easy to use and secure in compliance with GDPR. At the same time making for a more streamlined and efficient process for municipal officials to manage environmental reports.</p>
                </ProjectCard>

                </article>
              ))}
            </HorizontalScroller>

               */}
 
              </div> 
        </div>
     <ModalFooter />
    </>
  );
}