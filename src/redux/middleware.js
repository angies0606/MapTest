import {lastPointSelector} from './selectors/points.selectors';
import {setLastPoint} from '../localStorage';
import pointsSlice from './slices/points.slice';
import {createListenerMiddleware} from '@reduxjs/toolkit';

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  actionCreator: pointsSlice.actions.addPoint,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const lastPoint = lastPointSelector(state);
    setLastPoint(lastPoint);
  }
})

export default listenerMiddleware;