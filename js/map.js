import { getCurrentFilters, FILTERS } from './filter.js';

const map = L.map('map-canvas');
const MARKERS_SHOW_COUNT = 10;
const MapStartCoords = {
  LAT: 35.65935818784681,
  LNG: 139.78305159450522,
};

const setMapLoad = (cb) => {
  map
    .on('load', () => {
    })
    .setView([MapStartCoords.LAT, MapStartCoords.LNG], 12.5);

  cb();

};

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>',
  },
).addTo(map);

const icon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const iconPickAddress = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 50],
});

const markerGroup = L.layerGroup().addTo(map);


const getFeatures = (features) => {
  const listNode = document.createElement('ul');
  listNode.classList.add('popup__features');

  for (const feature of features) {
    const itemNode = document.createElement('li');
    itemNode.classList.add('popup__feature');
    itemNode.classList.add(`popup__feature--${feature}`);

    listNode.append(itemNode);
  }

  return listNode;
};

const getPhotos = (photos) => {
  const parentNode = document.createElement('div');
  parentNode.classList.add('popup__photos');

  for (const photo of photos) {
    const imgNode = document.createElement('img');
    imgNode.classList.add('popup__photo');
    imgNode.src = photo;
    imgNode.width = 45;
    imgNode.height = 40;

    parentNode.append(imgNode);
  }

  return parentNode;
};

const getCapacityStr = (roomsCount, guestsCount) => {
  let roomStr = 'комнаты';
  let guestStr = 'гостей';

  if (roomsCount === 1) {
    roomStr = 'комната';
  }

  if (guestsCount === 1) {
    guestStr = 'гостя';
  }

  return `${roomsCount} ${roomStr} для ${guestsCount} ${guestStr}`;
};

const createCustomBallon = ({ author, location, offer }) => {
  const balloonTemplate = document.querySelector('#card').content.querySelector('.popup');
  const baloonElement = balloonTemplate.cloneNode(true);

  baloonElement.querySelector('.popup__avatar').src = author.avatar;
  baloonElement.querySelector('.popup__title').textContent = offer.address;
  baloonElement.querySelector('.popup__text--address').textContent = offer.title;

  baloonElement.querySelector('.popup__text--price').textContent = `${offer.price} `;
  baloonElement.querySelector('.popup__text--price').innerHTML += '<span>₽/ночь</span>';

  baloonElement.querySelector('.popup__type').textContent = offer.type;
  baloonElement.querySelector('.popup__text--capacity').textContent = getCapacityStr(offer.rooms, offer.guests);
  baloonElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до  ${offer.checkout}`;

  if (offer.features === undefined || offer.features.length === 0) {
    baloonElement.querySelector('.popup__features').remove();
  } else {
    baloonElement.querySelector('.popup__features').replaceWith(getFeatures(offer.features));
  }

  baloonElement.querySelector('.popup__description').textContent = offer.description;

  if (offer.photos === undefined || offer.photos.length === 0) {
    baloonElement.querySelector('.popup__photos').remove();
  } else {
    baloonElement.querySelector('.popup__photos').replaceWith(getPhotos(offer.photos));
  }

  return baloonElement;
};


const createMarker = (place) => {
  const lat = place.location.lat,
    lng = place.location.lng;

  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(createCustomBallon(place));
};

const getSortedPlaces = (places) => {
  let sortedPlaces = places.slice(0);

  const filters = getCurrentFilters();

  const isPriceInDiapason = (price) => {
    switch (filters.price) {
      case 'middle':
        if (10000 <= price && 50000 >= price) {
          return true;
        }
        return false;

      case 'low':
        if (10000 > price) {
          return true;
        }
        return false;

      case 'high':
        if (50000 < price) {
          return true;
        }
        return false;

      default:
        return false;
    }
  };

  sortedPlaces = sortedPlaces.filter((place) => {
    const { type, price, rooms, guests, features } = place.offer;

    if (filters.type !== 'any' && filters.type !== type) {
      return false;
    }
    if (filters.price !== 'any' && price !== undefined && !isPriceInDiapason(price)) {
      return false;
    }
    if (filters.rooms !== 'any' && +filters.rooms !== rooms) {
      return false;
    }
    if (filters.guests !== 'any' && +filters.guests !== guests) {
      return false;
    }

    const filterFeatures = Object.entries(filters.features); //[[name, isChecked], ...]
    for (const feature of filterFeatures) {
      const [name, isChecked] = feature;

      if (isChecked && features === undefined) {
        return false;
      }
      if (isChecked && !features.includes(name)) {
        return false;
      }
    }

    return true;
  });

  return sortedPlaces;
};

const renderMarkers = (placesData, setCallbacks) => {
  const places = getSortedPlaces(placesData);

  console.log(places);

  markerGroup.clearLayers();

  places.slice(0, MARKERS_SHOW_COUNT).forEach((place) => {
    createMarker(place);
  });

  createPickAddresMarker();

  setCallbacks();
};

const pickAddresMarkerData = {
  lat: MapStartCoords.LAT,
  lng: MapStartCoords.LNG,
}

let pickAddresMarker;

const createPickAddresMarker = () => {
  const lat = pickAddresMarkerData.lat,
    lng = pickAddresMarkerData.lng;

  pickAddresMarker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon: iconPickAddress,
      draggable: 'true'
    }
  );

  pickAddresMarker
    .addTo(markerGroup);


};

const setPickAddresMarkerDrag = (cb) => {
  cb(pickAddresMarkerData);

  pickAddresMarker.on('drag', function (evt) {
    var marker = evt.target;
    var position = marker.getLatLng();

    map.panTo(new L.LatLng(position.lat, position.lng))

    pickAddresMarkerData.lat = position.lat;
    pickAddresMarkerData.lng = position.lng;

    cb(position);
  });

}

export { renderMarkers, setMapLoad, setPickAddresMarkerDrag };
