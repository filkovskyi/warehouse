mapboxgl.accessToken = 'pk.eyJ1IjoiaXZhbmRyYWdvIiwiYSI6ImNrcG9odnc2eTBscGgzMXA0dTdseHh3Z2oifQ.BcuLTD0qDBvUY1tYyXzDEA';

/* GENERAL */
const map = new mapboxgl.Map({
  style: 'mapbox://styles/mapbox/streets-v11',
  //TODO:refactor with custom styles 3d model not shown
  //style: 'mapbox://styles/ivandrago/cl53m16wg000114n7j24jebxm',
  center: [30.51694655983212, 50.464567272805226],
  zoom: 16,
  pitch: 50,
  bearing: -10,
  container: 'map',
  antialias: true,
});

map.on('load', () => {
  const layers = map.getStyle().layers;
  const labelLayerId = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout['text-field']
  ).id;

  map.addLayer(
    {
      'id': 'add-3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    },
    labelLayerId
  );
});

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

  map.addLayer({
    id: 'custom_layer',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, mbxContext) {

      window.tb = new Threebox(
        map,
        mbxContext,
        { defaultLights: true }
      );

      var options = {
        obj: '/models/gltf/condo.glb',
        type: 'gltf',
        scale: 1,
        units: 'meters',
        rotation: { x: 90, y: 0, z: 0 } //default rotation
      }

      tb.loadObj(options, function (model) {
        soldier = model.setCoords([30.51694655983212, 50.464567272805226]);
        tb.add(soldier);
      })

    },
    render: function (gl, matrix) {
      tb.update();
    }
  });
});



/* DEBUGGER */
map.on('click', (event) => {
  // When the map is clicked, set the lng and lat constants
  // equal to the lng and lat properties in the returned lngLat object.
  lng = event.lngLat.lng;
  lat = event.lngLat.lat;
  console.log(`${lng}, ${lat}`);
});
