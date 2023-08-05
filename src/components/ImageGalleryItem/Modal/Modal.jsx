import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import { useEffect } from 'react';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ children, onClose }) => {
  // componentDidMount() {
  //   window.addEventListener('keydown', this.handleCloseEscModal);
  // }
  // componentWillUnmount() {
  //   window.removeEventListener('keydown', this.handleCloseEscModal);
  // }

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleCloseEscModal = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleCloseEscModal);
    return () => {
      window.removeEventListener('keydown', handleCloseEscModal);
    };
  }, [onClose]);

  return createPortal(
    <div onClick={handleBackdropClick} className={css.overlay}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  onCLose: PropTypes.func,
  children: PropTypes.node.isRequired,
};
