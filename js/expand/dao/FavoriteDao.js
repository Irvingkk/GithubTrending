import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }

  /**
   * save items, store saved items
   * @param key
   * @param value
   * @param callback
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) =>{
      if(!error) {

      }
    })
  }
}
















