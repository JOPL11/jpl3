'use client';

import { useEffect, useState } from 'react';
import { useModal } from './ModalContext';
import { SECTIONS, getModalFactory, normalizeSectionId } from './sectionRegistry';
import styles from '../css/RailNav.module.css';

const CLOSE_MS = 1700; // modal close animation (1600ms) + a little

/**
 * Minimal vertical rail. Two modes:
 *
 * Section mode (default)  <RailNav activeId="react" />
 *   one tick per site section; click opens its modal / scrolls the page.
 *   On the page: variant="page" + onSelect={(id) => ...}
 *
 * Content mode            <RailNav contentRail={{ selector }} scrollerRef={ref} />
 *   one tick per matching element inside the modal's scroller, no labels;
 *   the active tick follows the scroll, click scrolls to that element.
 */
export default function RailNav({
  activeId = null,
  variant = 'modal',
  onSelect = null,
  contentRail = null,
  scrollerRef = null,
  watchKey = 0,
}) {
  if (contentRail && scrollerRef) {
    return <ContentRail selector={contentRail.selector} scrollerRef={scrollerRef} watchKey={watchKey} />;
  }
  return <SectionRail activeId={activeId} variant={variant} onSelect={onSelect} />;
}

function SectionRail({ activeId, variant, onSelect }) {
  const { openModal, closeModal } = useModal();

  // Page rail: follow the window scroll itself (doesn't depend on SectionTracker).
  // Picks the last section in SECTIONS whose top has crossed a "reading line".
  const [spyId, setSpyId] = useState(null);
  useEffect(() => {
    if (variant !== 'page') return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let found = null;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) found = s.id;
      }
      setSpyId((prev) => (prev === found ? prev : found));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [variant]);

  // The scroll position wins on the page; activeId is the fallback (e.g. above Overview)
  const active = variant === 'page' && spyId ? spyId : normalizeSectionId(activeId);

  const go = (id) => {
    if (onSelect) {
      onSelect(id);
      return;
    }
    if (id === active) return;

    const make = getModalFactory(id);
    if (make) {
      openModal(make(), `${id}Modal`, { path: `/${id}` });
      return;
    }

    closeModal();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, CLOSE_MS);
  };

  return (
    <nav
      className={`${styles.rail} ${variant === 'page' ? styles.page : styles.panel}`}
      aria-label="Sections"
    >
      <ul className={styles.list}>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`${styles.item} ${s.id === active ? styles.active : ''}`}
              onClick={() => go(s.id)}
              aria-label={s.label}
              aria-current={s.id === active ? 'true' : undefined}
            >
              <span className={styles.tick} />
              <span className={styles.label}>{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ContentRail({ selector, scrollerRef, watchKey }) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const items = () => Array.from(scroller.querySelectorAll(selector));

    const update = () => {
      const list = items();
      setCount((c) => (c === list.length ? c : list.length));

      const top = scroller.getBoundingClientRect().top;
      const line = scroller.clientHeight * 0.35;   // "reading line" near the upper third
      let idx = 0;
      list.forEach((el, i) => {
        if (el.getBoundingClientRect().top - top <= line) idx = i;
      });
      setActive(idx);
    };

    update();
    scroller.addEventListener('scroll', update, { passive: true });

    // Cards can change size / appear after mount (images, expanding "More")
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(scroller);
      if (scroller.firstElementChild) ro.observe(scroller.firstElementChild);
    }

    return () => {
      scroller.removeEventListener('scroll', update);
      ro?.disconnect();
    };
  }, [selector, scrollerRef, watchKey]);

  const goTo = (i) => {
    const scroller = scrollerRef.current;
    const el = scroller && Array.from(scroller.querySelectorAll(selector))[i];
    if (!el) return;
    const y =
      el.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop;
    scroller.scrollTo({ top: Math.max(y - 100, 0), behavior: 'smooth' });
  };

  if (count < 2) return null;

  return (
    <nav className={`${styles.rail} ${styles.panel}`} aria-label="Projects">
      <ul className={`${styles.list} ${styles.contentList}`}>
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <button
              type="button"
              className={`${styles.item} ${i === active ? styles.active : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Project ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
            >
              <span className={styles.tick} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}