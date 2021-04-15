import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import reducers from "../reducer"
import { red } from "react-native-reanimated/src/reanimated2/Colors";

const logger = store => next => action => {
  if (typeof action === 'function') {
    console.log('dispatching a function');
  } else {
    console.log('dispatching', action);
  }
  const result = next(action);
  console.log('nextState', store.getState());
  return result;
}
const middleWare = [
  logger,
  thunk,
]

/**
 * 2. create store
 */
export default createStore(reducers, applyMiddleware(...middleWare));
