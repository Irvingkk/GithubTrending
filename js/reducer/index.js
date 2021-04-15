import {combineReducers} from "redux";
import theme from "./theme/index"

/**
 * 1.create and combine reducers
 * @type {Reducer<CombinedState<{}>>}
 */
const index = combineReducers({
  Theme: theme,
})
export default index;
