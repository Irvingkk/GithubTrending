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
    case Types.POPULAR_REFRESH:
      return ({
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true,
        }
      })
    case Types.POPULAR_REFRESH_SUCCESS:
      return ({
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          items: action.items, // data source
          projectModes: action.projectModes, // data shown on current page
          hideLoadingMore: false,
          isLoading: false,
          pageIndex: action.pageIndex,
        }
      })
    case Types.POPULAR_REFRESH_FAIL:
      return ({
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,
          isLoading: false
        }
      })
    case Types.POPULAR_LOAD_MORE_SUCCESS:
      return ({
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModes: action.projectModes,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        }
      })
    case Types.POPULAR_LOAD_MORE_FAIL:
      return ({
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        }
      })
    default:
      console.log('default popular reducer');
      return state;
  }
}












