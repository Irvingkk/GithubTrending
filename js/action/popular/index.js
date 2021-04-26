import types from "../types"
import DataStore, {FLAG_STORAGE} from "../../expand/dao/DataStore";
import handleData, { _projectModels } from "../actionUtil";

/**
 * return an async dispatch action
 * pass the whole data to reducer but only load the maximum pageSize data
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 * @returns {(function(*=): void)|*}
 */
export function onRefreshPopular(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({type: types.POPULAR_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
      .then(data =>{
        handleData(types.POPULAR_REFRESH_SUCCESS, dispatch, data, storeName, pageSize, favoriteDao);
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
 * @param favoriteDao
 * @param callBack
 * @returns {(function(*): void)|*}
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray= [], favoriteDao, callBack) {
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
          projectModels: dataArray
        })
      } else {
        let max = pageIndex * pageSize > dataArray.length? dataArray.length: pageIndex * pageSize;
        _projectModels(dataArray.slice(0, max), favoriteDao, (projectModels)=>{
          dispatch({
            type: types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: projectModels,
          })
        })
      }
    }, 500);
  }
}
