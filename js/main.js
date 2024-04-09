import { showAlert } from './util.js';
import './ad-form.js';
import './filter.js';
import { addMarkers } from './map.js';
import { getData } from './api.js';

getData(
  (places) => {
    // console.log(places[0]);
    addMarkers(places);
  },
  () => {
    showAlert('Не удалось загрузить данныйе');
  }
);

