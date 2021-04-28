import AsyncStorage from "@react-native-async-storage/async-storage";
import keys from "../../res/data/keys.json"
import langs from "../../res/data/langs.json"

export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_tag: 'language_dao_tag'};
export default class LanguageDao {
  constructor(flag) {
    this.flag = flag;
  }

  // get language or tag data from AsyncStorage or init data from res json file.
  async fetch() {
    const result = await AsyncStorage.getItem(this.flag);
    if(!result) {
      const data = this.flag === FLAG_LANGUAGE.flag_language? langs: keys;
      this.save(data);
      return data;
    }
    return JSON.parse(result);
  }

  save(data){
    const stringData = JSON.stringify(data);
    AsyncStorage.setItem(this.flag, stringData);
  }
}
