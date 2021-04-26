import favoriteDao from "../expand/dao/FavoriteDao";
import projectModel from "../model/ProjectModel";
import Utils from "../util/Utils";
export default function handleData(type, dispatch, data, storeName, pageSize, favoriteDao) {
  let fixItems = []; // all load items

  if (data && Array.isArray(data.data)) {
    fixItems = data.data;
  } else if(data && data.data && Array.isArray(data.data.items)) {
    fixItems = data.data.items;
  }

  let showItems = fixItems.length > pageSize? fixItems.slice(0, pageSize): fixItems;
  // only wrap the showed items: projectModels
  _projectModels(showItems, favoriteDao, (projectModels) =>{
    dispatch({
      type: type,
      items: fixItems,
      projectModels: projectModels,
      storeName: storeName,
      pageIndex: 1,
    })
  })
}


/**
 * wrap the fetched items according to the favorite status saved in local
 * (only wrap the showed items: projectModels)
 * @param showItems
 * @param favoriteDao
 * @param callback
 * @returns {Promise<void>}
 * @private
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = []
  try {
    keys = await favoriteDao.getFavoriteKeys();
    // debugger
  } catch (e) {
    console.error(e);
  }
  const projectModels = []
  for (let i =0; i< showItems.length; i++) {
    projectModels.push(new projectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)));
  }
  // debugger
  if (typeof callback === 'function') { // return wrapped item by calling callback
    callback(projectModels);
  }
}






















