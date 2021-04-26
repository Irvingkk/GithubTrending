import {combineReducers} from "redux";
import theme from "./theme/index"
import popular from "./popular/index"
import trending from "./trending/index"
import favorite from "./favorite/index"

/**
 * 1.create and combine reducers
 * @type {Reducer<CombinedState<{}>>}
 */
const index = combineReducers({
  Theme: theme,
  Popular: popular,
  Trending: trending,
  Favorite: favorite
})
export default index;
