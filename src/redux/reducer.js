import {combineReducers, createStore} from 'redux';
import {ADD_USER_TYPE, REMOVE_USER,LOADER_ON,LOADER_OFF} from './action';

const INITIAL_STATE = {
  token: null,
  userType: null,
  loader: false,
};
function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_USER_TYPE:
      return {...state, token: action.payload.token, userType: action.payload.userType};
    case REMOVE_USER:
      return {...state, token: null, userType: null};
    case LOADER_ON:
      return {...state, loader: true};
    case LOADER_OFF:
      return {...state, loader: false};
    default:
      return state;
  }
}
const CombineRedcuer = combineReducers({
  user: reducer,
});
const store = createStore(CombineRedcuer);
export default store;
