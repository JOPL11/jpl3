'use client';
import Modal from './Modal';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalContent, setModalContent] = useState(null);
  const [modalClassName, setModalClassName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [suppressScrollRestore, setSuppressScrollRestore] = useState(false);

  const closeTimeoutRef = useRef(null);
console.log('ModalProvider state:', { isOpen, isClosing, hasContent: !!modalContent });
   useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const openModal = (content, className = '') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setSuppressScrollRestore(false);   // reset on open
    setModalContent(content);
    setModalClassName(className);
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeModal = (opts = {}) => {
    setSuppressScrollRestore(!!opts.suppressScrollRestore);
    setIsClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setModalContent(null);
      setModalClassName('');
      setSuppressScrollRestore(false);  // reset after close
      closeTimeoutRef.current = null;
    }, 1600);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          isClosing={isClosing}
          suppressScrollRestore={suppressScrollRestore}
          onClose={closeModal}
          className={modalClassName}
        >
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);