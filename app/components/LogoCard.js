'use client';

// app/components/LogoCard.js
import { useRef } from 'react';
import Image from 'next/image';
import { useModal } from './ModalContext';
import DOMPurify from 'dompurify';
import '@mux/mux-player';
import styles from '../css/LogoCard.module.css';

const LogoCard = () => {
  const { openModal } = useModal();
  
  // Helper function to render HTML
const createMarkup = (html) => {
  return { 
    __html: DOMPurify.sanitize(html, {
      ADD_TAGS: ['mux-player'],
      ADD_ATTR: ['playback-id', 'metadata-video-title', 'metadata-viewer-user-id']
    }) 
  };
};
  
  const handleLogoClick = (logo) => {
    openModal(
      
        <div className={styles.scrollableContent}>
        <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{logo.title || logo.alt}</h3>
        </div>
        {/* Client Info Section */}
        <div className={styles.clientInfo}>
          <span  className={styles.clientText}>{logo.clientText || ''}</span>
         
          {logo.agencyLink && (
            <a 
              href={logo.agencyLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.agencyLink}
              onClick={(e) => e.stopPropagation()}
            >
              {logo.agencyName}
            </a>
          )}
           {logo.clientLogo && (
            <div 
              className={styles.clientLogo}
              style={logo.clientLogoHeight ? { '--logo-height': `${logo.clientLogoHeight}px` } : {}}
            >  |  &nbsp;  &nbsp; &nbsp; 
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
          {logo.description && (
            <div 
              className={styles.modalDescription}
              dangerouslySetInnerHTML={createMarkup(logo.description)}
            />
          )}
            {logo.video && (
              <div style={{ 
                width: '100%', 
                height: '100%',
                maxWidth: logo.id === 18 ? '600px' : '100%',
                maxHeight: logo.id === 18 ? '500px' : '100%',
                aspectRatio: logo.id === 18 ? '5/4' : '16/9',
                maxWidth: logo.id === 1 ? '100%' : '100%', 
                maxHeight: logo.id === 1 ? '240px' : '100%',
                overflow: 'hidden',
                borderRadius: '8px',
                position: 'relative'
              }}>
                <mux-player
                  playback-id={logo.video.playbackId}
                  poster={logo.video.thumbnail}
                  metadata-video-title={logo.video.title}
                  metadata-viewer-user-id={logo.video.userId}
                  accent-color={logo.video.accentColor}
                  primary-color={logo.video.primaryColor}
                  secondary-color={logo.video.secondaryColor}
                  no-analytics={true}
                  autoplay={false}
                  controls-list={logo.id === 18 ? 'nodownload' : 'nodownload'}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    transform: logo.id === 18 ? 'scale(1.0)' : 'none',
                    objectFit: 'cover'
                  }}
                  controls={logo.id === 18 ? false : true}
                  muted={logo.id === 18 ? false : false}
                  loop={logo.id === 18 ? true : false}
                />
              </div>
            )}
          {logo.description2 && (
            <div 
    className={`${styles.modalDescription} ${styles.secondaryDescription}`}
        dangerouslySetInnerHTML={createMarkup(logo.description2)}
            />
          )}
        </div>
      </div>
    );
  };

  const logos = [
    { id: 1, src: '/images/mini/airbus.jpg', alt: 'Logo 2', 
      title: 'Airbus Group Digital Interfaces',
      clientText: `Agency:`,
      clientLogo: '/images/agencies/SMMD.png',
      clientLogoHeight: 35,
      agencyName: 'SMMD Team',
      agencyLink: 'https://www.smmd.team',
       video: {
        playbackId: '8UuN9JNltg9BwDO1SAAbvKn6vyq2u7vdgwScfVXLUk8',
        title: 'MTU Aero Engines',
        userId: 'user-id-007',
        accentColor: 'transparent',
        primaryColor: '#82a7b3',
        secondaryColor: 'transparent',
        thumbnail: 'https://image.mux.com/8UuN9JNltg9BwDO1SAAbvKn6vyq2u7vdgwScfVXLUk8/thumbnail.png?width=214&height=121&time=10'
      },
      description: `
      <p><strong>The Mission:</strong> Airbus Group required a next-generation digital interface for its most important spaces: its International Headquarters in Berlin and its premier Showroom in Munich. The mandate was to create interactive, multi-sensory experiences that could communicate the complexity and ambition of aerospace innovation to VIPs, partners, and policymakers.</p>

      <p><strong>My Role:</strong> Lead Digital Experience Designer & Developer.</p>
      <p>I was entrusted with the complete digital vision for these experiences, acting as the sole creator across four distinct installations—responsible for User Experience (UIX) strategy, visual and motion design, animation, and full-stack interactive development.</p>
        <p><strong>Tech:</strong> GSAP, JavaScript, Cinema4D, Octane, Adobe After Effects, UI/UX Gestalt Design Principles.</p><br><br>

      <p style="margin-top: 3rem;"><strong>1.</strong> HQ Command Center: Berlin Touchtable Interface<br>
      <p><strong>Challenge: </strong> Create a collaborative, data-driven tool for the heart of Airbus operations.</p>
      <p><strong>Solution: </strong> Designed and coded a custom multi-monitor touchtable interface that allowed executives to interactively explore fleet data, global operations, and company history. This is mission-critical UIX for daily use.</p><br>

      <img src="/images/airbus_berlin/table6.jpg" alt="Airbus Munich Showroom" style="width: 100%; margin: 1rem 0; border-radius: 8px;" />

    


      
    `,
    description2: `
    <p style="margin-top: 3rem;"><strong>2. </strong> Visual Spectacles: Munich Large-Format Video Features.<br>
      <strong>Challenge:</strong> Provide awe-inspiring ambient narrative and brand moments.<br>
      <strong>Solution:</strong> Produced a suite of large-scale, multi-monitor video features. This included a complex 3D animated sequence visualizing flight dynamics across a range of products, and a stylized 2D motion graphics piece celebrating engineering milestones, both rendered in ultra-high resolution for close viewing.</p><br>
        <img src="/images/airbus_ottobrunn/video/1C.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
      <p><strong>The Outcome & Impact:</strong></p>
      <ul>
        <li><p>Instrumental in transforming two key Airbus facilities from static spaces into dynamic, technology-forward brand experiences that enabled distinguished visitors to feel the Full Bandwidth of Big-League Aerospace Corporations.</p></li>
        <li><p>Helped establish a new standard for corporate engagement, merging tactile interaction with cinematic narrative.</p></li>
        <li><p>Demonstrated end-to-end mastery across the digital spectrum: from functional enterprise UIX to emotive brand spectacle.</p></li>
        <li><p>Translated Airbus's engineering marvel into visceral, interactive experiences that made corporate vision tangible for VIPs and decision-makers.</p></li>
        
    
      </ul>
`
  },   
 
        {   id: 2,
           src: '/images/mini/airbus.jpg', alt: 'Logo 2', 
      title: 'Airbus Group Digital Interfaces',
      clientText: `Agency:   VRPE`,
      clientText: `Agency:   VRPE`,
      clientLogo: '/images/agencies/vrpe_logoNew.png',
      clientLogoHeight: 15,
      agencyName: 'VRPE',
      description: `
  <p style="margin-top: 3rem;"><strong>2.</strong> Showroom Centerpiece: Munich Interactive 3D Expo Piece.</p><br>
      <p><strong>Challenge: </strong> Create the interface for a dynamic installation that showcases selected Airbus technology for visitors to the Munich based Airbus Showroom, a 650 square meter space featuring many installation pieces.<br>
      <strong>Solution: </strong> Airbus Munich Showroom (Ottobrunn, Germany)</p><br>
      <P><strong>Challenge: </strong> Concept, Design, Animation, UIX Concept & Development.</p><br>

     <img src="/images/airbus_ottobrunn/airbus_18B.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
    `,
    description2: ``
  },   
        {   id: 3, src: '/images/mini/aeromtu.jpg', 
        alt: 'Logo 1', 
        title: 'Digital Experiences for MTU Aero Engines',
        
      clientText: `Agency:   VRPE`,
      clientLogo: '/images/agencies/vrpe_logoNew.png',
      clientLogoHeight: 15,
      agencyName: 'VRPE',
      description: `
      <p>Delivered two flagship digital experiences for a global aerospace leader:<br> <br> 
      <strong>1)</strong> An immersive multi-monitor 3D visualization for their Paris Airshow exhibition.<br>
      <strong>2)</strong> A dynamic, interactive corporate presentation tool deployed for global stakeholder meetings. Owned concept, design, animation, and development.</p><br>

      <p><strong>Role:</strong> As the Lead Experience Designer and Developer, I was entrusted with creating both experiences from concept to delivery—handling visual design, 3D animation, motion graphics, and interactive coding.</p><br>
      <p><strong>Outcome:</strong> The Airshow visualization delivered a competitive show-floor advantage that commanded attention, driving executive engagement. The presentation tool was adopted as a strategic asset that traveled the world, consistently elevating their brand for business development across the globe.</p><br>
      <p><strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After-Effects, High-resolution render pipeline, javascript</p>

      <img src="/images/mtu1.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
      <img src="/images/mtu6.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />

    `,
     video: {
        playbackId: 'SnN00m01uyBae8LPAZuNlKXY5nzn01ELE600rh1lA98lKf8',
        title: 'MTU Aero Engines',
        userId: 'user-id-007',
        accentColor: 'transparent',
        primaryColor: '#82a7b3',
        secondaryColor: 'transparent',
        thumbnail: 'https://image.mux.com/SnN00m01uyBae8LPAZuNlKXY5nzn01ELE600rh1lA98lKf8/thumbnail.png?width=214&height=121&time=4'
      },
    description2: `      
    <img src="/images/mtu2.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
`
  },            
    { id: 4, src: '/images/mini/audi.jpg', alt: 'Logo 4', 
      title: 'Audi Nuremberg & Audi Middle East',
      clientText: `Agency:`,
      clientLogo: '/images/agencies/planstand_logo.png',
      clientLogoHeight: 25,
      agencyName: 'Planstand Gmbh',
      agencyLink: 'https://www.planstand.com',
      description: `
      <p><strong>Project:</strong> Cinema Screen Motion Design<br>
      <strong>Role:</strong> Visual Narrative Strategy, Solo Motion Design, Rendering<br>
      <strong>Tech:</strong> After Effects, Photoshop<br>
      Created 11 minute Backdrop film for a stage presentation at the Q5 Unveiling Ceremony in Nuremburg Germany, a VIP Event. Needed to be choreographed in time with professional dancers and a large electronically actuated on-stage water sprinkler system. I had three weeks to animate it, make it fit choreographicallly. It worked beautifully. </p><br>
      <p><strong>Strategic Impact:</strong> Transformed VIP brand engagement, elevating corporate storytelling from passive to participatory. Boris Becker was fist pumping and whooping at my animation. The entire elite crowd went wild as lightning and thunder rolled to a visceral on-screen culmination.</p><br>
       <img src="/images/audi_1.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />

      <p style="margin-top: 3rem;"><strong>Project:</strong> Online Animation<br>
      <strong>Role:</strong> Lead Visual Concept Engineer, Solo Motion Design<br>
      <strong>Tech:</strong> javascript<br>
      Created an intro film for Audi Middle East Official Website. This one wasn't for Planstand, it was for Mario Klingemann, but I'll just add it to this Audi section.</p>

            
    `,
    description2: ``
  },
    { id: 5, src: '/images/mini/automerc4.jpg', alt: 'Logo 5', 
      title: 'Mercedes-Benz Product Design & Visual Development',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
      agencyName: 'Sieber & Wolff',
      agencyLink: 'https://www.sieberundwolf.de/',
      description: `
      <p style="margin-top: 3rem;"><strong>1) Product Design: </strong> A Next-Generation Brand Award for Mercedes-Benz Dealerships</</p><br><br>
      <p><strong>Context:</strong> Mercedes-Benz (Daimler AG) sought to reinvent its prestigious annual dealership award—a symbolic object representing the pinnacle of brand partnership and excellence. The mandate was to evolve a traditional award trophy into a modern brand statement that reflected Mercedes-Benz core identity and forward-looking vision.</p>
      <p><strong>My Role:</strong> Creative Director & Design Lead</p>
      <p><strong>The Work:</strong>I was entrusted with the complete creative reinvention of this key brand artifact, responsible for the overarching strategy, product design, detailed technical architecture, and cinematic presentation of the proposal.</p>
      <p><strong>Tech:</strong> Cinema4D, AutoCAD, After Effects, Corona Render Engine</p><br><br><br>

      
             <img src="/images/throwable/merc4.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
                <img src="/images/throwable/merc66.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />

      <p style="margin-top: 5rem;"><strong>2) Logo Animation: </strong> Logo Animation for Mercedes-Benz: Procat, an internal Product Catalog</p><br>
       <p><strong>Context:</strong> To maintain its global premium standard, Mercedes-Benz (Daimler AG) requires consistently high-quality visual assets for internal communications, from product documentation to employee training.</p>
      <p><strong>The Brief:</strong> Create clear, engaging 3D animations as an opening title sequence featuring the logo of an internal, global product catalog used by engineering, sales, and marketing teams.</p>
      <p><strong>My Role:</strong> Solo Technical Concept, Solo 3D Animator, Solo Renderer</p>
      <p><strong>The Work:</strong> Developed a series of visual concepts and refined the chosen variation.</p>
      <p><strong>Tech:</strong> After Effects, Superluminal Stardust, Adobe Illustrator</p>
           <img src="/images/mercedes1.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
    `,
    description2: ``
  },
    { id: 6, src: '/images/mini/bmw.jpg', alt: 'Logo 6', 
      title: 'BMW Group',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/Becc_wht.png',
      clientLogoHeight: 45,
      agencyName: 'BECC Agency',
      agencyLink: 'https://www.becc-agency.com',
      description: `

            <p><strong>Project 1:</strong> Narrative Films for the BMW Global Rebranding<br>
      <strong>Role:</strong> Internal Storyteller & Consensus Architect, Narration Author, Voice Recording & Voice Narration<br>

      <p><strong>Situation: </strong> The BMW Group and its creative agency (BECC) were undertaking a momentous project: redesigning the iconic global logo. This involved a highly skilled & dedicated team of strategists, designers, and executives working through an intense iterative process.</p>
      <p><strong>The Work:</strong> I contributed to the internationally recognized Red Dot Award winning BMW global rebranding initiative by producing internal narrative "mood videos." Tasked with editing archival footage, writing scripts, and providing voiceover, I created assets used by the core BECC/BMW team to aid the brand evolution narrative during their extensive, multi-year design process.</p><br>
      <p>These videos served as strategic communication aids, designed to:</p><br>
        <ul>
        <li><p>Give visual and narrative form to brand concepts being debated.</p></li>
        <li><p>Build consensus among key decision-makers by framing the change within a compelling brand journey.</p></li>
         <li><p>Demonstrate the new logo & branding's application and acceptance in various real-world contexts.</p></li>
        </ul>

        <p><strong>Tech:</strong> Adobe Premiere, Adobe After Effects, Garageband<br>
        <strong>Outcome: </strong>The videos were well-received by the team (especially the voiceover!) and were integrated into their workflow as part of the vast ecosystem of materials supporting the historic redesign.</p><br>

      
              <img src="/images/BMW1.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
      <p><strong>Project 2:</strong> Global Web Animation Language for BMW.com's Style Guide<br>
      <strong>Role:</strong> Motion Systems Architect<br>
      <strong>Tech:</strong> GSAP (The Acclaimed, Crossbrowser 'GreenSock Animation Platform'), rapid prototyping, systems thinking.<br>
      <strong>Outcome: </strong> Developed and prototyped the core animation library and interactive prototypes for the BMW global web presence. My solutions were formally adopted into the brand official style guide, which sets the standard for premium, performant motion, establishing the technical benchmark across BMW international web properties. Proving that decisive creative vision (and 15 years experience with the right tools) delivers scalable systems, not just one-off animations.</p><br>

      <p><strong>Project 3:</strong> Immersive 3D Campaign for BMW Global Headquarters<br>
      <p><strong>Role:</strong> 3D Experience Director / Animation Concept / Motion Design /&nbsp;Rendering</p>
      <p><strong>Outcome: </strong>Translated an existing 2D typographic campaign into a commanding environmental experience for the multi-monitor video wall at for BMW's nerve center, their global headquarters in Munich. Conceptualized, designed, and rendered in Cinema4D to create a dynamic, large-scale brand statement a dynamic brand monument visible to every executive and visitor.</p>
      <p><strong>Tech:</strong> Cinema4D, Corona Render, After Effects, High-res pipeline.</p><br><br>




    `,
    description2: ``
  },
    { id: 7, src: '/images/mini/autotoyota.jpg', alt: 'Logo 7', 
      title: 'Toyota at the International Motor Show, Frankfurt (IAA)',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/Becc_wht.png',
      clientLogoHeight: 45,
      agencyName: 'BECC Agency',
      agencyLink: 'https://www.becc-agency.com',
      description: `
      <p><strong>Project:</strong> Immersive 3D Animation Concept for Gigantic Screen<br><br>
      <strong>Role:</strong> Animation Concept, Motion Design<br>
       Translated a 2D campaign illustration into an immersive 2D / 3D animation experience for the enormous video wall at the International Automobile Trade Fair in Frankfurt. Conceptualized, designed, and rendered in Cinema4D to create a dynamic, large-scale brand statement for their most important show of the year.</p><br>
     <p><strong>Tech:</strong> Cinema4D, Corona Render Engine, Adobe After-Effects, High-resolution render pipeline.</p><br>
     

      <p><strong>Outcome: </strong> The animation earned BECC Agency their first ever mention in an industry news publication and blew the heads off of audiences attending from around the globe.<br>
      <strong>Role:</strong> Animation Concept Designer and Motion Developer<br>
      <strong>Tech:</strong> After Effects, Red Giant</p>
    `,
    description2: ``
  },
    { id: 8, src: '/images/mini/autoTuv2.jpg', alt: 'Logo 8', 
      title: 'TÜV SÜD - Visualizing Safety & Strategy for a Global Certification Leader',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/sw_neu_white.png',
      clientLogoHeight: 25,
      agencyName: 'Sieber & Wolff',
      agencyLink: 'https://www.sieberundwolf.de/',
      description: `
      <p><strong>Project:</strong> Animation Library for National Safety & Strategy Presentation<br>
      TÜV SÜD is a world leading technical service provider, specializing in testing, certification, auditing, and advisory services with a core focus on safety and security. Their reputation is built on uncompromising accuracy and trust.<br><br>

       <strong>My Role:</strong> 3D Animation Specialist & Motion Designer.<br><br>
       <strong>Action:</strong>3D Animation Specialist. I was brought in to execute the core visual storytelling. My task was to translate complex safety testing concepts—such as crash dynamics and component integrity—into abstract, clear, and engaging 3D motion sequences using Cinema4D, Corona Render Engine, After Effects and Superluminal Stardust.<br><br>
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
{ id: 18, src: '/images/mini/strellson.jpg', alt: 'Logo 18' , 
      title: 'Strellson Digital Brand Atmosphere',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/coma2_logo.png',
      clientLogoHeight: 25,
      agencyName: 'coma2',
      agencyLink: 'https://www.coma2.com',
      description: `
      <p><strong>Project:</strong> Digital Brand Atmosphere for Strellson.com</p><br>
      <p><strong>Role:</strong> <strong>Motion Editor & Visual Rhythm Designer</strong></p><br>
      <p><strong>Creative Challenge:</strong> Transform raw brand footage, seasonal campaign content and a selected soundtrack into a seamless, elevated brand moment for the luxury fashion label's digital flagship.</p><br>
      <p><strong>Execution:</strong> Crafted a precise visual edit that married Strellson's aesthetic with the track's emotional cadence, creating a cinematic brand experience that felt both intentional and effortless.</p><br>
      <p><strong>Outcome:</strong> Delivered a signature motion piece that became a key visual anchor for their online presence—proving that even with limited assets, strong editorial intuition creates premium results.</p>

 
    `,
     video: {
        playbackId: 'KprssZj01q3fxYtOoimOn4VgnkvzYN802lB4W1rejQ4NM',
        title: 'Strellson1',
        userId: 'user-id-007',
        accentColor: 'transparent',
        primaryColor: '#82a7b3',
        secondaryColor: 'transparent',
        thumbnail: 'https://image.mux.com/KprssZj01q3fxYtOoimOn4VgnkvzYN802lB4W1rejQ4NM/thumbnail.png?width=214&height=121&time=0'
      },
    description2: ``
   },
    { id: 9, src: '/images/mini/spiegel.jpg', alt: 'Spiegel TV', 
       title: ' Digital Brand Architect for Spiegel TV Channels',
      clientText: `Distributor: `,
      clientLogo: '/images/agencies/spiegeltvlogo.png',
      clientLogoHeight: 25,
      agencyName: 'Autentic GmbH',
      agencyLink: 'https://www.autentic.com/117/Channels.htm',
      description: `
      <p><strong>Overview:</strong> Led the complete digital design and development for two flagship pay-TV channels 2010 - 2017: Spiegel Wissen (science) and Spiegel Geschichte (history), from strategic consultation to interactive execution.</p>

      <p><strong>Project 1: Spiegel Wissen</strong></p>
      <ul>
      <li><p><strong>Phase 1 – Strategic Design Consultation:</strong>  Partnered directly with the Channel Manager to audit and evaluate on-air visual identities from Germany's top design agencies, advising on the strategic selection of the channel's core visual identity.</p></li>

      <li><p><strong>Phase 2 – Website Build:</strong> As the <strong>Sole Developer & Animator</strong>, I translated the approved broadcast design into a fully interactive, responsive, official website, ensuring a seamless brand experience from TV to web. </p></li>
      
      </ul>
      <img src="/images/JPL3Poster_SW.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
      <p  style="margin-top: 5rem;"><strong>Project 2: Spiegel Geschichte (History Channel)</strong></p>

        <ul>
      <li><p><strong>Full-Spectrum Ownership:</strong>  As the Lead Designer, Programmer & UX Architect, I was responsible for the channel's complete online presence—designing and building its official website from concept to launch.</p></li>

      <li><p><strong>B2B Interactive Presentation:</strong> Additionally, I created a large-format, interactive presentation for a cinema-screen shareholder event, serving as the Sole Designer, Programmer, and Animator. </p></li>
      
      </ul>



      <p><strong>Impact:</strong> Delivered the definitive digital homes for two major Spiegel TV brands, blending strategic media insight with hands-on design and technical execution.</p>

        <img src="/images/SGA_1.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
        <img src="/images/SGA_2.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
        <img src="/images/SGA_3.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
    `,
    description2: `` 
   },

       { id: 10, src: '/images/mini/rb.jpg', alt: 'Red Bull TV', 
       title: 'Red Bull Austria: Early Digital Experiences for a Media Pioneer',
      clientText: `Client: `,
      clientLogo: '/images/agencies/redBull.png',
      clientLogoHeight: 25,
      agencyName: 'Red Bull Austria',
      agencyLink: 'https://www.redbull.com/',
      description: `
      <p><strong>The Client & Era:</strong> In the mid-2000s, Red Bull was transitioning from an energy drink company into a global media powerhouse and culture brand. Their digital presence needed to match their high-octane, experiential identity.</p><br>
      <p><strong>My Role: </strong> Lead Interactive Designer & Developer<br>
      I was entrusted with creating two flagship interactive experiences that embodied Red Bull&apos;s pioneering spirit.</p><br>
     
      <p><strong>Project 1:</strong> Interactive Video Carousel, www.redbull.tv<br>
      <strong>The Brief: </strong>Develop the Interactive Video Carousel for the launch of the www.redbull.tv platform—a key piece of their strategy to become a leading action sports and lifestyle broadcaster.<br>

      <strong>Tech: </strong> Macromedia Flash, ActionScript 3<br>
      <p><strong>The Outcome & Legacy:</strong> These projects were built at the inception of Red Bull&apos;s digital media empire. They demonstrated an early mastery of interactive storytelling and platform design for a brand that would become synonymous with cutting-edge content.<br>
      <strong>Role:</strong> Sole Developer<br><br>

      <p><strong>Project 2:</strong> Strategic Internal Hub for Red Bull’s Digital Media Launch<br>
      n 2007, Red Bull was aggressively expanding from a beverage brand into a global media powerhouse. To align its internal teams at its Fuschl am See headquarters, they needed a central platform to communicate this new strategic direction.<br>
      <strong>My Role: </strong>Sole Designer & Developer<br>
        I was entrusted with creating the digital centerpiece for this internal shift—an interactive intranet experience that would define and showcase Red Bull’s emerging digital media strategy.
      <p><strong>Tech:</strong> Macromedia Flash, Adobe Suite</p>
    `,
    description2: `` 
   },
    { id: 11, src: '/images/mini/pro7.jpg', alt: 'Logo 11', 
       title: 'Online Ad Campaigns',
      clientText: `Direct Client: `,
      clientLogo: '/images/agencies/pro7_small2.png',
      clientLogoHeight: 25,
      agencyName: 'Pro7Sat1',
      agencyLink: 'https://www.prosiebensat1.com/en',
        description: `
      <p><strong>Projects:</strong> Promotional Assets for Major Motion Pictures / Local TV Shows / Video Games</p><br>
    <p>Developed digital assets for advertising campaigns for theatrical releases as part of integrated on-air promotions for the Pro7Sat1 Media Group.<br></p>
     <p><strong>Role:</strong> Design, Motion, Programming<br></p>
    `,
    description2: `` 
   },
    { id: 12, src: '/images/mini/sburda.jpg', alt: 'Logo 12', 
       title: 'Burda Presentations',
      clientText: `Direct Client:`,
      clientLogo: '/images/agencies/HBM.png',
      clientLogoHeight: 45,
      agencyName: 'Burda',
      agencyLink: 'https://www.burda.com/en/',
 description: `
      <p><strong>Projects:</strong> Interactive Presentations and Internal Strategy Showcases<br></p>
      <p>Burda New Media presentations by the Marketing Manager to promote his ideas and strategies internally for various digital media initiatives.</p><br>
     <p><strong>Role:</strong> Visual Concept (CI adapted), Design, Animation, Programming<br></p>
    `,
    description2: `` 
   },
    { id: 13, src: '/images/mini/fsecure.jpg', alt: 'Logo 13' , 
       title: 'F-Secure Interactive Presentations / Video Animations',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/publicorange.png',
      clientLogoHeight: 25,
      agencyName: 'Publicorange',
      agencyLink: 'https://www.publicorange.com',
 description: `
      <p><strong>Project 1: </strong> Security Suite Interactive Presentations  <br>
      <strong>Role:</strong> Interactivity<br></p>

      <p><strong>Project 2: </strong>  Security Suite Videos <br>
      <strong>Role:</strong> Animation<br></p>
    `,
    description2: `` 
   },
    { id: 14, src: '/images/mini/swisscom.jpg', alt: 'Logo 14' , 
       title: 'Swisscom Installer Package',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/publicorange.png',
      clientLogoHeight: 25,
      agencyName: 'Publicorange',
      agencyLink: 'https://www.publicorange.com',
      description: `
      <p><strong>Project:</strong> An installer package that opened up a setup-wizard for Swisscoms Online Access<br></p>
      <p><strong>Initiative:</strong> Customer onboarding software suite.</p>
      <p><strong>Value:</strong> Reduced customer setup friction and provided a branded, guided first touchpoint with the service.</p>
      <p><strong>Role:</strong>  Design, Programming<br></p>
    `,
    description2: `` 
   },
    { id: 15, src: '/images/mini/ds.jpg', alt: 'Logo 15',
      title: 'Teaser Website For a Videogame',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/publicorange.png',
      clientLogoHeight: 25,
      agencyName: 'Publicorange',
      agencyLink: 'https://www.publicorange.com',
 description: `
      <p><strong>Project 1:</strong> Risen 2 Teaser Website. A roughly 23K pixel wide parallax scroller made with animated graphical assets from the game. It was cut up into various segments and had to be finely controlled for memory mitigation.<br></p>
      <p><strong>Role:</strong> Concept, Design, Programming<br></p>

           
        <img src="/images/ds1.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
                <img src="/images/ds2.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />

     <p><strong>Project 2:</strong> The official website for Horse Life 2, featuring interactive elements and game previews with interactive graphical elements recreated & animated from the game.<br></p>
     <p><strong>Role:</strong> Solo Concept, Sole Designer, Sole Coder<br></p>


    `,
    description2: `` 
   },
    { id: 16, src: '/images/mini/siemens.jpg', alt: 'Logo 16', 
      title: 'Siemens Global: Interactive Technology Explainer',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/fiction-films.png',
      clientLogoHeight: 25,
      agencyName: 'FictionFilms',
      agencyLink: 'https://www.fiction-films.com',
 description: `
      <p><strong>Project 1:</strong> Interactive infopage about washing machine technology for the global siemens website.<br></p>
      <p><strong>My Role:</strong> Interactive Developer – programmed the animated interface and interactive diagrams.</p>
      <p><strong>Outcome:</strong> The interactive elements helped users better understand complex washing technology through visual exploration.</p>
    `,
    description2: `` 
   },
    { id: 17, src: '/images/mini/hp.jpg', alt: 'Logo 17' , 
      title: 'HP Digital Global Campaign Solutions',
      clientText: `Agency: PepperGlobal`,
      clientLogo: '/images/agencies/pepper_logo.png',
      clientLogoHeight: 25,
      agencyName: 'Pepper Global', 
 description: `
      <p><strong>Scope:</strong> Global digital campaign deliverables for Hewlett Packard (HP), including interactive presentations & motion graphics tailored to fit seamlessly into a given campaign's visual identity, animated explainers, and motion graphics. Additionally, created flagship brand animations for Pepper Global's own agency promotion.</p>
      <p><strong>Role:</strong> Lead Concept, Design, and Development. Translated HP's core campaign look & feel into sophisticated, audio-driven animated films and interactive experiences used in global sales and marketing initiatives.</p><br>
      <p><strong>Outcome:</strong> These assets became the standard digital presentation format for HP's global sales teams for the duration of the campaign.</p><br>
      <p><strong>Tech:</strong> Cinema4D, After Effects, Web technologies</p>

        <img src="/images/hp3.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
                <img src="/images/hp5.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
                        <img src="/images/hp1.jpg" alt="Airbus Munich Showroom" style="width: 100%;  margin: 1rem 0; border-radius: 8px;" />
    `,
    description2: `` 
   },
    
     { id: 19, src: '/images/mini/twenty.jpg', alt: 'Logo 19' , 
      title: 'Motion Picture Digital Delivarables',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/nt2.png',
      clientLogoHeight: 65,
      agencyName: 'NakedToast',
       agencyLink: 'https://www.nakedtoast.com',
 description: `
      <p><strong>Projects:</strong> Landingpages / Digital Campaign Deliverables for Motion Pictures.<br></p>
      <p><strong>Role:</strong> Concept, Design, Programming<br></p>
      <p>Developed high-impact digital marketing components for global theatrical releases from leading studios. Work included promotional microsites, interactive landing pages, and animated banner ad suites—all designed under strict NDA for unreleased film properties.</p>
    `,
    description2: `` 
   },
    { id: 20, src: '/images/mini/universal.jpg', alt: 'Logo 20' , 
      title: 'Marketing Assets for Motion Pictures',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/nt2.png',
      clientLogoHeight: 65,
      agencyName: 'NakedToast',
       agencyLink: 'https://www.nakedtoast.com',
 description: `
      <p><strong>Campaigns:</strong> Digital launch assets for major theatrical releases.</p>
        <p><strong>Challenge:</strong> Create captivating, campaign-specific digital experiences under strict NDA and brand guidelines to build anticipation pre-release.</p>
        <p><strong>My Role:</strong> Lead Interactive Designer & Developer – conceptualized and built promotional microsites, interactive landing pages, and animated ad suites.</p>
        <p><strong>Key Deliverables:</strong> One-page scroll experiences, interactive video teasers, rich media banners.</p>
        <p><strong>Tech:</strong> HTML5, CSS3, JavaScript (GSAP), Adobe Creative Suite.</p>
    `,
    description2: `` 
   },
    { id: 21, src: '/images/mini/wb.jpg', alt: 'Logo 21' , 
      title: 'Advertising Assets / Campaign Deliverables for Motion Pictures',
      clientText: `Agency: `,
      clientLogo: '/images/agencies/nt2.png',
      clientLogoHeight: 65,
      agencyName: 'NakedToast',
       agencyLink: 'https://www.nakedtoast.com',
 description: `
      <p><strong>Campaigns:</strong> Digital launch assets for major theatrical releases.</p>
        <p><strong>Challenge:</strong> Create captivating, campaign-specific digital experiences under strict NDA and brand guidelines to build anticipation pre-release.</p>
        <p><strong>My Role:</strong> Lead Interactive Designer & Developer – conceptualized and built promotional microsites, interactive landing pages, and animated ad suites.</p>
        <p><strong>Key Deliverables:</strong> One-page scroll experiences, interactive video teasers, rich media banners.</p>
        <p><strong>Tech:</strong> HTML5, CSS3, JavaScript (GSAP), Adobe Creative Suite.</p>
    `,
    description2: `` 
   },
  ];
    {/*    { id: 3, src: '/images/mini/atonato.jpg', alt: 'Logo 3', 
      title: 'High-Stakes Decision Support System',
      description: `
      <p><strong>Overview:</strong> Developed a mission-critical digital training and assessment platform for a major international security institution. The project required translating complex operational protocols into a flawless, scenario-based application with zero tolerance for error in logic or execution.</p><br>

      <p><strong>Role:</strong> Developer<br>


      <p><strong>Solution & Technical Execution:</strong><br>
      Built a robust, custom JavaScript application that:
      <ul>
        <li>Managed large, dynamic datasets of scenarios and decision pathways.</li>
        <li>Implemented a branching-logic engine to drive complex, scenario-based user interactions.</li>
        <li>Featured a precise scoring and feedback framework to measure and reinforce protocol adherence.</li>
      </ul>
      </p>
<br>
      <p><strong>Outcome:</strong> The system was successfully deployed to end-users, meeting strict requirements for accuracy, reliability, and user comprehension. This project exemplifies my capability to deliver complex, critical systems where performance is non-negotiable.</p><br>

      <p><strong>Technologies:</strong> Vanilla JavaScript, XML, HTML5, CSS3</p>

      `,
    description2: ``
  }, */}
  return (
    <div className={styles.logoContainer}>
      {logos.map((logo) => (
        <div 
          key={logo.id} 
          className={styles.logoCard}
          onClick={() => handleLogoClick(logo)}
        >
          <div className={styles.logoWrapper}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={150}
              className={styles.logoImage}
              priority={logo.id <= 6} // Only preload first 6 images
            />
          </div>
           <div className={styles.agencyName}>
    {logo.agencyName || 'Agency Name'}
  </div>
        </div>
      ))}
    </div>
  );
};

export default LogoCard;