import LanguageDao from "../../expand/dao/LanguageDao";

export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      const languageDao = new LanguageDao(flagKey);
      const data = await languageDao.fetch(flagKey);
      dispatch({ type: 'LANGUAGE_LOAD_SUCCESS', languages: data, flag: flagKey })
    } catch (e) {
      console.log(e);
    }
  }
}
