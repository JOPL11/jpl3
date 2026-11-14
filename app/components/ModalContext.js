'use client';
import Modal from './Modal';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const ModalContext = createContext();

const SLIDE_MS = 1900; // 0.3s delay + 1.6s fadeInSlideUp

export function ModalProvider({ children }) {
  const [layer, setLayer] = useState(null);       // { key, content, className }
  const [outgoing, setOutgoing] = useState(null); // previous layer, frozen underneath
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const layerRef = useRef(null);
  const statusRef = useRef('closed'); // 'closed' | 'open' | 'closing'
  const keyRef = useRef(0);
  const contentKeyRef = useRef(0);
  const closeTimeoutRef = useRef(null);
  const outgoingTimeoutRef = useRef(null);

useEffect(() => {
  document.body.classList.toggle('modal-open', isOpen);
  if (isOpen) window.lenis?.stop();
  else window.lenis?.start();
  return () => {
    document.body.classList.remove('modal-open');
    window.lenis?.start();
  };
}, [isOpen]);

const openModal = (content, className = '', { layer = true, header = null } = {}) => {
  if (closeTimeoutRef.current) {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }

  const prev = layerRef.current;
  const contentKey = ++contentKeyRef.current;

  // Swap: modal is open and caller asked for no layering (LogoCard arrows).
  // Keep the SAME panel key so the panel doesn't remount or replay the slide-up;
  // only the content changes and fades in.
  if (!layer && prev && statusRef.current === 'open') {
    const next = {
      key: prev.key,
      contentKey,
      swap: true,
      content,
      className: className || prev.className,
      header: prev.header,
    };
    layerRef.current = next;
    setLayer(next);
    return;
  }

  // Fresh open or section open: new panel key, full slide-up
  clearTimeout(outgoingTimeoutRef.current);
  const next = { key: ++keyRef.current, contentKey, swap: false, content, className, header };

  if (prev && statusRef.current === 'open') {
    setOutgoing(prev);
    outgoingTimeoutRef.current = setTimeout(() => setOutgoing(null), SLIDE_MS);
  } else {
    setOutgoing(null);
  }

  layerRef.current = next;
  statusRef.current = 'open';
  setLayer(next);
  setIsClosing(false);
  setIsOpen(true);
};
  const closeModal = () => {
    if (statusRef.current !== 'open') return; // guards ESC spam / double close
    statusRef.current = 'closing';
    setIsClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      clearTimeout(outgoingTimeoutRef.current);
      layerRef.current = null;
      statusRef.current = 'closed';
      setIsOpen(false);
      setIsClosing(false);
      setLayer(null);
      setOutgoing(null);
      closeTimeoutRef.current = null;
    }, 1600);
  };

  const layers = layer ? (outgoing ? [outgoing, layer] : [layer]) : [];

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && (
        <Modal isOpen={isOpen} isClosing={isClosing} onClose={closeModal} layers={layers} />
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);