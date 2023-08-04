import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import toast, { Toaster } from 'react-hot-toast';
import { ThreeCircles } from 'react-loader-spinner';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { fetchImages } from 'services/PixabayAPI';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import css from './App.module.css';

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    modalImageURL: '',
    isLoading: false,
    isLoadingMore: false,
    showModal: false,
    endCollection: false,
    tags: '',
  };

  openModal = (url, tags) => {
    this.setState({ showModal: true, modalImageURL: url, tags });
  };
  closeModal = () => {
    this.setState({ showModal: false, modalImageURL: '', tags: '' });
  };

  handleSubmitForm = query => {
    // console.log(query);
    this.setState({ query, page: 1, images: [], endCollection: false });
  };
  handleLoadMore = async () => {
    await this.setState(prevState => ({
      page: prevState.page + 1,
      isLoadingMore: true,
    }));
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    if (prevState.query !== query || prevState.page !== page) {
      try {
        this.setState({ isLoading: true });

        const data = await fetchImages(query, page);

        this.setState(prevState => ({
          images: [...prevState.images, ...data.hits],
        }));

        if (!data.totalHits) {
          return toast.error(
            'Sorry, there are no images matching your search query.'
          );
        }

        const totalPages = Math.ceil(data.totalHits / 12);

        if (page === totalPages) {
          this.setState({ endCollection: true, isLoadingMore: false });
          toast.success('The end🙄');
        }
      } catch (error) {
        console.log('Error', error.message);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  render() {
    const {
      images,
      isLoading,
      isLoadingMore,
      endCollection,
      showModal,
      modalImageURL,
    } = this.state;
    const showLoadMoreBtn =
      images.length > 0 && !endCollection && !isLoadingMore;
    const hideGallery = images.length > 0;
    return (
      <div className={css.app}>
        <Toaster position="top-right" reverseOrder={false} />
        {showModal && (
          <Modal onClose={this.closeModal}>
            <img src={modalImageURL} alt={this.state.tags} />
          </Modal>
        )}

        <Searchbar onSubmit={this.handleSubmitForm} />
        {hideGallery && (
          <ImageGallery images={this.state.images} onClick={this.openModal} />
        )}
        {showLoadMoreBtn && <Button onClick={() => this.handleLoadMore()} />}
        {isLoading && isLoadingMore && (
          <Loader>
            <ThreeCircles
              height="100"
              width="100"
              color="#063970"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="three-circles-rotating"
              outerCircleColor=""
              innerCircleColor=""
              middleCircleColor=""
            />
          </Loader>
        )}
      </div>
    );
  }
}
