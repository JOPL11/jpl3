'use client';
import Modal from './Modal';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const ModalContext = createContext();

const SLIDE_MS = 1900;   // 0.3s delay + 1.6s fadeInSlideUp
const CLOSE_MS = 1600;

export function ModalProvider({ children }) {
  const [layer, setLayer] = useState(null);       // { key, contentKey, swap, content, className, header, path }
  const [outgoing, setOutgoing] = useState(null); // previous layer, frozen underneath
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const layerRef = useRef(null);
  const statusRef = useRef('closed'); // 'closed' | 'open' | 'closing'
  const keyRef = useRef(0);
  const contentKeyRef = useRef(0);
  const closeTimeoutRef = useRef(null);
  const outgoingTimeoutRef = useRef(null);

  // URL sync (so Vercel Analytics sees modal opens as route changes)
  const pushedRef = useRef(false);   // we added a history entry for the modal
  const hasPathRef = useRef(false);  // URL currently reflects a modal path

  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    if (isOpen) window.lenis?.stop();
    else window.lenis?.start();
    return () => {
      document.body.classList.remove('modal-open');
      window.lenis?.start();
    };
  }, [isOpen]);

  const openModal = (
    content,
    className = '',
    { layer: doLayer = true, header = null, path = null, push = true } = {}
  ) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    const prev = layerRef.current;
    const contentKey = ++contentKeyRef.current;
    const wasOpen = statusRef.current === 'open';

    // ---- URL sync ----
    if (path && typeof window !== 'undefined') {
      if (!wasOpen && push) {
        window.history.pushState({ modal: true }, '', path);   // counted as a pageview
        pushedRef.current = true;
      } else if (window.location.pathname !== path) {
        window.history.replaceState(window.history.state, '', path);
      }
      hasPathRef.current = true;
    }

    // ---- Swap (LogoCard arrows): same panel, new content ----
    if (!doLayer && prev && wasOpen) {
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

    // ---- Fresh open or section open: new panel, full slide-up ----
    clearTimeout(outgoingTimeoutRef.current);
    const next = { key: ++keyRef.current, contentKey, swap: false, content, className, header };

    if (prev && wasOpen) {
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

    // Restore the URL
    if (hasPathRef.current && typeof window !== 'undefined') {
      if (pushedRef.current) {
        pushedRef.current = false;
        hasPathRef.current = false;
        window.history.back();                         // pops our entry
      } else {
        hasPathRef.current = false;                    // deep-linked: no entry of ours to pop
        window.history.replaceState(window.history.state, '', '/');
      }
    }

    closeTimeoutRef.current = setTimeout(() => {
      clearTimeout(outgoingTimeoutRef.current);
      layerRef.current = null;
      statusRef.current = 'closed';
      setIsOpen(false);
      setIsClosing(false);
      setLayer(null);
      setOutgoing(null);
      closeTimeoutRef.current = null;
    }, CLOSE_MS);
  };

  // Browser Back button closes the modal
  useEffect(() => {
    const onPop = () => {
      if (statusRef.current === 'open' && pushedRef.current) {
        pushedRef.current = false;
        hasPathRef.current = false;
        closeModal();   // URL was already restored by the browser
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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