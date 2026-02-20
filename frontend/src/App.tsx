import Map from './Map';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

function App() {
  return (
    <div className="size-full flex flex-col">
      <AppHeader />
      <Map />
      <AppFooter />
    </div>
  );
}

export default App;
