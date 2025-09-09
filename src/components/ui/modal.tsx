// src/components/ui/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
    >
      {/* Modal Content */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 z-50"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        {/* Modal Body */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;