import types from "../../action/types";
import { FLAG_LANGUAGE } from "../../expand/dao/LanguageDao";

const defaultState ={
  keys: [],
  languages: []
}
export default function onAction(state =defaultState, action){
  switch (action.type){
    case types.LANGUAGE_LOAD_SUCCESS:
      if(action.flag === FLAG_LANGUAGE.flag_language){
        return {
          ...state,
          languages: action.languages,
        }
      } else {
        return {
          ...state,
          keys: action.languages,
        }
      }
    default:
      return state;
  }
}
