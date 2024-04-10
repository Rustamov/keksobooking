const map = L.map('map-canvas');


const setMapLoad = (cb) => {
  map
    .on('load', () => {
    })
    .setView([35.65935818784681, 139.78305159450522], 12.5);

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

const createCustomBallon = ({ author, location, offer }) => {
  const balloonTemplate = document.querySelector('#card').content.querySelector('.popup');
  const baloonElement = balloonTemplate.cloneNode(true);

  console.log(author, location, offer);

  baloonElement.querySelector('.popup__avatar').src = author.avatar;
  baloonElement.querySelector('.popup__title').textContent = offer.address;
  baloonElement.querySelector('.popup__text--address').textContent = offer.title;
  baloonElement.querySelector('.popup__text--price').textContent = offer.price;
  baloonElement.querySelector('.popup__type').textContent = offer.type;
  baloonElement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`; //TODO endings
  baloonElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до  ${offer.checkout}`;

  if (offer.features === undefined || offer.features.length === 0) {
    baloonElement.querySelector('.popup__features').remove();
  } else {
    // baloonElement.innerHtml = '';
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

const markerGroup = L.layerGroup().addTo(map);

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


const addMarkers = (places) => {
  places.forEach((place) => {
    createMarker(place);
  });


};

export { addMarkers, setMapLoad };
