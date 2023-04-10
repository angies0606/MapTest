import classes from './SnackbarContent.module.scss';
import { forwardRef } from 'react';
import useSnackbar from './useSnackbar';
import { SnackbarContent as NotistackSnackbarContent } from 'notistack';
import IconButton from '@mui/material/IconButton';
import PlaceIcon from '@mui/icons-material/Place';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarContent = ({id, data}, ref) => {
  const {closeSnackbar} = useSnackbar();
  
  const close = () => {
    closeSnackbar(id)
  }

  const SnackbarVariantClass = () => {
    switch (data?.variant) {
      case 'showAddress': 
        return classes.SnackbarShowAddress;
      default: 
        return;
    }
  }

  const IconVariant = () => {
    switch (data?.variant) {
      case 'showAddress': 
        return PlaceIcon;
      default: 
        return;
    } 
  }
  
  const CurrentIconVariant = IconVariant();

  return (
    <NotistackSnackbarContent ref={ref} onClick={close}>
      <div className={`${classes.SnackbarContent} ${SnackbarVariantClass()}`}>
        <div className={classes.SnackbarContent__IconBox}>
          {
            CurrentIconVariant &&
            <CurrentIconVariant size={20} className={classes.SnackbarContent__VariantIcon} />
          }
        </div>
        <div className={classes.SnackbarContent__MessageBlock}>
          <span className={classes.SnackbarContent__Message}>{data.message}</span>
        </div>

        <IconButton
          onClick={close}
          className={classes.SnackbarContent__CloseButton}
        >
          <CloseIcon size={20} className={classes.SnackbarContent__CloseButtonIcon} />
        </IconButton>
      </div>
    </NotistackSnackbarContent>
  )
}

export const SnackbarContentWithRef = forwardRef(SnackbarContent);