// import React from 'react';
import { useMap } from 'react-leaflet/hooks';

const MyMapComponent = () => {
  const map = useMap();
  console.log('map center:', map.getCenter());
  return null;
};

export default MyMapComponent;
