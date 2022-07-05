import mapBoxGl from '!mapbox-gl';
import config from './utils/config'
import podilBuilding from './modelLayer/podilBuilding'
import building from './mapBoxLayer/building'
import CommuteArea from './mapBoxLayer/comuteArea'

mapBoxGl.accessToken = config.accessToken
const map = new mapBoxGl.Map(config.defaultMapOptions);

let profile = 'walking';
let minutes = 5;
const commuteArea = new CommuteArea(profile, minutes)

/* Load custom 3d models on map */
map.on('style.load', () => {
  map.addLayer(podilBuilding);
});

/* Load mapBox 3D buildings */
map.on('load', () => {
  map.addLayer(building);
});


/* Load commute area layer */
map.on('load', () => {
  

  map.addSource('iso', commuteArea.getSource());
  map.addLayer(commuteArea.getLayer(), 'poi-label');

  commuteArea.getIso(map)
});

/* UI layer */
const params = document.getElementById('params');

params.addEventListener('change', (event) => {
  if (event.target.name === 'profile') {
    profile = event.target.value;
  }

  if (event.target.name === 'duration') {
    minutes = +event.target.value;
  }
 
  map.removeLayer('isoLayer')
  commuteArea.getIso(map)
  map.addLayer(commuteArea.getLayer(profile, minutes), 'poi-label');
});


/* DEBUGGER */
map.on('click', (event) => {
  const lng = event.lngLat.lng;
  const lat = event.lngLat.lat;
  console.log(`${lng}, ${lat}`);
});
