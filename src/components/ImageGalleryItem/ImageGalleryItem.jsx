import PropTypes from 'prop-types';
import css from './ImageGalleryItem.module.css';
import { Modal } from './Modal/Modal';
import { useState } from 'react';

export const ImageGalleryItem = ({ image }) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(prev => !prev);
  };
  return (
    <li className={css.imageGalleryItem}>
      <img
        className={css.imageGalleryItemImage}
        src={image.webformatURL}
        alt={image.tags}
        onClick={() => toggleModal()}
      />
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={image.largeImageURL} alt={image.tags} />
        </Modal>
      )}
    </li>
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
