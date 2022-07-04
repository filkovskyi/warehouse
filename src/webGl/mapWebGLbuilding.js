const minZoom = 12;

const mapWebGLbuilding = {
  'id': 'add-3d-buildings',
  'source': 'composite',
  'source-layer': 'building',
  'filter': ['==', 'extrude', 'true'],
  'type': 'fill-extrusion',
  'minzoom': minZoom,
  'paint': {
    'fill-extrusion-color':
      [
        'case',
        ['boolean', ['feature-state', 'select'], false],
        "lightgreen",
        ['boolean', ['feature-state', 'hover'], false],
        "lightblue",
        '#aaa'
      ],
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      minZoom,
      0,
      minZoom + 0.05,
      ['get', 'height']
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      minZoom,
      0,
      minZoom + 0.05,
      ['get', 'min_height']
    ],
    'fill-extrusion-opacity': 0.9
  }
}

export default mapWebGLbuilding;