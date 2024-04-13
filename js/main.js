import { showAlert, debounce } from './util.js';
import { adFormInit, setAdFormSubmit, setInputAddressValue } from './ad-form.js';
import { filterInit, setFilterChange } from './filter.js';
import { renderMarkers, setMapLoad, setPickAddresMarkerDrag } from './map.js';
import { getData } from './api.js';

const RERENDER_DELAY = 500;

getData(
  (places) => {
    setMapLoad(() => {
      adFormInit();
      setAdFormSubmit(() => { });

      filterInit();

      const renderMarkersWrap = () => {
        renderMarkers(
          places,
          () => {
            setPickAddresMarkerDrag((coords) => {
              setInputAddressValue(coords);
            });
          }
        );
      };

      renderMarkersWrap();

      setFilterChange(debounce(
        () => { renderMarkersWrap(); },
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

