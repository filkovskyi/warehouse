import mapBoxGl from '!mapbox-gl';
import config from './config'
import podilBuilding from './webGl/podilBuilding'
import mapWebGLbuilding from './webGl/mapWebGLbuilding'

mapBoxGl.accessToken = config.accessToken

const map = new mapBoxGl.Map(config.defaultMapOptions);

/* Load custom 3d models on map */
map.on('style.load', () => { 
  map.addLayer(podilBuilding);
});

// Load mapBox 3D buildings
map.on('load', () => {
  map.addLayer(mapWebGLbuilding);
});

/* DEBUGGER */
map.on('click', (event) => {
  const lng = event.lngLat.lng;
  const lat = event.lngLat.lat;
  console.log(`${lng}, ${lat}`);
});
