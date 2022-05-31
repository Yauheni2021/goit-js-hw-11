
import './sass/main.scss';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPics, fetchPicsOptions } from './js/fetchImages.js';
import templateCard from './templates/templateCard.hbs';

const initialData = {
  total: 0,
  hits: [],
};

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const observer = new IntersectionObserver((entries, observer) => {
  const { hits, total } = initialData;
  const lastCard = entries[0];
  if (!lastCard.isIntersecting || hits.length === total) return;
  observer.unobserve(lastCard.target);
  fetchPicsOptions.page++;
  createGallery();
});

const galleryLigthbox = new SimpleLightbox('.gallery a', { captionDelay: 200 });

const renderGallery = hits => {
  refs.gallery.insertAdjacentHTML('beforeend', templateCard(hits));
  galleryLigthbox.refresh();
};

export const createGallery = async () => {
  await fetchPics(fetchPicsOptions).then(({ data }) => {
    const { total, hits } = data;
    if (total || hits.length) {
      if (fetchPicsOptions.page === 1) {
        Notify.success(`Hooray! We found ${total} images.`);
      }
      initialData.hits = hits;
      renderGallery(hits);
      observer.observe(document.querySelector('.gallery-item:last-child'));
    } else {
      Notify.info('Sorry, there are no images matching your search query. Please try again.');
    }
  });
};

const onSearch = e => {
  e.preventDefault();

  const {
    elements: { searchQuery },
  } = e.currentTarget;
  fetchPicsOptions.q = searchQuery.value.toLowerCase().trim();
  if (fetchPicsOptions.q === '') {
    refs.gallery.innerHTML = '';
    Notify.failure('Please enter something in search field!');
  }
  if (fetchPicsOptions.q.length) {
    refs.gallery.innerHTML = '';
    fetchPicsOptions.page = 1;
    createGallery();
  }
};

refs.searchForm.addEventListener('submit', onSearch);
