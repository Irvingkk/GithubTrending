import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import {createAppContainer} from "react-navigation";
import {createMaterialTopTabNavigator} from "react-navigation-tabs";
import NavigationUtil from "../navigator/NavigationUtil";
import actions from "../action"
import { connect } from "react-redux";
import { onFlushPopularFavorite, onRefreshPopular } from "../action/popular";
import PopularItem from "../common/PopularItem";
import Toast, {DURATION} from 'react-native-easy-toast';
import NavigationBar from "../common/NavigationBar";
import FavoriteDao from "../expand/dao/FavoriteDao";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import LanguageDao, { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import CheckBox from "@react-native-community/checkbox";
import ArrayUtil from "../util/ArrayUtil";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const pageSize = 10;

/**
 * PopularPage
 */
export class CustomKeyPage extends React.Component{
  constructor(props) {
    super(props);
    this.params = props.navigation.state.params;
    this.backpress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    this.changeValues = [];
    this.flag = this.params.flag;
    console.log('this.flag: ' +this.flag);
    this.isRemoveKey = this.params.isRemoveKey;
    this.languageDao = new LanguageDao(this.flag);
    this.state={
      keys: []
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState),
      };
    }
    return null;
  }

  componentDidMount() {
    this.backpress.componentDidMount();
    const keys = CustomKeyPage._keys(this.props);
    if(keys.length === 0) {  //load keys data from config file if there is no tabs.
      const {onLoadLanguage} = this.props;
      onLoadLanguage(this.flag);
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props),
    });
  }

  componentWillUnmount() {
    this.backpress.componentDidMount();
  }

  /**
   * extract the keys from props
   * @param props
   * @param original
   * @param state
   * @returns {*}
   * @private
   */
  static _keys(props, original, state){
    const {flag, isRemoveKey} = props.navigation.state.params;
    const key = flag === FLAG_LANGUAGE.flag_language ? 'languages': 'keys';
    if ( isRemoveKey && !original){ // data with all checked set false
      return props.language[key].map(val=>{
        return {
          ...val,
          checked: false,
        }
      })
    } else { // original data for both modes
      return props.language[key];
    }

  }

  // android go back callback
  onBackPress(e) {
    this.onBack();
    return true;
  }

  // callback when go back
  onSave(){
    let keys;
    if (this.isRemoveKey) { // remove tag
      keys = CustomKeyPage._keys(this.props, true);
      for(let item of this.changeValues){
        ArrayUtil.remove(keys, item, 'name');
      }
    }
    // refresh the local storage
    this.languageDao.save(keys || this.state.keys);
    // refresh redux store
    const {onLoadLanguage} = this.props;
    onLoadLanguage(this.flag);
    NavigationUtil.goBack(this.props.navigation);
  }

  onBack(){
    if (this.changeValues.length > 0){
      Alert.alert('Alert', 'Save Change?',
        [
          {text: 'Yes', onPress: ()=>{
              this.onSave();
            }},
          {
            text: 'No', onPress: () =>{
              NavigationUtil.goBack(this.props.navigation);
            }
          }])
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }

  }

  // callback on toggle checkbox
  onClick(item, index) {
    item.checked = !item.checked;
    ArrayUtil.updateArray(this.changeValues, item);
    // change keys in state to rerender
    this.state.keys[index] = item;
    this.setState({
      keys: this.state.keys,
    })
  }

  renderCheckBox(item, index) {
    return (
      <View style={styles.checkbox}>
        <CheckBox
          value={item.checked}
          onValueChange={(newValue)=> this.onClick(item, index)}
          tintColors={{true: THEME_COLOR, false: THEME_COLOR}}
        />
        <Text>{item.name}</Text>
      </View>
    )
  }
  renderView() {
    const {keys} = this.state;
    const views = [];
    for(let i = 0; i < keys.length; i+= 2) {
      views.push(
        <View key={i} style={{flex: 1}}>
          <View style={styles.item}>
            {this.renderCheckBox(keys[i], i)}
            {i < keys.length - 1 && this.renderCheckBox(keys[i+ 1], i+1)}
          </View>
          <View style={styles.line}/>
        </View>
      );
    }
    return views;
  }

  render() {
    let title = this.isRemoveKey ? 'remove tags': 'custom tags';
    title = this.flag === FLAG_LANGUAGE.flag_language? 'custom languages': title;
    const rightButtonTitle = this.isRemoveKey? 'remove': 'save';
    const rightButton = ViewUtil.getRightButton(rightButtonTitle, () => this.onBack())
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(()=> this.onBack())}
      title={title}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={rightButton}
    />

    return (
      <View style={styles.container} >
        {navigationBar}
        <ScrollView>
          {this.renderView()}
        </ScrollView>
      </View>
    )
  }
}

const mapPopularStateToProps = state => ({
  language: state.Language,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage);


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
  },
  line:{
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray'
  },
  checkbox:{
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  }
})
