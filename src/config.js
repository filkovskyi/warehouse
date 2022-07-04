const originPoint = [30.51694655983212, 50.464567272805226];

const config = {
  accessToken: 'pk.eyJ1IjoiaXZhbmRyYWdvIiwiYSI6ImNrcG9odnc2eTBscGgzMXA0dTdseHh3Z2oifQ.BcuLTD0qDBvUY1tYyXzDEA',
  defaultMapOptions: {
    style: 'mapbox://styles/mapbox/dark-v10',
    center: originPoint,
    zoom: 16,
    pitch: 50,
    bearing: -10,
    container: 'map',
    antialias: true,
    hash: true
  },
  podilBuildingCords: [30.515919444632658, 50.46423057321786]
}

export default config