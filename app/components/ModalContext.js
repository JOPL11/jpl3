// components/ModalContext.js
'use client';
import Modal from './Modal';
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalContent, setModalContent] = useState(null);
  const [modalClassName, setModalClassName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (content, className = '') => {
    setModalContent(content);
    setModalClassName(className);
    setIsOpen(true);
  };
  
  const closeModal = () => {
    setModalContent(null);
    setModalClassName('');
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal} className={modalClassName}>
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);