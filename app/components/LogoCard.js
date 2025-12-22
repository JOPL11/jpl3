// app/components/LogoCard.js
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../css/LogoCard.module.css';

const LogoModal = ({ logo, onClose }) => {
  if (!logo) return null;
  
  // Helper function to render HTML
  const createMarkup = (html) => {
    return { __html: html };
  };
  return (
<div className={styles.modalOverlay} onClick={onClose}>
  <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
    <div className={styles.modalHeader}>
      <h3 className={styles.modalTitle}>{logo.title || logo.alt}</h3>
      <button 
        className={styles.closeButton} 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>
    </div>
    {/* Client Info Section */}
        <div className={styles.clientInfo}>
          <span className={styles.clientText}>{logo.clientText || 'Client'}</span>
          {logo.clientLogo && (
            <div className={styles.clientLogo}
            style={logo.clientLogoHeight ? { '--logo-height': `${logo.clientLogoHeight}px` } : {}}
            >
              <Image
                src={logo.clientLogo}
                alt="Client Logo"
                width={100}
                height={40}
                className={styles.clientLogoImage}
              />
            </div>
          )}
        </div>
    <div className={styles.scrollableContent}>
      {logo.description && (
        <div 
          className={styles.modalDescription}
          dangerouslySetInnerHTML={createMarkup(logo.description)}
        />
      )}
      
      {logo.description2 && (
        <div 
          className={`${styles.modalDescription} ${styles.secondaryDescription}`}
          dangerouslySetInnerHTML={createMarkup(logo.description2)}
        />
      )}
    </div>
  </div>
</div>
  );
};

const LogoCard = () => {
    const [selectedLogo, setSelectedLogo] = useState(null);
    const scrollY = useRef(0);
    useEffect(() => {
    if (selectedLogo) {
      // Save the current scroll position
      scrollY.current = window.scrollY;
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.width = '100%';
    } else {
      // Restore the scroll position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY.current);
    }
    // Cleanup function
    return () => {
      if (selectedLogo) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY.current);
      }
    };
  }, [selectedLogo]);
  const logos = [
    {   id: 1, src: '/images/mini/aeromtu.jpg', 
        alt: 'Logo 1', 
        title: 'Digital Experiences for MTU Aero Engines',
      clientText: `SMMD Team`,
      clientLogo: '/images/agencies/SMMD.png',
      clientLogoHeight: 35,
      description: `
      <p>Delivered two flagship digital experiences for a global aerospace leader:<br> <br> 
      <strong>1)</strong> An immersive multi-monitor 3D visualization for their Paris Airshow exhibition.<br>
      <strong>2)</strong> A dynamic, interactive corporate presentation tool deployed for global stakeholder meetings. Owned concept, design, animation, and development.</p>

      <p><strong>Role:</strong> As the lead designer and developer, I was entrusted with creating both experiences from concept to delivery—handling visual design, 3D animation, motion graphics, and interactive coding.</p>
      <p><strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After-Effects, High-resolution render pipeline.</p>
    `,
    description2: ``
  },
    { id: 2, src: '/images/mini/airbus.jpg', alt: 'Logo 2', 
      title: 'Defining the Digital Frontier for Airbus Group',
      clientText: `SMMD Team`,
      clientLogo: '/images/agencies/SMMD.png',
      clientLogoHeight: 35,
      description: `
      <p><strong>The Mission:</strong> Airbus Group required a next-generation digital identity for its most important physical spaces: its International Headquarters in Berlin and its premier Showroom in Munich. The mandate was to replace static displays with interactive, multi-sensory experiences that could communicate the complexity and ambition of aerospace innovation to VIPs, partners, and policymakers.<br><br>

      <strong>My Role:</strong> Lead Digital Experience Designer & Developer.<br>
      I was entrusted with the complete digital vision for these spaces, acting as the sole creator across four distinct installations—responsible for User Experience (UIX) strategy, visual and motion design, 3D animation, and full-stack interactive development.<br><br>
      <strong>The Portfolio of Installations:</strong></p>

      <p><strong>1.</strong> HQ Command Center: Berlin Touchtable Interface<br>
      <strong>Challenge: </strong> Create a collaborative, data-driven tool for the heart of Airbus's operations.<br>
      <strong>Solution: </strong> Designed and coded a custom multi-monitor touchtable interface (JavaScript) that allowed executives to interactively explore fleet data, global operations, and company history. This was mission-critical UIX for daily use.</p>

      <p><strong>2.</strong> Showroom Centerpiece: Munich Interactive 3D Expo<br>
      <strong>Challenge: </strong> Concept, Design, Animation, Render<br>
      <strong>Solution: </strong> Airbus Munich Showroom</p>

      <p><strong>3. </strong> Visual Spectacles: Munich Large-Format Video Features.<br>
      <strong>Challenge:</strong> Provide awe-inspiring ambient narrative and brand moments.<br>
      <strong>Solution:</strong> Produced a suite of large-scale, multi-monitor video features. This included a complex 3D animated sequence visualizing flight dynamics and a stylized 2D motion graphics piece celebrating engineering milestones, both rendered in ultra-high resolution for close viewing.</p>
      <p><strong>The Outcome & Impact:</strong></p>
      <ul>
        <li><p>Transformed two key Airbus facilities from static spaces into dynamic, technology-forward brand experiences.</p></li>
        <li><p>Established a new standard for corporate engagement, merging tactile interaction with cinematic narrative.</p></li>
        <li><p>Demonstrated end-to-end mastery across the digital spectrum: from functional enterprise UIX to emotive brand spectacle.</p></li>
      </ul>
      <p><strong>Tech:</strong> JavaScript (for complex interactivity), Cinema4D, Redshift/Octane, Adobe After Effects, UI/UX Design Principles.</p>

    `,
    description2: ``
  },
    { id: 3, src: '/images/mini/atonato.jpg', alt: 'Logo 3', 
      title: 'NATO Interactive Quiz',
      description: `
      <p><strong>Project:</strong> Personell Tactical Training Quiz</p>
      <p><strong>Role:</strong> Coder</p>
      <p><strong>Technologies:</strong> javascript</p>
      <p>Created multiple-choice quiz for NATO ISAF Personell.</p>
    `,
    description2: ``
  },
    { id: 4, src: '/images/mini/audi.jpg', alt: 'Logo 4', 
      title: 'Audi Nuremberg & Audi Middle East',
      clientText: `Planstand`,
      clientLogo: '/images/agencies/planstand_logo.png',
      clientLogoHeight: 25,
      description: `
      <p><strong>Project:</strong> Cinema Screen Motion Design<br>
      <strong>Role:</strong> Visual Concept, Solo Motion Design, Rendering<br>
      <strong>Tech:</strong> After Effects, Photoshop<br>
      Created 11 minute Backdrop film for a stage presentation at VIP Event Q5 Unveiling Ceremony in Nuremburg Germany</p>

      <p><strong>Project:</strong> Online Animation<br>
      <strong>Role:</strong> Visual Concept, Solo Motion Design<br>
      <strong>Tech:</strong> javascript<br>
      Created an intro film for Audi Middle East Official Website</p>
    `,
    description2: ``
  },
    { id: 5, src: '/images/mini/automerc.jpg', alt: 'Logo 5', 
      title: 'Daimler Benz',
      clientText: `Sieber & Wolff`,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
      description: `
      <p><strong>Project 1:</strong> Dealership Award Concept<br>
      <strong>Role:</strong> Product Design, Animation, Concept<br>

      <p><strong>Project 2:</strong> Internal Training Program Intro Animation<br>
      <strong>Role:</strong> Concept, Animation, Render<br>

      <p><strong>Tech:</strong> After Effects, Cinema4D, Corona Render Engine</p>

    `,
    description2: ``
  },
    { id: 6, src: '/images/mini/bmw.jpg', alt: 'Logo 6', 
      title: 'BMW Group',
      clientText: `BECC Agentur`,
      clientLogo: '/images/agencies/Becc_wht.png',
      clientLogoHeight: 45,
      description: `
      <p><strong>Project 1:</strong> Immersive 3D Campaign for BMW Global HQ<br>
      <strong>Role:</strong> Animation Concept, Motion Design, Rendering<br>
      <strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After-Effects, High-resolution render pipeline.<br>
      Translated a 2D typographic campaign into an immersive 3D animation experience for the multi-monitor video wall at BMW Group's global headquarters in Munich. Conceptualized, designed, and rendered in Cinema4D to create a dynamic, large-scale brand statement for their most important audience.</p>

      <p><strong>Project 2:</strong> Global Website Animation Style Guide<br>
      <strong>Role:</strong> Animation Designer and Developer<br>
      <strong>Tech:</strong> GSAP<br>
       Developed and prototyped the core animation library and interactive prototypes (using GSAP) for BMW's global web presence. My solutions were formally adopted into the brand's official style guide, setting the standard for interactive motion design across BMW's international web properties. </p>
    `,
    description2: ``
  },
    { id: 7, src: '/images/mini/autotoyota.jpg', alt: 'Logo 7', 
      title: 'Toyota at the International Motor Show, Frankfurt',
      clientText: `BECC Agentur`,
      clientLogo: '/images/agencies/Becc_wht.png',
      clientLogoHeight: 45,
      description: `
      <p><strong>Project :</strong> Immersive 3D Animation Concept for Gigantic Screen<br>
      <strong>Role:</strong> Animation Concept, Motion Design<br>
      <strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After-Effects, High-resolution render pipeline.<br>
      Translated a 2D campaign illustration into an immersive 2D / 3D animation experience for the enormous video wall at the International Automobile Trade Fair in Frankfurt. Conceptualized, designed, and rendered in Cinema4D to create a dynamic, large-scale brand statement for their most important show of the year.</p>

      <p><strong>Outcome: </strong> The animation earned BECC Agency their first ever mention in an industry news publication and blew the heads off of audiences attending from around the globe.<br>
      <strong>Role:</strong> Animation Concept Designer and Motion Developer<br>
      <strong>Tech:</strong> After Effects, Red Giant<br>
       </p>
    `,
    description2: ``
  },
    { id: 8, src: '/images/mini/autoTuv.jpg', alt: 'Logo 8', 
      title: 'TUV Sued',
      clientText: `Sieber & Wolff`,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
      description: `
      <p><strong>Project:</strong> Automobile Safety Rating Institution Presentation<br>
      <strong>Role:</strong> Design, 3D Animation, Concept<br>

      <p><strong>Project 2:</strong> Internal B2B Strategy Presentation<br>
      <strong>Role:</strong> Concept, Animation, Render<br>

      <p><strong>Tech:</strong> After Effects, Stardust, Cinema4D, Corona Render Engine</p>

    `,
    description2: ``
  },
    { id: 9, src: '/images/mini/rb.jpg', alt: 'Logo 9' },
    { id: 10, src: '/images/mini/spiegel.jpg', alt: 'Logo 10' },
    { id: 11, src: '/images/mini/pro7.jpg', alt: 'Logo 11' },
    { id: 12, src: '/images/mini/sburda.jpg', alt: 'Logo 12' },
    { id: 13, src: '/images/mini/fsecure.jpg', alt: 'Logo 13' },
    { id: 14, src: '/images/mini/swisscom.jpg', alt: 'Logo 14' },
    { id: 15, src: '/images/mini/ds.jpg', alt: 'Logo 15' },
    { id: 16, src: '/images/mini/siemens.jpg', alt: 'Logo 16' },
    { id: 17, src: '/images/mini/hp.jpg', alt: 'Logo 17' },
    { id: 18, src: '/images/mini/strellson.jpg', alt: 'Logo 18' },
     { id: 19, src: '/images/mini/twenty.jpg', alt: 'Logo 19' },
    { id: 20, src: '/images/mini/universal.jpg', alt: 'Logo 20' },
    { id: 21, src: '/images/mini/wb.jpg', alt: 'Logo 21' },
  ];

  return (
    <div className={styles.logoContainer}>
      {logos.map((logo) => (
        <div 
          key={logo.id} 
          className={styles.logoCard}
          onClick={() => setSelectedLogo(logo)}
        >
          <div className={styles.logoWrapper}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={150}
              className={styles.logoImage}
            />
          </div>
        </div>
      ))}
      <LogoModal 
        logo={selectedLogo} 
        onClose={() => setSelectedLogo(null)} 
      />
    </div>
  );
};
export default LogoCard;