import Types from "../../action/types"

/**
 * popular: {
 *   Java:{
 *     items: []
 *     isLoading: false
 *   }
 *   JS:{
 *     items: []
 *     isLoading: false
 *   }
 *   .
 *   .
 *   .
 * }
 * @type {{}}
 */
const defaultState={}
export default function onAction(state = defaultState, action){
  switch (action.type){
    case Types.TRENDING_REFRESH:
      return ({
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true,
        }
      })
    case Types.TRENDING_REFRESH_SUCCESS:
      return ({
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          items: action.items, // data source
          projectModels: action.projectModels, // data shown on current page
          hideLoadingMore: false,
          isLoading: false,
          pageIndex: action.pageIndex,
        }
      })
    case Types.TRENDING_REFRESH_FAIL:
      return ({
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,
          isLoading: false
        }
      })
    case Types.TRENDING_LOAD_MORE_SUCCESS:
      return ({
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        }
      })
    case Types.TRENDING_LOAD_MORE_FAIL:
      return ({
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        }
      })
    default:
      return state;
  }
}












