import { Threebox } from 'threebox-plugin';
import config from '../utils/config';

const buildingCoords = config.podilBuildingCords

const podilBuilding = {
  id: 'custom_layer_podilBuilding',
  type: 'custom',
  renderingMode: '3d',
  onAdd: (map, mbxContext) => {
    window.tb = new Threebox(
      map,
      mbxContext,
      { defaultLights: true }
    );

    const options = {
      obj: '/models/gltf/condo.glb',
      type: 'gltf',
      scale: 1,
      units: 'meters',
      rotation: { x: 90, y: -135, z: 0 }
    }

    tb.loadObj(options, (model) => {
      const building = model.setCoords(buildingCoords);
      tb.add(building);
    })
  },
  render:  (gl, matrix) => {
    tb.update();
  }
}

export default podilBuilding;