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
          <span className={styles.clientText}>{logo.clientText || ''}</span>
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
      clientText: `VRPE`,
      clientLogo: '/images/agencies/vrpe_logoNew.png',
      clientLogoHeight: 15,
      description: `
      <p>Delivered two flagship digital experiences for a global aerospace leader:<br> <br> 
      <strong>1)</strong> An immersive multi-monitor 3D visualization for their Paris Airshow exhibition.<br>
      <strong>2)</strong> A dynamic, interactive corporate presentation tool deployed for global stakeholder meetings. Owned concept, design, animation, and development.</p>

      <p><strong>Role:</strong> As the lead designer and developer, I was entrusted with creating both experiences from concept to delivery—handling visual design, 3D animation, motion graphics, and interactive coding.</p>
      <p><strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After-Effects, High-resolution render pipeline, javascript</p>
    `,
    description2: ``
  },
    { id: 2, src: '/images/mini/airbus.jpg', alt: 'Logo 2', 
      title: 'Defining the Digital Frontier for Airbus Group',
      clientText: `SMMD Team`,
      clientLogo: '/images/agencies/SMMD.png',
      clientLogoHeight: 35,
      description: `
      <p><strong>The Mission:</strong> Airbus Group required a next-generation digital interface for its most important physical spaces: its International Headquarters in Berlin and its premier Showroom in Munich. The mandate was to create an interactive, multi-sensory experiences that could communicate the complexity and ambition of aerospace innovation to VIPs, partners, and policymakers.<br><br>

      <strong>My Role:</strong> Lead Digital Experience Designer & Developer.<br>
      I was entrusted with the complete digital vision for these spaces, acting as the sole creator across four distinct installations—responsible for User Experience (UIX) strategy, visual and motion design, animation, and full-stack interactive development.<br><br>
      <strong>The Portfolio of Installations:</strong></p>

      <p><strong>1.</strong> HQ Command Center: Berlin Touchtable Interface<br>
      <strong>Challenge: </strong> Create a collaborative, data-driven tool for the heart of Airbus operations.<br>
      <strong>Solution: </strong> Designed and coded a custom multi-monitor touchtable interface (JavaScript) that allowed executives to interactively explore fleet data, global operations, and company history. This is mission-critical UIX for daily use.</p>

      <p><strong>2.</strong> Showroom Centerpiece: Munich Interactive 3D Expo Piece.<br>
      <strong>Challenge: </strong> Concept, Design, Animation, UIX Concept & Development.<br>
      <strong>Solution: </strong> Airbus Munich Showroom (Ottobrunn, Germany)</p>

      <p><strong>3. </strong> Visual Spectacles: Munich Large-Format Video Features.<br>
      <strong>Challenge:</strong> Provide awe-inspiring ambient narrative and brand moments.<br>
      <strong>Solution:</strong> Produced a suite of large-scale, multi-monitor video features. This included a complex 3D animated sequence visualizing flight dynamics across a range of products, and a stylized 2D motion graphics piece celebrating engineering milestones, both rendered in ultra-high resolution for close viewing.</p>
      <p><strong>The Outcome & Impact:</strong></p>
      <ul>
        <li><p>Helped transform two key Airbus facilities from static spaces into dynamic, technology-forward brand experiences.</p></li>
        <li><p>Helped establish a new standard for corporate engagement, merging tactile interaction with cinematic narrative.</p></li>
        <li><p>Demonstrated end-to-end mastery across the digital spectrum: from functional enterprise UIX to emotive brand spectacle.</p></li>
      </ul>
      <p><strong>Tech:</strong> JavaScript (for complex interactivity), Cinema4D, Redshift/Octane, Adobe After Effects, UI/UX Design Principles.</p>

    `,
    description2: ``
  },
    { id: 3, src: '/images/mini/atonato.jpg', alt: 'Logo 3', 
      title: 'Interactive Tactical Training Module for NATO ISAF Personnel',
      description: `
      <p><strong>The Mandate:</strong> The North Atlantic Treaty Organization (NATO) required a digital training tool for its International Security Assistance Force (ISAF) personnel. The mandate was clear: create a reliable, engaging, and instructionally sound system which reinforced critical tactical knowledge and decision-making protocols in high-stakes environments.</p>
      <p><strong>Role:</strong> Developer & Systems Architect.<br>
      My role was to translate a large complex set of military procedures into a flawless, user-driven digital experience and to ensure the system was properly evaluating the user&apos;s responses.</p>
      <p><strong>Solution:</strong> A Decision-Force-Multiplication Tool<br>
      This was not a simple quiz. It was a scenario-based training application built with vanilla JavaScript and drawing on a huge dataset of questions and answers, then it spit out a final score. It featured:
      <ul>
        <li><p>A dynamic multiple-choice system presenting realistic, branching tactical scenarios.</p></li>
        <li><p>Detailed feedback mechanisms to reinforce correct NATO procedures.</p></li>
        <li><p>A robust results-tracking framework to measure comprehension.</p></li>
        </ul>
    </p>
    <p><strong>Outcome:</strong> The module was deployed as part of NATO ISAF training curriculum, directly contributing to the operational readiness of personnel in the field. It demonstrated my ability to execute with precision on projects where there is zero margin for error.</p>
    
      <p><strong>Technologies:</strong> JavaScript, XML, HTML5, CSS3</p>

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
      title: 'Mercedes-Benz Product Design & Visual Development',
      clientText: `Sieber & Wolff`,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
      description: `
      <p><strong>1) Product Design: </strong> A Next-Generation Brand Award for Mercedes-Benz Dealerships</</p>
      <p><strong>Context:</strong> Mercedes-Benz (Daimler AG) sought to reinvent its prestigious annual dealership award—a symbolic object representing the pinnacle of brand partnership and excellence. The mandate was to evolve a traditional award trophy into a modern brand statement that reflected Mercedes-Benz core identity and forward-looking vision.<br>
      <strong>My Role:</strong> Concept Designer & Creative Lead<br>
      I was tasked with leading the creative reinvention of this key brand artifact, responsible for the overarching concept, product design, and visual animation of the proposal.<br>

      <strong>Tech:</strong> Cinema4D, AutoCAD, After Effects, Corona Render Engine</p><br><br>

      <p><strong>2) Logo Animation: </strong> Logo Animation for Mercedes-Benz: Procat</p>
       <p><strong>Context:</strong> To maintain its global premium standard, Mercedes-Benz (Daimler AG) requires consistently high-quality visual assets for internal communications, from product documentation to employee training.<br>
      <strong>The Project:</strong> 3D Animation for their Internal Product Catalog<br>
      <strong>The Brief:</strong> Create clear, engaging 3D animations as an opening title sequence featuring the logo of an internal, global product catalog used by engineering, sales, and marketing teams.<br>

      <strong>Role:</strong> Technical Concept, 3D Animator, Renderer<br>

      <strong>The Work:</strong> Developed a series of visual concepts and refined the chosen variation.<br>
      <p><strong>Tech:</strong> After Effects, Superluminal Stardust, Adobe Illustrator</p>

    `,
    description2: ``
  },
    { id: 6, src: '/images/mini/bmw.jpg', alt: 'Logo 6', 
      title: 'BMW Group',
      clientText: `BECC Agentur`,
      clientLogo: '/images/agencies/Becc_wht.png',
      clientLogoHeight: 45,
      description: `
      <p><strong>Project 1:</strong> Immersive 3D Campaign for BMW Global Headquarters<br>
      <strong>Role:</strong> Animation Concept, Motion Design, Rendering<br>
      <strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After-Effects, High-resolution render pipeline.<br>
      <strong>Outcome: </strong>Translated a 2D typographic campaign into an immersive 3D animation experience for the multi-monitor video wall at BMW Group global headquarters in Munich. Conceptualized, designed, and rendered in Cinema4D to create a dynamic, large-scale brand statement for their most important audience.</p><br><br>

      <p><strong>Project 2:</strong> Global Web Animation Style Guide for BMW.com"<br>
      <strong>Role:</strong> Animation Designer and Developer<br>
      <strong>Tech:</strong> GSAP (The Acclaimed, Crossbrowser 'GreenSock Animation Platform') <br>
      <strong>Outcome: </strong> Developed and prototyped the core animation library and interactive prototypes for BMW global web presence. My solutions were formally adopted into the brand official style guide, which sets the standard for premium, performant motion, establishing the technical benchmark across BMW international web properties. </p><br>

      <p><strong>Project 3:</strong> Narrative Films for the BMW Global Rebranding<br>
      <strong>Role:</strong> Video Editor, Author, Voice Recording & Voice Narration<br>
      
      <strong>Situation: </strong> The BMW Group and its creative agency (BECC) were undertaking a momentous project: redesigning the iconic global logo. This involved a highly skilled & dedicated team of strategists, designers, and executives working through an intense iterative process.<br>
      I contributed to BMW global rebranding initiative by producing internal narrative "mood videos." Tasked with editing archival footage, writing scripts, and providing voiceover, I created assets used by the core BECC/BMW team to aid the brand evolution narrative during their extensive, multi-year design process.</p>
      <p>These videos served as strategic communication aids, designed to:</p>
        <ul>
        <li><p>Give visual and narrative form to brand concepts being debated.</p></li>

        <li><p>Build consensus among key decision-makers by framing the change within a compelling brand journey.</p></li>

         <li><p>Demonstrate the new logo application and acceptance in various brand contexts.</p></li>
        </ul>

        <p><strong>Tech:</strong> Adobe Premiere, Adobe After Effects, Garageband<br>
        <strong>Outcome: </strong>The videos were well-received by the team (especially the voiceover!) and were integrated into their workflow as part of the vast ecosystem of materials supporting the historic redesign. </p>
    `,
    description2: ``
  },
    { id: 7, src: '/images/mini/autotoyota.jpg', alt: 'Logo 7', 
      title: 'Toyota at the International Motor Show, Frankfurt (IAA)',
      clientText: `BECC Agentur`,
      clientLogo: '/images/agencies/Becc_wht.png',
      clientLogoHeight: 45,
      description: `
      <p><strong>Project 1:</strong> Immersive 3D Animation Concept for Gigantic Screen<br>
      <strong>Role:</strong> Animation Concept, Motion Design<br>
      <strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After-Effects, High-resolution render pipeline.<br>
      Translated a 2D campaign illustration into an immersive 2D / 3D animation experience for the enormous video wall at the International Automobile Trade Fair in Frankfurt. Conceptualized, designed, and rendered in Cinema4D to create a dynamic, large-scale brand statement for their most important show of the year.</p>

      <p><strong>Outcome: </strong> The animation earned BECC Agency their first ever mention in an industry news publication and blew the heads off of audiences attending from around the globe.<br>
      <strong>Role:</strong> Animation Concept Designer and Motion Developer<br>
      <strong>Tech:</strong> After Effects, Red Giant</p>
    `,
    description2: ``
  },
    { id: 8, src: '/images/mini/autoTuv.jpg', alt: 'Logo 8', 
      title: 'Visualizing Safety & Strategy for a Global Certification Leader',
      clientText: `TÜV SÜD (via Sieber & Wolff Agency)`,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
      description: `
      <p><strong>Project:</strong> Animation Library for National Safety & Strategy Presentation<br>
      TÜV SÜD is a world leading technical service provider, specializing in testing, certification, auditing, and advisory services with a core focus on safety and security. Their reputation is built on uncompromising accuracy and trust.<br>

       <strong>My Role:</strong> 3D Animation Specialist & Motion Designer.<br>
       <strong>Action:</strong>3D Animation Specialist. I was brought in to execute the core visual storytelling. My task was to translate complex safety testing concepts—such as crash dynamics and component integrity—into abstract, clear, and engaging 3D motion sequences using Cinema4D, Corona Render Engine, After Effects and Superluminal Stardust.
        <ul>
        <li><p><strong>The Ask:</strong> Produce a comprehensive library of 3D and motion graphic animations to serve as the visual core for a high-stakes, global presentation on automobile safety ratings and corporate strategy.</p></li>
        <li><p><strong>My Role:</strong> Lead Animator & Motion Designer – responsible for concept, creation, and final render of all motion assets.</p></li>
        <li><p><strong>The Work:</strong> I brainstormed, storyboarded, and executed approximately <strong>40 distinct animation sequences</strong>. These ranged from photorealistic 3D visualizations of crash-test scenarios and component integrity (Cinema4D, Corona) to abstract, data-driven motion graphics explaining complex business concepts (After Effects, Stardust).</p></li>
        <li><p><strong>The Delivery:</strong> The client integrated a curated selection of <strong>18 final animations</strong> into their presentation framework, using the assets as dynamic modules to build their narrative.</p></li>
        <li><p><strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After Effects, Superluminal Stardust.</p></li>
        </ul>

<p><strong>Outcome:</strong> Provided a robust, flexible animation toolkit that elevated TÜV SÜD&apos;s communication, allowing them to explain intricate technical and strategic topics with clarity, authority, and visual impact.</p>

    `,
    description2: ``
  },
    { id: 9, src: '/images/mini/rb.jpg', alt: 'Red Bull TV', 
       title: 'Red Bull Austria: Early Digital Experiences for a Media Pioneer',
      clientText: `Red Bull Austria`,
      clientLogo: '/images/agencies/redBull.png',
      clientLogoHeight: 25,
      description: `
      <p><strong>The Client & Era:</strong> In the mid-2000s, Red Bull was transitioning from an energy drink company into a global media powerhouse and culture brand. Their digital presence needed to match their high-octane, experiential identity.</p>
      <p><strong>My Role: </strong> Lead Interactive Designer & Developer<br>
      I was entrusted with creating two flagship interactive experiences that embodied Red Bull&apos;s pioneering spirit.
     
      <p><strong>Project 1:</strong> Interactive Video Carousel, www.redbull.tv<br>
      <strong>The Brief: </strong>Develop the Interactive Video Carousel for the launch of the www.redbull.tv platform—a key piece of their strategy to become a leading action sports and lifestyle broadcaster.<br>

      <strong>Tech: </strong> Macromedia Flash, ActionScript 3<br>
      <p><strong>The Outcome & Legacy:</strong> These projects were built at the inception of Red Bull&apos;s digital media empire. They demonstrated an early mastery of interactive storytelling and platform design for a brand that would become synonymous with cutting-edge content.<br>
      <strong>Role:</strong> Sole Developer<br>

      <p><strong>Project 2:</strong> Strategic Internal Hub for Red Bull’s Digital Media Launch<br>
      n 2007, Red Bull was aggressively expanding from a beverage brand into a global media powerhouse. To align its internal teams at its Fuschl am See headquarters, they needed a central platform to communicate this new strategic direction.<br>
      <strong>My Role: </strong>Sole Designer & Developer<br>
        I was entrusted with creating the digital centerpiece for this internal shift—an interactive intranet experience that would define and showcase Red Bull’s emerging digital media strategy.
      <p><strong>Tech:</strong> Macromedia Flash, Adobe Suite</p>

    `,
    description2: `` 
   },
    { id: 10, src: '/images/mini/spiegel.jpg', alt: 'Spiegel TV', 
       title: ' Digital Brand Architect for Spiegel TV Channels',
      clientText: `Spiegel TV (Der Spiegel Media Group / Autentic GmbH)`,
      clientLogo: '/images/agencies/spiegeltvlogo.png',
      clientLogoHeight: 25,
      description: `
      <p><strong>Overview:</strong> Led the complete digital design and development for two flagship pay-TV channels: Spiegel Wissen (science) and Spiegel Geschichte (history), from strategic consultation to interactive execution.</p>

      <p><strong>Project 1: Spiegel Wissen / The Curiosity Channel</strong></p>
      <ul>
      <li><p><strong>Phase 1 – Strategic Design Consultation:</strong>  Partnered directly with the Channel Manager to audit and evaluate on-air visual identities from Germany's top design agencies, advising on the strategic selection of the channel's core visual identity.</p></li>

      <li><p><strong>Phase 2 – Website Build:</strong> As the <strong>Sole Developer & Animator</strong>, I translated the approved broadcast design into a fully interactive, official website, ensuring a seamless brand experience from TV to web. </p></li>
      
      </ul>

      <p><strong>Project 2: Spiegel Geschichte (History Channel)</strong></p>

        <ul>
      <li><p><strong>Full-Spectrum Ownership:</strong>  As the Lead Designer, Programmer & UX Architect, I was responsible for the channel's complete online presence—designing and building its official website from concept to launch.</p></li>

      <li><p><strong>B2B Interactive Presentation:</strong> Additionally, I created a large-format, interactive presentation for a cinema-screen shareholder event, serving as the Sole Designer, Programmer, and Animator. </p></li>
      
      </ul>

      <p><strong>Impact:</strong> Delivered the definitive digital homes for two major Spiegel TV brands, blending strategic media insight with hands-on design and technical execution.</p>







    `,
    description2: `` 
   },
    { id: 11, src: '/images/mini/pro7.jpg', alt: 'Logo 11', 
       title: 'Empty',
      clientText: `Pro7Sat1`,
      clientLogo: '/images/agencies/pro7.png',
      clientLogoHeight: 25,
        description: `
      <p><strong>Project 1:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 2:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 3:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 4:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Tech:</strong> </p>

    `,
    description2: `` 
   },
    { id: 12, src: '/images/mini/sburda.jpg', alt: 'Logo 12', 
       title: 'Empty',
      clientText: `Empty`,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
 description: `
      <p><strong>Project 1:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 2:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 3:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 4:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Tech:</strong> </p>

    `,
    description2: `` 
   },
    { id: 13, src: '/images/mini/fsecure.jpg', alt: 'Logo 13' , 
       title: 'Empty',
      clientText: `Empty`,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
 description: `
      <p><strong>Project 1:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 2:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 3:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 4:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Tech:</strong> </p>

    `,
    description2: `` 
   },
    { id: 14, src: '/images/mini/swisscom.jpg', alt: 'Logo 14' , 
       title: 'Empty',
      clientText: `Empty`,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
 description: `
      <p><strong>Project 1:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 2:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 3:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Project 4:</strong> <br>
      <strong>Role:</strong> <br>

      <p><strong>Tech:</strong> </p>

    `,
    description2: `` 
   },
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