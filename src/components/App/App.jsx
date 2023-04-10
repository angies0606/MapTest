import MapConnected from '../Map/MapConnected';
import SnackbarProvider from '../Snackbar/SnackbarProvider';
import { Provider } from 'react-redux';
import store from '../../redux/store';

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <MapConnected />
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
