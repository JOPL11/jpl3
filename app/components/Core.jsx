'use client';

import { useId, useState } from 'react';
import styles from '../css/page.module.css';
import local from '../css/Core.module.css';
import SectionTracker from './SectionTracker';
import AnimatedText from './AnimatedText';

/*
  Content lives here as data, so adding a skill or a whole category
  never touches the markup.
  `columns: 2` fills the list top-to-bottom in two columns (used for Languages).
*/
const DEFAULT_GROUPS = [
  {
    id: 'languages',
    title: 'Languages',
    columns: 2,
    items: [
      'English (native)',
      'German (fluent)',
      'Spanish (fluent)',
      'French (fluent)',
    ],
  },
  {
    id: 'strategy',
    title: 'Strategy & Creative Direction',
    items: [
      'Brand Identity Systems',
      'Customer Experience / Design Psychology',
      'Creative Direction',
      'Stakeholder Communication & Alignment',
      'Strategic Writing & Presentations',
      'Project Ideation & Pitching',
      'Project Management',
      'UI / UIX Architecture',
    ],
  },
  {
    id: 'design',
    title: 'Design, Motion & Creative',
    items: [
      'Design, Animation, Concept Development',
      'Illustration, Typography, Logo Design, Layout, Branding',
      'Cinema4D, Blender, Adobe Suite',
      '3D Modeling, 3D Animation, 3D Rendering',
      'Octane Render, Corona Render',
      'After Effects, Cavalry, Lottie',
      'DaVinci Resolve, Premiere Pro',
      'Video Edit, Video Post-Production, Compositing, Motion Graphics',
    ],
  },
  {
    id: 'code',
    title: 'Code',
    items: [
      'Development, Rapid Prototyping',
      'React, Next.js, Vue.js, html, css, javascript',
      'Three.js, React 3 Fiber, WebXR',
      'Typescript, JSX',
      'GSAP, Framer Motion, CSS Animations, Spring',
      'Bootstrap, Tailwind, MaterialUI',
      'vite, git, gitlab, npm, yarn',
      'SQL / Supabase Experience',
      'Unity, C#, DOTween',
      'GLSL, HLSL experience',
      'SEO, Analytics',
    ],
  },
];

function AccordionItem({ group, isOpen, onToggle }) {
  const uid = useId();
  const triggerId = `${uid}-trigger`;
  const panelId = `${uid}-panel`;

  return (
    <div className={`${local.item} ${isOpen ? local.open : ''}`}>
      <h3 className={local.heading}>
        <button
          type="button"
          id={triggerId}
          className={local.trigger}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{group.title}</span>
          <span className={local.chevron} aria-hidden="true" />
        </button>
      </h3>

      {/* Collapsed panels are visibility:hidden (see CSS), so they are
          removed from the tab order and the accessibility tree. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={local.panel}
      >
        <div className={local.panelInner}>
          <ul
            role="list"
            className={`${styles.skillsList} ${local.list} ${
              group.columns === 2 ? local.twoColumns : ''
            }`}
          >
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Drop-in replacement for the whole <section id="services">.
 *
 * Props
 *  headingRef      ref for the animated "Core" heading (servicesHeadingRef)
 *  onSectionChange passed to SectionTracker (setActiveSection)
 *  groups          override the default content: [{ id, title, items[], columns? }]
 *  allowMultiple   true = several groups can be open at once (default: one at a time)
 *  defaultOpen     array of group ids open on first render (default: none)
 */
export default function Core({
  headingRef,
  onSectionChange,
  groups = DEFAULT_GROUPS,
  allowMultiple = false,
  defaultOpen = [],
}) {
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpen));

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      id="services"
      className={`${styles.content} ${styles.scrollTarget}`}
      aria-labelledby="core-heading"
    >
      {onSectionChange && <SectionTracker onSectionChange={onSectionChange} />}

      <h2 id="core-heading" style={{ paddingTop: '5rem' }}>
        <AnimatedText ref={headingRef}>Core</AnimatedText>
      </h2>
      <div style={{ height: '0.1rem', marginBottom: '5rem' }}>Tools</div>

      <p>
        My toolkit is extensive and constantly evolving, allowing me to own a
        project from concept to deployment. I&apos;ve split skills into separate
        categories for clarity:
      </p>

      <div className={local.accordion}>
        {groups.map((group) => (
          <AccordionItem
            key={group.id}
            group={group}
            isOpen={openIds.has(group.id)}
            onToggle={() => toggle(group.id)}
          />
        ))}
      </div>
    </section>
  );
}