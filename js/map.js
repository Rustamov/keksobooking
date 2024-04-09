const map = L.map('map-canvas')
  .on('load', () => {
    // console.log('Карта инициализирована');
  })
  .setView([35.65935818784681, 139.78305159450522], 12.5);

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

const createCustomPopup = (point) => {
  const balloonTemplate = document.querySelector('#card').content.querySelector('.popup');
  const popupElement = balloonTemplate.cloneNode(true);

  popupElement.querySelector('.popup__title').textContent = point.title;
  // popupElement.querySelector('.balloon__lat-lng').textContent = `Координаты: ${point.lat}, ${point.lng}`;

  return popupElement;
};

const markerGroup = L.layerGroup().addTo(map);

const createMarker = (point) => {
  const { lat, lng } = point;
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
    .bindPopup(createCustomPopup(point));
};


const addMarkers = (places) => {
  const points = places.map(({ location, offer }) => ({
    title: offer.title,
    lat: location.lat,
    lng: location.lng,
  }));

  // console.log(points);

  points.forEach((point) => {
    createMarker(point);
  });

};

export { addMarkers };
