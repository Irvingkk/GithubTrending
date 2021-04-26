import Types from "../types"
import FavoriteDao from "../../expand/dao/FavoriteDao";
import ProjectModel from "../../model/ProjectModel";
/**
 *
 * @param flag
 * @param isShowLoading
 */
export function onLoadFavoriteData(flag, isShowLoading) {
  return dispatch=> {
    if(isShowLoading) {
      dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag,});
    }
    const favoriteDao = new FavoriteDao(flag);
    favoriteDao.getAllItems()
      .then(data=>{
        const items = [];
        for (let i = 0; i < data.length; i++){
          items.push(new ProjectModel(data[i], true));
        }
        dispatch({type: Types.FAVORITE_LOAD_SUCCESS, projectModels: items, storeName: flag});
      })
      .catch(e=>{
        console.log(e);
        dispatch({type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag});
      })
  }
}















