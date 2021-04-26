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

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
const URL = 'https://github.com/trending/';
const THEME_COLOR = '#678';
const pageSize = 10;
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';

export default class TrendingPage extends React.Component{
  constructor(props) {
    super(props);
    this.tabNames = ['python', 'c'];
    this.state = {
      timeSpan: TimeSpans[0],
    }
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index)=>{
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}/>,
        navigationOptions: {
          tabBarLabel: item
        }
      }
    })
    return tabs;
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

  _tabNav() {
    if (!this.tabNav){ // optimize the timeSpan refreshing, only rerender child element,
      // rather than rerender the whole tab navigation while timeSpan change.
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
          }
        }
      ))
    }
    return this.tabNav;
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />

    const TabNavigator = this._tabNav();
    return (
      <View style={styles.container} >
        {navigationBar}
        <TabNavigator />
        {this.renderTrendingDialog()}
      </View>
    )
  }
}

class TrendingTab extends React.Component {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
    console.log('storeName:' + this.storeName);
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.loadData(false);
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData(false);
    })
  }
  componentWillUnmount() {
    console.log('componentDidMount')
    if(this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
  }

  loadData(isLoadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this.getStore();

    if (isLoadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (message)=>{
        this.refs.toast.show(message);
      });
    } else {
      console.log('store: ' + store);
      onRefreshTrending(this.storeName, this.getFetchURL(this.storeName), pageSize, favoriteDao);
    }
  }

  getStore(){
    const {trending} = this.props;
    console.log("trending: " + trending);
    let store = trending[this.storeName];
    console.log("trending, this.storeName, store: " + trending + this.storeName + store);
    if (!store) {
      store = {
        items: [],
        projectModels: [],
        hideLoadingMore: true,
        isLoading: false,
      }
    }
    console.log('store.items' + store.items);
    return store;
  }

  getFetchURL(key) {
    const url = URL + key + '?' + this.timeSpan.searchText;
    console.log('getFetchURL: ' + url);
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
