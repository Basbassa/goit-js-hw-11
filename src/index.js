import './css/styles.css';
import { fetchImages } from './js/fetchImages';
import { renderGallery } from './js/renderGallery';
import { onScroll, onToTopBtn } from './js/scroll';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
let query = '';
let currentPage = 1;
const imagesPerPage = 40;
let lightbox;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

onScroll();
onToTopBtn();

function onSearch(e) {
  e.preventDefault();
  window.scrollTo({ top: 0 });
  currentPage = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (!query) {
    alertEmptySearch();
    return;
  }

  fetchImages(query, currentPage, imagesPerPage)
    .then(({ data }) => {
      const { hits, totalHits } = data;
      if (totalHits === 0) {
        alertNoImages();
      } else {
        renderGallery(hits);
        lightbox = new SimpleLightbox('.gallery a').refresh();
        alertImages(totalHits);

        if (totalHits > imagesPerPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  currentPage += 1;
  lightbox.destroy();

  fetchImages(query, currentPage, imagesPerPage)
    .then(({ data }) => {
      const { hits, totalHits } = data;
      renderGallery(hits);
      lightbox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(totalHits / imagesPerPage);

      if (currentPage > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function alertImages(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function alertEmptySearch() {
  Notiflix.Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function alertNoImages() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}
