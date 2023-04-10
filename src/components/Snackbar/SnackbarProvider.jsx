// @ts-ignore
import {SnackbarContentWithRef} from './SnackbarContent';
import {SnackbarProvider as NotistackSnackbarProvider} from 'notistack';
import {AUTO_HIDE_DURATION} from '../../constants/snackbar.constants';

function SnackbarProvider ({children}) {
  return (
    <NotistackSnackbarProvider
      autoHideDuration={AUTO_HIDE_DURATION}
      maxSnack={3}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      content={(key, data) => {
        return <SnackbarContentWithRef id={key} data={data} />;
      }}
    >
      {children}
    </NotistackSnackbarProvider>
  )
}

export default SnackbarProvider;