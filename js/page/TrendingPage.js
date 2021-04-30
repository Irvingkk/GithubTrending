import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";
import {createAppContainer} from "react-navigation";
import {createMaterialTopTabNavigator} from "react-navigation-tabs";
import NavigationUtil from "../navigator/NavigationUtil";
import actions from "../action"
import { connect } from "react-redux";
import TrendingItem from "../common/TrendingItem";
import Toast, {DURATION} from 'react-native-easy-toast';
import NavigationBar from "../common/NavigationBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TrendingDialog, {TimeSpans} from "../common/TrendingDialog";
import FavoriteDao from "../expand/dao/FavoriteDao";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import { onLoadLanguage } from "../action/language";
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
const URL = 'https://github.com/trending/';
const THEME_COLOR = '#678';
const pageSize = 10;
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';

export class TrendingPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      timeSpan: TimeSpans[0],
    }
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKey = [];
  }

  _genTabs() {
    const {languages} = this.props;
    const tabs = {};
    this.preKey = {...languages};
    // debugger
    languages.forEach((item, index)=>{
      if(item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} path={item.path}/>,
          navigationOptions: {
            tabBarLabel: item.name
          }
        }
      }
    })
    return tabs;
  }

  _tabNav() {
    /** optimize the timeSpan refreshing, when timeSpan change, only rerender tabs
      * instead of tab navigator;
      * Also rerender navigator when tab length updates*/
    if (!this.tabNav || !ArrayUtil.isEqual(this.preKey, this.props.languages)){
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(),{
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            indicatorStyle: styles.indicatorStyle,
            upperCaseLabel: false,
            style: {
              backgroundColor: '#a67'
            },
            scrollEnabled: true,
            labelStyle: styles.labelStyle
          },
          lazy: true,
        }
      ))
    }
    return this.tabNav;
  }

  onSelectTimeSpan(timeSpan) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: timeSpan,
    })
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, timeSpan);
  }
  renderTrendingDialog() {
    return <TrendingDialog
      ref={dialog=>this.dialog = dialog}
      onSelect={(tab)=> this.onSelectTimeSpan(tab)}
    />
  }

  renderTitleView() {
    return (<View>
        <TouchableOpacity
          underlayColor={'transparent'}
          onPress={()=> this.dialog.show()}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{
              fontSize: 18,
              color:'#FFFFFF',
              fontWeight: '400'
            }}>Trending {this.state.timeSpan.showText}</Text>
            <MaterialIcons
              name={'arrow-drop-down'}
              size={22}
              style={{color: 'white'}}
            />
          </View>
        </TouchableOpacity>
    </View>
    )
  }

  render() {
    let {languages}= this.props;
    if(!languages) {
      setTimeout(null, 2000);
      languages = this.props.languages;
    }
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />

    // dynamically create TabNavigator with tabs
    const TabNavigator = languages.length ? this._tabNav(): null;
    return (
      <View style={styles.container} >
        {navigationBar}
        {TabNavigator ? <TabNavigator />: null}
        {this.renderTrendingDialog()}
      </View>
    )
  }
}

const mapTrendingStateToProps = state => ({
  languages: state.Language.languages,
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);

class TrendingTab extends React.Component {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
    this.isFavoriteChange = false;
    console.log('storeName:' + this.storeName);
  }

  componentDidMount() {
    this.loadData(false);
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData(false);
    })

    // set EventBus listeners
    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.onFavoriteTrendingChangeListener = data=>{
      this.isFavoriteChange = true;
    })
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.onBottomTabChangeListener = data=>{
      if(data.to === 1 && this.isFavoriteChange) {
        this.loadData(null, true);
      }
    })
  }
  componentWillUnmount() {
    if(this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }

    EventBus.getInstance().removeListener(this.onFavoriteTrendingChangeListener);
    EventBus.getInstance().removeListener(this.onBottomTabChangeListener);
  }

  loadData(isLoadMore, flushFavorite) {
    const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
    const store = this.getStore();

    if (isLoadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (message)=>{
        this.refs.toast.show(message);
      });
    } else if (flushFavorite){
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
      console.log('store: ' + store);
      onRefreshTrending(this.storeName, this.getFetchURL(this.props.path), pageSize, favoriteDao);
    }
  }

  getStore(){
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        projectModels: [],
        hideLoadingMore: true,
        isLoading: false,
      }
    }
    return store;
  }

  getFetchURL(key) {
    const url = URL + key + '?' + this.timeSpan.searchText;
    return url
  }

  renderItem(data) {
    const item = data.item;
    return (
      <TrendingItem
        projectModel={item}
        onFavorite={(item, isFavorite) => {FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}}
        onSelect={(callback)=> {
          NavigationUtil.goTo('DetailPage', {
            projectModel: item,
            flag: FLAG_STORAGE.flag_trending,
            callback: callback,
          })
        }}
      />
    )
  }

  getIndicator(){
    return this.getStore().hideLoadingMore? null:
      (<View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator}/>
        <Text>loading more</Text>
      </View>)
  }

  render() {
    const store = this.getStore();
    return (
      <View style={styles.container}>
        <FlatList data={store.projectModels}
                  renderItem={data => this.renderItem(data)}
                  keyExtractor={item =>""+ item.item.fullName}
                  refreshControl={(
                    <RefreshControl
                      title ={'loading'}
                      titleColor={THEME_COLOR}
                      colors ={[THEME_COLOR]}
                      refreshing={store.isLoading}
                      onRefresh={() =>{
                        this.loadData(false);
                      }}
                      tintColor={THEME_COLOR}
                    />
                  )}
                  ListFooterComponent={() => this.getIndicator()}
                  onEndReached={()=>{
                    setTimeout(()=>{
                      this.loadData(true);
                    }, 1000)
                  }}

                  onEndReachedThreshold={0}
        />
        <Toast ref={'toast'}
               position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  trending: state.Trending,
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callBack) =>
    dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, favoriteDao, callBack)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, dataArray, favoriteDao) =>
    dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray, favoriteDao)),
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    margin: 10,
    color: 'red'
  }
})
