// Target the params form in the HTML
const params = document.getElementById('params');

// Create constants to use in getIso()
const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
let lon = 30.51694655983212;
let lat = 50.464567272805226;
let profile = 'walking'; // Set the default routing profile
let minutes = 5; // Set the default duration

const lngLat = {
  lon: lon,
  lat: lat
};

const changeColor = duration => {
  switch (+duration) {
    case 5:
      return '389e0d'
    case 10:
      return 'fa8c16'
    case 20:
      return 'f5222d'
    default:
      return '389e0d'
  }
}

// Create a function that sets up the Isochrone API query then makes an fetch call
async function getIso() {
  const query = await fetch(
    `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&contours_colors=${changeColor(minutes)}&polygons=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const data = await query.json();
  // Set the 'iso' source's data to what's returned by the API query
  map.getSource('iso').setData(data);
}

params.addEventListener('change', (event) => {
  if (event.target.name === 'profile') {
    profile = event.target.value;
  } else if (event.target.name === 'duration') {
    minutes = event.target.value;
  }
  getIso();


  map.removeLayer('isoLayer')
  map.addLayer(
    {
      'id': 'isoLayer',
      'type': 'fill',
      'source': 'iso',
      'layout': {},
      'paint': {
        'fill-color': `#${changeColor(minutes)}`,
        'fill-opacity': 0.3
      }
    },
    'poi-label'
  );
});

map.on('load', () => {
  // When the map loads, add the source and layer
  map.addSource('iso', {
    type: 'geojson',
    data: {
      'type': 'FeatureCollection',
      'features': []
    }
  });

  map.addLayer(
    {
      'id': 'isoLayer',
      'type': 'fill',
      'source': 'iso',
      'layout': {},
      'paint': {
        'fill-color': `#${changeColor(minutes)}`,
        'fill-opacity': 0.3
      }
    },
    'poi-label'
  );

  // Make the API call
  getIso();
});
