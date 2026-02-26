import useInitial from '@/hooks/useInitial';

import Map from '@/components/Map';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

function App() {
  useInitial();

  return (
    <div className="size-full flex flex-col">
      <AppHeader />
      <Map />
      <AppFooter />
    </div>
  );
}

export default App;
