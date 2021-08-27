import ApiService from './apiService';
import imageCardTpl from '../../src/templates/ImageCard.hbs';
import { Spinner } from 'spin.js';
import { errorMsg } from './notifications';
import { loadObserver, styleObserver } from './observer';
import { searchFormRef, galleryRef, getCardRefs } from './refs';
import { previewSpinnerOpts } from './spinner';

const API = new ApiService();

function clearGallery() {
  galleryRef.innerHTML = '';
}

function renderGalleryMarkup(markup) {
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function observeCards(cards, lastCard) {
  cards.forEach(card => {
    addPreviewSpinner(card);

    styleObserver.observe(card);
  });

  loadObserver.observe(lastCard);
}

function addPreviewSpinner(card) {
  const image = card.querySelector('IMG');
  const previewSpinner = new Spinner(previewSpinnerOpts);

  if (!image.dataset.loaded) {
    previewSpinner.spin(card);
  }

  image.onload = () => {
    previewSpinner.stop();
    image.dataset.loaded = true;
  };
}

function makeGallery(images) {
  const markup = imageCardTpl(images);

  renderGalleryMarkup(markup);

  const cardRefs = getCardRefs();

  observeCards(cardRefs.allCards, cardRefs.lastCard);
}

async function onSearch(e) {
  e.preventDefault();

  API.query = e.currentTarget.elements.query.value;

  if (!RegExp(/^\p{L}/, 'u').test(API.query)) {
    return errorMsg();
  }

  API.resetPage();

  const images = await API.getImages(API.searchQuery);

  try {
    clearGallery();
    makeGallery(images);

    setTimeout(() => {
      window.scrollTo({ top: 240, behavior: 'smooth' });
    }, 600);
  } catch {
    errorMsg();
  } finally {
    searchFormRef.reset();
  }
}

export async function onLoadMore() {
  const images = await API.getImages(API.searchQuery);

  try {
    makeGallery(images);
  } catch (err) {
    console.log(err);
  }
}

searchFormRef.addEventListener('submit', onSearch);