import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notifyOptions from './NotifyOptions/NotifyOptions';
import Container from './Container/Container';
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import fetchImages from 'services/pixabayApi';
import StartText from './StartText/StartText';
import Loader from './Loader/Loader';
import LoadMoreBtn from './Button/Button';
import Modal from './Modal/Modal';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [largeImage, setLargeImage] = useState('');
  const [imagesTags, setImagesTags] = useState(null);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(12);

  useEffect(() => {
    if (!query) return;

    searchImages(query, page, perPage);
  }, [query, page, perPage]);

  async function searchImages(query, page, perPage) {
    setIsLoading(true);

    try {
      const data = await fetchImages(query, page, perPage);

      if (data.hits.length === 0) {
        setShowLoadMoreBtn(false);
        toast.info('No images found!', notifyOptions);
        return;
      }
      setImages(images => [...images, ...data.hits]);
      setTotal(data.totalHits);

      if (data.hits.length > 0 && page === 1) {
        toast.success(
          `Hooray! We found ${data.totalHits} images.`,
          notifyOptions
        );
      }
      if (data.hits.length < perPage) {
        setShowLoadMoreBtn(false);
        toast.info(
          "We're sorry, but you've reached the end of search results.",
          notifyOptions
        );
      } else {
        setShowLoadMoreBtn(true);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { query, page } = this.state;
  //   if ((query && prevState.query !== query) || page > prevState.page) {
  //     this.searchImages(query, page);
  //   }
  //   if (prevState.query !== query) {
  //     this.setState({
  //       images: [],
  //     });
  //   }
  // }

  const onFormSearh = query => {
    setQuery(prevState => {
      if (prevState.query === query) return prevState;

      // query,
      // page: 1,
      setQuery(query);
      setPage(1);
      // setImages([]);
      return query;
    });
  };

  const onLoadMore = () => {
    setPage(
      prevState => prevState.page + 1,

      () => {
        if (images.length < perPage) {
          setShowLoadMoreBtn(false);
          toast.info(
            "We're sorry, but you've reached the end of search results.",
            notifyOptions
          );
        }
      }
    );
  };

  const openModal = (largeImage, imagesTags) => {
    setModalOpen(true);
    setLargeImage(largeImage);
    setImagesTags(imagesTags);
    setIsLoading(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setLargeImage('');
    setIsLoading(false);
  };

  return (
    <>
      <Searchbar onSubmit={onFormSearh} />
      {images.length === 0 && <StartText />}
      {error && toast.error('Please try again later!', notifyOptions)}
      <Container>
        {isLoading && <Loader />}
        <ImageGallery images={images} onClick={openModal} />
        {showLoadMoreBtn && <LoadMoreBtn onLoadMore={onLoadMore} />}
        {modalOpen && (
          <Modal src={largeImage} alt={imagesTags} onClose={closeModal}></Modal>
        )}
      </Container>
      <ToastContainer />
    </>
  );
}
