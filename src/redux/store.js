import { configureStore } from '@reduxjs/toolkit';
import pointsSlice from './slices/points.slice';
import listenerMiddleware from './middleware';

const store = configureStore({
  reducer: {
    points: pointsSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(listenerMiddleware.middleware)
});

export default store;