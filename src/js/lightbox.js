import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import lightboxTpl from '../templates/lightbox.hbs';
import { galleryRef } from './refs';
import { ligtboxSpinner } from './spinner';

function onLightboxShow(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  createLightbox(e).show();

  const lightboxRef = document.querySelector('.basicLightbox');

  ligtboxSpinner.spin(lightboxRef);

  e.target.src = e.target.dataset.fullsize;

  e.target.onload = () => ligtboxSpinner.stop();
}

function createLightbox(e) {
  const markup = lightboxTpl(e.target.dataset);

  const opts = {
    onShow() {
      document.body.classList.add('is-hidden');
    },
    onClose() {
      document.body.classList.remove('is-hidden');
    },
  };

  return basicLightbox.create(markup, opts);
}

galleryRef.addEventListener('click', onLightboxShow);