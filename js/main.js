import { showAlert } from './util.js';
import { adFormInit } from './ad-form.js';
import './filter.js';
import { addMarkers, setMapLoad } from './map.js';
import { getData } from './api.js';

getData(
  (places) => {
    setMapLoad(() => {
      adFormInit();
      addMarkers(places);

      console.log(places[10]);
    });

  },
  (error) => {
    showAlert(`Не удалось загрузить данныйе. Ощибка: ${error}`);
    console.log(error);
  }
);

