import Notiflix from 'notiflix';

const apiKey = '4780863-4872bedc84fbdcc09d25477c4';
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('[name="searchQuery"]');
const galleryContainer = document.querySelector('.gallery');

searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  fetch(
    `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(response => response.json())
    .then(({ hits }) => {
      if (hits.length === 0) {
        showErrorNotification();
        return;
      }
      showGallery(hits);
    })
    .catch(error => {
      console.error(error);
      showErrorNotification();
    });
}

function showGallery(hits) {
  galleryContainer.innerHTML = '';
  const galleryMarkup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <img src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" loading="lazy" />
        <div class="stats">
          <p class="stats-item">
            <i class="material-icons">thumb_up</i>
            ${likes}
          </p>
          <p class="stats-item">
            <i class="material-icons">visibility</i>
            ${views}
          </p>
          <p class="stats-item">
            <i class="material-icons">comment</i>
            ${comments}
          </p>
          <p class="stats-item">
            <i class="material-icons">cloud_download</i>
            ${downloads}
          </p>
        </div>
      </div>
    `
    )
    .join('');
  galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
}

function showErrorNotification() {
  notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
