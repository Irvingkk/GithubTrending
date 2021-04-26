import React from "react";
import { Button, StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import {createAppContainer} from "react-navigation";
import {createMaterialTopTabNavigator} from "react-navigation-tabs";
import NavigationUtil from "../navigator/NavigationUtil";
import actions from "../action"
import { connect } from "react-redux";
import { onRefreshPopular } from "../action/popular";
import PopularItem from "../common/PopularItem";
import Toast, {DURATION} from 'react-native-easy-toast';
import NavigationBar from "../common/NavigationBar";
import FavoriteDao from "../expand/dao/FavoriteDao";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const pageSize = 10;

export default class FavoritePage extends React.Component{
  constructor(props) {
    super(props);
    this.tabNames = ['Hot', 'Trending'];
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

    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
      'Popular': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />,
        navigationOptions: {
          tabBarLabel: 'Hot'
        }
      },
      'Trending': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
        navigationOptions: {
          tabBarLabel: 'Trending'
        }
      },
    },
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          indicatorStyle: styles.indicatorStyle,
          upperCaseLabel: false,
          style: {
            backgroundColor: '#a67'
          },
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

class FavoriteTab extends React.Component {
  constructor(props) {
    super(props);
    const {flag } = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
    console.log('storeName:' + this.storeName);
  }

  componentDidMount() {
    this.loadData(false);
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data =>{
      if (data.to === 2) {
        this.loadData(false);
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener)
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    // dispatch a loadFavoriteData action, which load favorite from local using getMultiItem
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  getStore(){
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    // debugger
    if (!store) {
      store = {
        items: [],
        projectModels: [],
        isLoading: false,
      }
    }
    return store;
  }

  onFavorite(item, isFavorite){
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName);
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending);
    }
  }

  renderItem(data) {
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular? PopularItem: TrendingItem;
    return (
      <Item
        projectModel={item}
        onSelect={(callback)=> {
          NavigationUtil.goTo('DetailPage', {
            projectModel: item,
            flag: this.storeName,
            callback: callback
          })
        }}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    )
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
                  keyExtractor={projectModel =>""+ (projectModel.item.fullName? projectModel.item.fullName: projectModel.item.id)}
                  refreshControl={(
                    <RefreshControl
                      title ={'loading'}
                      titleColor={THEME_COLOR}
                      colors ={[THEME_COLOR]}
                      refreshing={store.isLoading}
                      onRefresh={() =>{
                        this.loadData(true);
                      }}
                      tintColor={THEME_COLOR}
                    />
                  )}
        />
        <Toast ref={'toast'}
               position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  favorite: state.Favorite,
});
const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (flag, isShownLoading) => dispatch(actions.onLoadFavoriteData(flag, isShownLoading)),
});

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);


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
