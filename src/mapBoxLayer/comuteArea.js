import config from '../utils/config'

export default class CommuteArea {
  constructor(profile, minutes) {
    this.query = null
    this.urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
    this.lon = config.defaultMapOptions.center[0];
    this.lat = config.defaultMapOptions.center[1];
    this.profile = profile || 'walking';
    this.minutes = minutes || 5;
    this.fillColor = this.changeColor(this.minutes)

    const commuteAreaLayer = {
      'id': 'isoLayer',
      'type': 'fill',
      'source': 'iso',
      'layout': {},
      'paint': {
        'fill-color': this.fillColor,
        'fill-opacity': 0.3
      }
    }

    const sourceLayer = {
      type: 'geojson',
      data: {
        'type': 'FeatureCollection',
        'features': []
      }
    }

    this.commuteAreaLayer = commuteAreaLayer;
    this.sourceLayer = sourceLayer;

    this.getQuery()
  }

  getCommuteAreaLayer(color) { 
    this.commuteAreaLayer = {
      ...this.commuteAreaLayer,
      paint: {
        ...this.commuteAreaLayer.paint,
        'fill-color': color,
      }
    };
  }

  getLayer(profile, minutes) {
    if (profile && minutes) {
      this.changeColor(minutes)
      this.getCommuteAreaLayer(this.fillColor)
      return this.commuteAreaLayer
    } else {
      return this.commuteAreaLayer
    }
  }

  getSource() {
    return this.sourceLayer
  }

  getQuery() {
    return this.query = `${this.urlBase}${this.profile}/${this.lon},${this.lat}?contours_minutes=${this.minutes}&polygons=true&access_token=${config.accessToken}`
  }

  changeColor(duration) {
    switch (duration) {
      case 5:
        return this.fillColor = '#389e0d'
      case 10:
        return this.fillColor = '#fa8c16'
      case 20:
        return this.fillColor = '#f5222d'
      default:
        return this.fillColor = '#389e0d'
    }
  }

  async getIso(map) {
    if (this.query) {
      const data = await fetch(this.query, { method: 'GET' })
      const res = await data.json();
      map.getSource('iso').setData(res);
    }
  }
}
