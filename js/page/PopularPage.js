import React from "react";
import { Button, StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator } from "react-native";
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

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const pageSize = 10;

export default class PopularPage extends React.Component{
  constructor(props) {
    super(props);
    this.tabNames = ['python', 'js','go'];
    this.isFavoriteChange = false;
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index)=>{
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item}/>,
        navigationOptions: {
          tabBarLabel: item
        }
      }
    })
    return tabs;
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={'Hot'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />

    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
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
    return (
      <View style={styles.container} >
        {navigationBar}
        <TabNavigator />
      </View>
    )
  }
}

class PopularTab extends React.Component {
  constructor(props) {
    super(props);
    const {tabLabel } = this.props;
    this.storeName = tabLabel;
    console.log('storeName:' + this.storeName);
  }

  componentDidMount() {
    this.loadData(false);
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = data => {
      this.isFavoriteChange = true;
    })
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data =>{
      if(data.to === 0 && this.isFavoriteChange) {
        this.loadData(null, true);
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  loadData(isLoadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props;
    const store = this.getStore();

    if (isLoadMore) {
      // debugger
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (message)=>{
        this.refs.toast.show(message);
      });
    } else if(refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
      // debugger
      onRefreshPopular(this.storeName, this.getFetchURL(this.storeName), pageSize, favoriteDao);
    }
  }

  getStore(){
    const {popular} = this.props;
    let store = popular[this.storeName];
    // debugger
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
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    return (
      <PopularItem
        projectModel={item}
        onSelect={(callback)=> {
          NavigationUtil.goTo('DetailPage', {
            projectModel: item,
            flag: FLAG_STORAGE.flag_popular,
            callback: callback
          })
        }}
        onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
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
                  renderItem={
                    // data is a object generated by flatlist, it wraps a single item of
                    // store.projectModels, you can access that wrapped item by data.item
                    data => this.renderItem(data)}
                  // projectModel is a single element in the store.projectModels
                  // projectModel is a single element in the store.projectModels
                  keyExtractor={projectModel =>""+ projectModel.item.id}
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
                    this.loadData(true);
                  }}

                  onEndReachedThreshold={0.5}
        />
        <Toast ref={'toast'}
               position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  popular: state.Popular,
});
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, dataArray, favoriteDao, callBack) =>
    dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, dataArray, favoriteDao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, dataArray, favoriteDao) =>
    dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray, favoriteDao)),
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);


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
