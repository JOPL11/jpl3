"use client";

import { useEffect, useRef } from 'react';

export default function SectionTracker({ onSectionChange }) {
  const observerRef = useRef(null);

  useEffect(() => {
    // Configuration for the intersection observer
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.5, // Trigger when 50% of the section is visible
    };

    // Callback function when intersection occurs
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            console.log('Section in view:', sectionId);
            onSectionChange(sectionId);
          }
        }
      });
    };

    // Create the observer
    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Observe all sections with IDs that match the menu items
    const sections = document.querySelectorAll('[id$="-heading"]');
    sections.forEach(section => {
      if (section.id) {
        observerRef.current.observe(section);
      }
    });

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onSectionChange]);

  return null; // This component doesn't render anything
}
