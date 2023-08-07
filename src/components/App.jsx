import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import toast, { Toaster } from 'react-hot-toast';
import { ThreeCircles } from 'react-loader-spinner';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { fetchImages } from 'services/PixabayAPI';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

import css from './App.module.css';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [endCollection, setEndCollection] = useState(false);

  const handleSubmitForm = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
    setEndCollection(false);
  };
  const handleLoadMore = async () => {
    await setPage(prev => prev + 1);
    setIsLoadingMore(true);
  };
  useEffect(() => {
    if (query === '') {
      return;
    }
    const fetchQuery = async () => {
      try {
        setIsLoading(true);
        const data = await fetchImages(query, page);
        setImages(prev => [...prev, ...data.hits]);
        if (!data.totalHits) {
          return toast.error(
            'Sorry, there are no images matching your search query.'
          );
        }
        const totalPages = Math.ceil(data.totalHits / 12);
        if (page === totalPages) {
          setEndCollection(true);
          setIsLoadingMore(true);
          toast.error('The end🙄');
        }
      } catch {
        console.log('Error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuery();
  }, [query, page]);

  const showLoadMoreBtn = images.length > 0 && !endCollection;
  const hideGallery = images.length > 0;
  return (
    <div className={css.app}>
      <Toaster position="top-right" reverseOrder={false} />

      <Searchbar onSubmit={handleSubmitForm} />
      {hideGallery && <ImageGallery images={images} />}
      {showLoadMoreBtn && <Button onClick={() => handleLoadMore()} />}
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
};
