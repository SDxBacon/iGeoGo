// import React from 'react';
import { useMap } from 'react-leaflet/hooks';
import useDebounceEffect from '@/hooks/useDebounceEffect';

interface MyMapComponentProps {}

const MyMapComponent = (props: MyMapComponentProps) => {
  const map = useMap();

  useDebounceEffect(() => {}, [], 1000);

  // useEffect(() => {
  //   map.setView([51.505, -0.09], 13);
  // });

  console.log('map center:', map.getCenter());
  return null;
};

export default MyMapComponent;
