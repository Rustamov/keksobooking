import { showAlert, debounce } from './util.js';
import { adFormInit } from './ad-form.js';
import { filterInit, setFilterChange } from './filter.js';
import { renderMarkers, setMapLoad } from './map.js';
import { getData } from './api.js';

const RERENDER_DELAY = 500;

getData(
  (places) => {
    setMapLoad(() => {
      adFormInit();
      filterInit();
      renderMarkers(places);

      setFilterChange(debounce(
        () => {renderMarkers(places);},
        RERENDER_DELAY,
      ));

      console.log(places[10]);
    });

  },
  (error) => {
    showAlert(`Не удалось загрузить данныйе. Ощибка: ${error}`);
    console.log(error);
  }
);

