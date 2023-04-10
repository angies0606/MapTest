// @ts-nocheck
import {useMemo, useCallback} from "react";
import { useSnackbar as useNotistackSnackbar } from 'notistack';

export default function useSnackbar() {
  const {
    enqueueSnackbar: enqueueNotistackSnackbar,
    closeSnackbar: closeNotistackSnackbar
  } = useNotistackSnackbar();

  const enqueueSnackbar = useCallback((message, variant) => {
    return enqueueNotistackSnackbar({
      message,
      variant
    });
  }, [enqueueNotistackSnackbar])

  const closeSnackbar = useCallback((key) => {
    return closeNotistackSnackbar(key);
  }, [closeNotistackSnackbar]);

  const state = useMemo(() => {
    return {
      enqueueSnackbar,
      closeSnackbar
    };
  }, [enqueueSnackbar, closeSnackbar]);

  return state;
}