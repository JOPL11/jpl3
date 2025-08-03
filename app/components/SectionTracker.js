"use client";

import { useEffect, useRef } from 'react';

export default function SectionTracker({ onSectionChange }) {
  const observerRef = useRef(null);
  const sectionRefs = useRef({});
  const lastActiveSection = useRef(null);
  const scrollDirection = useRef('down');
  let lastScrollY = useRef(0);

  useEffect(() => {
    // Track scroll direction
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirection.current = currentScrollY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Configuration for the intersection observer
    const options = {
      root: null,
      rootMargin: '-40% 0px -60% 0px', // Adjust these values to fine-tune when sections are considered active
      threshold: 0
    };

    // Callback function when intersection occurs
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.getAttribute('data-section');
        if (!sectionId) return;

        // Store the section's position and visibility
        sectionRefs.current[sectionId] = {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          boundingRect: entry.boundingClientRect
        };
      });

      // Find the most visible section
      let mostVisible = { id: null, ratio: 0 };
      
      Object.entries(sectionRefs.current).forEach(([id, data]) => {
        if (data.isIntersecting && data.intersectionRatio > mostVisible.ratio) {
          mostVisible = { id, ratio: data.intersectionRatio };
        }
      });

      // If we found a visible section, update the active section
      if (mostVisible.id && mostVisible.id !== lastActiveSection.current) {
        lastActiveSection.current = mostVisible.id;
        onSectionChange(mostVisible.id);
      }
    };

    // Create the observer
    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Observe all section markers
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section');
      if (sectionId) {
        sectionRefs.current[sectionId] = {};
        observerRef.current.observe(section);
      }
    });

    // Initial check
    handleIntersection(observerRef.current.takeRecords());

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onSectionChange]);

  return null;
}
