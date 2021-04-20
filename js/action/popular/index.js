import types from "../types"
import DataStore, {FLAG_STORAGE} from "../../expand/DataStore";
import handleData from "../actionUtil";

/**
 * return an async dispatch action
 * pass the whole data to reducer but only load the maximum pageSize data
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {(function(*=): void)|*}
 */
export function onRefreshPopular(storeName, url, pageSize) {
  return dispatch => {
    dispatch({type: types.POPULAR_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
      .then(data =>{
        handleData(types.POPULAR_REFRESH_SUCCESS, dispatch, data, storeName, pageSize);
      }).catch(e =>{
        dispatch({
          type: types.POPULAR_REFRESH_FAIL,
          storeName,
          error: e
        })
    })
  }
}

/**
 * load part of data
 * @param storeName
 * @param pageIndex
 * @param pageSize
 * @param dataArray the data pool
 * @param callBack
 * @returns {(function(*): void)|*}
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray= [], callBack) {
  return dispatch => {
    setTimeout(()=>{
      console.log('pageIndex, pageSize, dataArray' + pageIndex + ' ' + pageSize + dataArray)
      if ((pageIndex - 1) * pageSize >= dataArray.length) { // already load all the items
        if (typeof callBack === 'function') {
          callBack('no more');
        }
        dispatch({
          type: types.POPULAR_LOAD_MORE_FAIL,
          storeName,
          error: 'no more',
          pageIndex: --pageIndex,
          projectModes: dataArray
        })
      } else {
        let max = pageIndex * pageSize > dataArray.length? dataArray.length: pageIndex * pageSize;
        dispatch({
          type: types.POPULAR_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModes: dataArray.slice(0, max),
        })
      }
    }, 500);
  }
}
