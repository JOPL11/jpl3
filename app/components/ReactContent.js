'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AnimatedText from './AnimatedText';
import ProjectCard from './ProjectCard';
import ModalFooter from './ModalFooter';
import styles from '../css/page.module.css';

export default function ReactContent() {
  const airbus2TextRef = useRef(null);
  const airbusTextRef = useRef(null);
  const bumpiTextRef = useRef(null);
  const bytes101TextRef = useRef(null);
  const citylink1TextRef = useRef(null);
  const citylink2TextRef = useRef(null);
  const roadrichTextRef = useRef(null);
  const workHeadingRef = useRef(null);

  // Heading animation used to be fired by Home's activeSection effect.
  // Now each modal triggers its own, timed to the slide-up.
  useEffect(() => {
    const t = setTimeout(() => {
      try { workHeadingRef.current?.animate?.(); } catch (e) { console.error(e); }
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
    <div className={`${styles.content} ${styles.modalColumn}`}>
               <h2 style={{fontWeight: '600', fontSize: '2.35rem'}}>
              <AnimatedText ref={workHeadingRef}>React</AnimatedText>
            </h2>
               
                <div style={{height: '0.1rem', marginBottom: '3rem', fontSize: '1.2rem'}}>Web work. Design, build, ship.</div>
               <div className={styles.divider3}></div>
              <div className={styles.projectsGrid} role="grid" aria-label="Projects"> {/*  */}
    <ProjectCard 
                 onMoreClick={() => {
                  console.log('Mamdouh Law More button clicked, triggering animation');
                  roadrichTextRef.current?.animate();
                }}
                  title="Mamdouh Law"
                  image="/images/law.jpg"
                  alt="Mamdouh Law"
                  link="https://legal-mamdouh.vercel.app/en"
                  textPosition="bottom"
                  text={`
                  <br />
                  Legal Counsel in four Languages`}
                  client={{
                    name: "Mamdouh & Partners ",
                    //logo: "/images/rrlogolongwhite.svg",
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
                  <p><strong>Target Audience:</strong> People seeking counsel</p>
                  <p><strong>Project Type:</strong> Company Webapp</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Tools:</strong><AnimatedText ref={bytes101TextRef} type="project"> Next.js, Typescript</AnimatedText></p>

                </ProjectCard>

                 <ProjectCard 
                 onMoreClick={() => {
                  console.log('RoadRich More button clicked, triggering animation');
                  roadrichTextRef.current?.animate();
                }}
                  title="RoadRich App"
                  image="/images/corp/rr4.jpg"
                  alt="RoadRich App"
                  link="https://roadrich.vercel.app/"
                  textPosition="bottom"
                  text={`<b>Proof of Concept Demo</b>
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
                  <p><strong>Tools:</strong><AnimatedText ref={bytes101TextRef} type="project"> Next.js, Typescript, Tailwind, Supabase, Openstreetmap</AnimatedText></p>
                  <p><strong>Features:</strong> Photo capture / compression. Geolocation. Supabase. Openstreetmap.</p>
                  <p><strong>Goal:</strong> Make something fun, easy to use and secure in compliance with GDPR.</p>
                </ProjectCard>
             {/* About section End
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
                  image="/images/corp/rr4.jpg"
                  alt="RoadRich App"
                  link="https://roadrich.vercel.app/"
                  textPosition="bottom"
                  text={`<b>Proof of Concept Demo</b>
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
  */}

              {/* 
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
                  <br /><br />Because the dashboard enables users to delete database entries, it is only available for live-testing upon demand. Individual presentations are only available upon request."
                  modalClassName="citylinkModal"
                  //link="https://glassmapperwip.vercel.app/"
                   client={{
                    name: "Bumpi |",
                    logo: "/images/citylinklongwhite.svg",
                    website: "https://sbinfo1.vercel.app"
                  }}   
                  logoWidth={350}
                  logoHeight={90}
                  logoStyle={{
                    height: '30px',
                    width: 'auto',   
                    maxWidth: '100%'
                  }}   
                  modalContent={{
                    description: "A GDPR-compliant info page for a civics oriented app. This is the back end, where the submissions from the Bumpi app are stored,evaluated, and municipal officials can manage the data, direct clean-up crews, set geofences, set user-scores and more. ",
                    images: [
                      { src: "/images/CL0.jpg", alt: "Project Screenshot 1" },
                        { src: "/images/SB_A7.jpg", alt: "Project Screenshot 6" },
                      { src: "/images/CL1.jpg", alt: "Project Screenshot 2" },
                      { src: "/images/CL2.jpg", alt: "Project Screenshot 3" },
                      { src: "/images/CL4.jpg", alt: "Project Screenshot 4" },
                      { src: "/images/CL3.jpg", alt: "Project Screenshot 5" },
                       { src: "/images/SB_A6.jpg", alt: "Project Screenshot 6" },
                    ]
                  }}
                > 
                  <p><strong>Target Audience:</strong> Municipal officials</p>
                  <p><strong>Project Type:</strong> Municipal Dashboard</p>
                  <p><strong>Role:</strong> Design & Development</p>
                  <p><strong>Tools:</strong><AnimatedText ref={citylink2TextRef} type="project"> Next.js, Supabase, Geoman-io, leaflet, Openstreetmap, REST</AnimatedText></p>
                </ProjectCard>
               
                <p>Pure next.js projects have been removed for now. If you wanna see some code projects head down to the Playground section.</p> */}
                </div>
           </div>
       <ModalFooter />
    </>
  );
}