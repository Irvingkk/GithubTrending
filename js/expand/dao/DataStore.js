import AsyncStorage from "@react-native-async-storage/async-storage";
import Trending from "GitHubTrending"
export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}
const AUTO_TOKEN = 'fd82d1e882462e23b8e88aa82198f166';
/**
 * deal with data about all the popular and trending repos
 */
export default class DataStore {
  /**
   * save springified wraped data to local
   * @param url
   * @param data
   * @returns {Promise<void>}
   */
  async saveData(url, data){
    if (!url || !data) return;
    await AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)));
  }

  _wrapData(data) {
    return {data: data, timestamp: new Date().getTime()}
  }

  /**
   * get data from local, and parse it to JSON
   * @param url
   * @returns {Promise<any>}
   */
  async fetchLocalData(url) {
    const data = await AsyncStorage.getItem(url);
    return JSON.parse(data)
  }

  /**
   * get JSON data from server
   * @param url
   * @param flag
   * @returns {Promise<void>}
   */
  async fetchNetData(url, flag) {
    if (flag !== FLAG_STORAGE.flag_trending) {
      fetch(url)
        .then(request =>{
          if(request.ok) {
            return request.json();
          }
          throw new Error('network response is not ok');
        })
        .then(responseData => {
          this.saveData(url, responseData);
          return responseData;
        }).catch(e=>{
        console.error(e.toString())
      })
    } else {
      const trending = new Trending(AUTO_TOKEN);
      const data = await trending.fetchTrending(url);
      if (!data) {
        throw new Error('responseData is null')
      }
      await this.saveData(url, data);
      return data;
    }
  }

  async fetchData(url, flag){
    console.log('in fetch data: url and flag ' + url + '' +flag);
    try {
      const wrapData = await this.fetchLocalData(url);
      if (wrapData && this.checkTimestampValid(wrapData.timestamp)) {
        return wrapData;
      } else {
        const responseData = await this.fetchNetData(url, flag)
        return this._wrapData(responseData);
      }
    } catch (e) {
      const responseData = await this.fetchNetData(url, flag)
      return this._wrapData(responseData);
    }
  }

  checkTimestampValid(timestamp) {
    const currentTime = new Date();
    const targetTime = new Date();
    targetTime.setTime(timestamp);
    return !(currentTime.getMonth() !== targetTime.getMonth() ||
      currentTime.getDay() !== targetTime.getDay() ||
      currentTime.getHours() - targetTime.getHours() > 4);
  }
}

