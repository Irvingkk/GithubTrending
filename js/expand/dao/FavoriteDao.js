import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_KEY_PREFIX = 'favorite_';
/**
 * only update local storage, instead of redux store
 */
export default class FavoriteDao {
  constructor(flag) {
    // two "favoriteKey": the AsyncStorage key of keys array of favorite items
    // two favoriteKey for both pupularPage and trendingPage
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }

  /**
   * save one favorite item
   * @param key
   * @param value
   */
  saveFavoriteItem(key, value) {
    AsyncStorage.setItem(key, value, (error) =>{
      if (!error) {  //update the saved key array
        this.updateFavoriteKeys(key, true)
      }
    })
  }

  /**
   * remove one saved favorite item
   * @param key
   */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error) =>{
      if(!error) {
        this.updateFavoriteKeys(key, false);
      }
    })
  }

  /**
   * add a key to or delete a key from keyArray
   * @param key
   * @param isAdd
   */
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let keyArray = [];
        if(result) {
          keyArray = JSON.parse(result);
        }
        const index = keyArray.indexOf(key);
        if (isAdd) {
          if (index === -1) { keyArray.push(key)}
        } else {
          if (index !== -1) keyArray.splice(index, 1)
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(keyArray));
      }

    })
  }

  /**
   * get keyArray (used in popular and trending mode)
   * @returns {Promise<any>}
   */
  async getFavoriteKeys() {
    const keyArray = await AsyncStorage.getItem(this.favoriteKey);
    return JSON.parse(keyArray);
  }

  /**
   * get all items using the keyArray
   * @returns {Promise<void>}
   */
  async getAllItems() {
    const keyArray = await this.getFavoriteKeys();
    let items = [];
    if (keyArray) {
      await AsyncStorage.multiGet(keyArray, (error, stores)=> {
        stores.map((element, i) =>{
          let key = element[0];
          let value = element[1];
          items.push(JSON.parse(value));
        })
      })
    }
    return items
  }
}
















