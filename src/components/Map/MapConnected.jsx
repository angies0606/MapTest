import pointsSlice from '../../redux/slices/points.slice';
import { lastPointSelector } from '../../redux/selectors/points.selectors'
import { connect } from 'react-redux';
import Map from './Map.jsx';

let mapStateToProps = (state) => {
  return {
    currentPoint: lastPointSelector(state)
  }
};

let mapDispatchToProps = (dispatch) => {
  return {
    addPoint: (point) => {
      dispatch(pointsSlice.actions.addPoint(point));
    }
  }
};

const MapConnected = connect(mapStateToProps, mapDispatchToProps)(Map);
export default MapConnected;