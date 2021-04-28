import {combineReducers} from "redux";
import theme from "./theme/index"
import popular from "./popular/index"
import trending from "./trending/index"
import favorite from "./favorite/index"
import language from "./language/index"

/**
 * 1.create and combine reducers
 * @type {Reducer<CombinedState<{}>>}
 */
const index = combineReducers({
  Theme: theme,
  Popular: popular,
  Trending: trending,
  Favorite: favorite,
  Language: language,
})
export default index;
