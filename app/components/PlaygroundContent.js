'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AnimatedText from './AnimatedText';
import ProjectCard from './ProjectCard';
import ModalFooter from './ModalFooter';
import styles from '../css/page.module.css';


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function PlaygroundContent() {
  const isMobile = useIsMobile();
  const bytes101TextRef = useRef(null);
  const facilityTextRef = useRef(null);
  const playgroundHeadingRef = useRef(null);

  // Heading animation used to be fired by Home's activeSection effect.
  // Now each modal triggers its own, timed to the slide-up.
  useEffect(() => {
    const t = setTimeout(() => {
      try { playgroundHeadingRef.current?.animate?.(); } catch (e) { console.error(e); }
    }, 900);
    return () => clearTimeout(t);
  }, []);
  const qcTextRef = useRef(null);
  const streetlampTextRef = useRef(null);

  return (
    <>
    <div className={`${styles.content} ${styles.modalColumn}`}>
            
            <h2 style={{ color: '#c25e00', fontWeight: 'Bold'}}>
              <AnimatedText ref={playgroundHeadingRef}>Playground</AnimatedText>
            </h2>
               
            <div class={styles.subhead} style={{height: '0.1rem', marginBottom: '3rem', fontSize: '1.4rem', color: '#ffffff', opacity: '0.9'}}>Fun with in-browser interactive realtime 3D</div>
               <div className={styles.divider3}></div>
              <div className={styles.projectsGrid} role="grid" aria-label="Showcase projects">

{/*  */}
               <ProjectCard 
                deform
                  onMoreClick={() => {
                    console.log('WarRoom More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="War Room"
                  image="/images/warroom.jpg"
                  alt="warroom"
                  link="https://warroom-silk.vercel.app"
                  text="Ask a question and history's three greatest strategists answer in their own voices, then rebut each other, and finally a fourth voice synthesizes a verdict. A Spatial AI Interface built with RAG, Blender, Next.js, and Three.js / React Three Fiber."
                  className="PlaygroundProject"
                >
                  <p>Concept Demo</p>
                  <p><strong>Project Type:</strong><br /><AnimatedText ref={bytes101TextRef} type="project"> React / AI</AnimatedText></p>
                  <p><strong>Role:</strong><br /> Concept / Animation / Development</p>
                </ProjectCard>

          <ProjectCard 
                   deform
                  onMoreClick={() => {
                    console.log('karnak More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="Temple of Karnak Guided Tour"
                  image="/images/karnak.jpg"
                  alt="emple of Karnak"
                  link="https://temples-eta.vercel.app"
                  text="The largest temple on earth, reconstructed to spec in Blender / Three.js / React / R3F and animated with greensock & GLSL for an immersive & interactive guided tour."
                  className="PlaygroundProject"
                >
                  <p>Concept Demo</p>
                  <p><strong>Project Type:</strong><br /><AnimatedText ref={bytes101TextRef} type="project"> React</AnimatedText></p>
                  <p><strong>Role:</strong><br /> Concept / Model / Development</p>
                </ProjectCard>

          

          {!isMobile && (
                  <> 
              

              <ProjectCard 
                   deform
                  onMoreClick={() => {
                    console.log('Embryo More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="Embryo"
                  image="/images/embryo.jpg"
                  alt="Embryo"
                  link="https://embryo-bay.vercel.app/"
                  text="Under construction. Not ready for mobile."
                  className="PlaygroundProject"
                >
                  <p>Concept Demo / Opus in Fabrica</p>
                  <p><strong>Project Type:</strong><br /><AnimatedText ref={bytes101TextRef} type="project"> React</AnimatedText></p>
                  <p><strong>Role:</strong><br /> Concept / Development / Models</p>
                </ProjectCard>
           
                   </>
                )}
        
             
              <ProjectCard 
                deform
                  onMoreClick={() => {
                    console.log('AI Ching More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="A.I. Ching"
                  image="/images/ching.jpg"
                  alt="AI-Ching"
                  link="https://ai-ching.vercel.app"
                  text="Type in a question. Random numbers piped in from photon beam splitters at the University of Australia cast one of 64 I Ching hexagrams; AI interprets the meaning of the hexagram through the lens of your question. Spatial AI Interface"
                  className="PlaygroundProject"
                >
                  <p>Concept Demo</p>
                  <p><strong>Project Type:</strong><br /><AnimatedText ref={bytes101TextRef} type="project"> React / AI</AnimatedText></p>
                  <p><strong>Role:</strong><br /> Concept / Animation / Development</p>
                </ProjectCard>


                <ProjectCard 
                  deform
                  onMoreClick={() => {
                    console.log('Redpoint More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="Redpoint anti-stress game"
                  image="/images/redpoint.jpg"
                  alt="redpoint game"
                  link="https://dots-flow.vercel.app/"
                  text="A zen meditation game to just sit with your thoughts on autopilot. Nothing stressy."
                  className="PlaygroundProject"
                >
                  <p>Concept Demo</p>
                  <p><strong>Project Type:</strong><br /><AnimatedText ref={bytes101TextRef} type="project"> React</AnimatedText></p>
                  <p><strong>Role:</strong><br /> Concept / Model / Development</p>
                </ProjectCard>
          
            {/*       <ProjectCard 
                     deform
                     onMoreClick={() => {
                    console.log('More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="CloudTunnel"
                  image="/images/corp/dornbach.jpg"
                  alt="Dornbach"
                  link="https://cloudtunnels.vercel.app/"
                  text="Expo installation prototype engine for a physical installation piece at the Milan Design Week 2026."
                  className="PlaygroundProject"
                    client={{
                    name: "SMMD Team |",
                    logo: "/images/agencies/SMMD.png",
                    //website: "https://www.smmd.team/"
                }}   
                  logoWidth={350}
                  logoHeight={90}
                  logoStyle={{
                    height: '30px',
                    width: 'auto',   
                    maxWidth: '100%'
                  }}   
                >
                  <p>Expo installation-piece unfinished prototype</p>
                  <p><strong>Project Type:</strong><br /><AnimatedText ref={bytes101TextRef} type="project"> Three.js, React, GLSL (Shader), Next.js, GSAP </AnimatedText></p>
                  <p><strong>Role:</strong><br /> Code / Cloud visuals</p>
                </ProjectCard>

         

              <ProjectCard 
                deform
                  onMoreClick={() => {
                    console.log('Rehau More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="Rehau"
                  image="/images/corp/rehau.jpg"
                  alt="Rehau"
                  //link="https://cubistic.vercel.app"
                  text="Product showcase for the International Door & Window manufacturer."
                  className="PlaygroundProject"
                    client={{
                    name: "SMMD Team |",
                    logo: "/images/agencies/SMMD.png",
                    //website: "https://www.smmd.team/"
                 }}   
                  logoWidth={350}
                  logoHeight={90}
                  logoStyle={{
                    height: '30px',
                    width: 'auto',   
                    maxWidth: '100%'
                  }}   
                   modalContent={{
                    description: "An interactive 3D product showcase featuring various models of Rehau products. I made animations and parsed models, updated jsx, converted to WebXR.",
                    images: [ 
                     { src: "/images/rehau/rehau1.jpg", alt: "Project Screenshot 1" },
                     { src: "/images/rehau/rehau2.jpg", alt: "Project Screenshot 2" },
                     { src: "/images/rehau/rehau3.jpg", alt: "Project Screenshot 3" },
                     { src: "/images/rehau/rehau3B.jpg", alt: "Project Screenshot 4" },
                     { src: "/images/rehau/rehau4.jpg", alt: "Project Screenshot 5" },

                    ]
                  }}
                >
                  <p>Project In development</p>
                  <p><strong>Project Type:</strong><br /><AnimatedText ref={bytes101TextRef} type="project"> React</AnimatedText></p>
                  <p><strong>Role:</strong><br /> 3D model implementation & animation / WebXR implementation</p>
                </ProjectCard>
                        Playground Section    */}  

                 
            

             {/*  



                


                      <ProjectCard 
                    deform
                    onMoreClick={() => {
                      console.log('S&B More button clicked, triggering animation');
                      qcTextRef.current?.animate();
                    }}
                      title="Schrödinger & Bohr Quantum Pocketwatches "
                      image="/images/JPL3Poster_QC.jpg"
                      alt="Quantum Pocketwatch Company"
                      link="https://quantum-pocketwatch.vercel.app/"
                      text="<strong>Experimental / Desktop Only</strong>. Featuring custom 3D models and interactions." 
                      className="PlaygroundProject"
                    >
                      <p>Visual Concept Experiment</p>
                      <p><strong>Tools:</strong><br /><AnimatedText ref={qcTextRef} type="project">Three.js / React / R3F  / GSAP / Router / Next.js / Blender</AnimatedText></p>
                      <p><strong>Role:</strong><br /> Concept / Animation / Dev</p>
                    </ProjectCard>
                <ProjectCard 
                  onMoreClick={() => {
                    console.log('CubeSite More button clicked, triggering animation');
                    bytes101TextRef.current?.animate();
                  }}
                  title="Cubes"
                  image="/images/JPL3Poster_3D.jpg"
                  alt="CubeSite"
                  link="https://cubistic.vercel.app"
                  text="Featuring scripted 3D, interaction and animations."
                  className="PlaygroundProject"
                >
                  <p>Site Demo In development</p>
                  <p><strong>Project Type:</strong><AnimatedText ref={bytes101TextRef} type="project"> Three.js / React</AnimatedText></p>
                  <p><strong>Role:</strong> R3F concept architect & creator</p>
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
                      className="PlaygroundProject"
                    >
                      <p>R3F Concept Demo</p>
                      <p><strong>Tools:</strong><AnimatedText ref={streetlampTextRef} type="project">Three.js / React / R3F3 Fiber / GSAP / Blender</AnimatedText></p>
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
                      className="PlaygroundProject"
                    >
                      <p>Visual Concept Demo</p>
                      <p><strong>Tools:</strong><AnimatedText ref={facilityTextRef} type="project">Three.js / React / R3F3 Fiber / GLSL / GSAP / Blender / Adobe Suite</AnimatedText></p>
                      <p><strong>Role:</strong> Concept / Animation / Dev</p>
                      <p><strong>Duration:</strong> 3 weeks</p>
                      <p><strong>Info:</strong> A mysterious facility exploring the intersection of architecture and digital art.</p>
                    </ProjectCard>

                    */}
        
                  </div>
    </div>
     <ModalFooter />
    </>
  );
}