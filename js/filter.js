import { getClickedChildWithClass } from './util.js';

const filterFormNode = document.querySelector('.map__filters');

const FILTERS = {
  TYPE: {
    DEFAULT: 'any',
    BUNGALOW: 'bungalow',
    FLAT:'flat',
    HOTEL:'hotel',
    HOUSE:'house',
    PALACE:'palace',
  },
};


const filterInit = () => {
  filterFormNode.classList.remove('map__filters--disabled');
};

const getCurrentFilters = () => ({
  type: filterFormNode.querySelector('#housing-type').value,
  price: filterFormNode.querySelector('#housing-price').value,
  rooms: filterFormNode.querySelector('#housing-rooms').value,
  guests: filterFormNode.querySelector('#housing-guests').value,
  features: {
    wifi: filterFormNode.querySelector('#filter-wifi').checked,
    dishwasher: filterFormNode.querySelector('#filter-dishwasher').checked,
    parking: filterFormNode.querySelector('#filter-parking').checked,
    washer: filterFormNode.querySelector('#filter-washer').checked,
    elevator: filterFormNode.querySelector('#filter-elevator').checked,
    conditioner: filterFormNode.querySelector('#filter-conditioner').checked,
  }
});

const setFilterChange = (cb) => {
  filterFormNode.addEventListener('change', () => {
    cb();
  });
};

export { filterInit, setFilterChange, getCurrentFilters, FILTERS };
