import useInitial from '@/hooks/useInitial';

import Map from '@/components/Map';
import AppHeader from '@/components/AppHeader';

function App() {
  useInitial();

  return (
    <div className="size-full flex flex-col">
      <AppHeader />
      <Map />
    </div>
  );
}

export default App;
