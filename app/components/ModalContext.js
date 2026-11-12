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
  const closeTimeoutRef = useRef(null);
  const outgoingTimeoutRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

 const openModal = (content, className = '', { layer = true } = {}) => {
  if (closeTimeoutRef.current) {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }
  clearTimeout(outgoingTimeoutRef.current);

  const prev = layerRef.current;
  const next = { key: ++keyRef.current, content, className };

  if (layer && prev && statusRef.current === 'open') {
    // Already open and this is a section open: keep old panel underneath
    setOutgoing(prev);
    outgoingTimeoutRef.current = setTimeout(() => setOutgoing(null), SLIDE_MS);
  } else {
    // Fresh open, or a swap (e.g. LogoCard next/prev): no layering
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