import {createSlice} from '@reduxjs/toolkit';
import {getLastPoint} from '../../localStorage';

const savedLastPoint = getLastPoint();
const initialState = savedLastPoint ? [savedLastPoint] : [];

const pointsSlice = createSlice({
  name: 'points',
  initialState: initialState,
  reducers: {
    addPoint: (state, action) => {
      state.push(action.payload);
    }
  }
});

export default pointsSlice;
