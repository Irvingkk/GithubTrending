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

const URL = 'https://github.com/trending/'
const QUERY_TIME = '?since=daily';
const THEME_COLOR = '#678';
const pageSize = 10;

export default class TrendingPage extends React.Component{
  constructor(props) {
    super(props);
    this.tabNames = ['python', 'ruby'];
    this.state = {
      timeSpan: TimeSpans[0],
    }
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index)=>{
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLabel={item}/>,
        navigationOptions: {
          tabBarLabel: item
        }
      }
    })
    return tabs;
  }

  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab,
    })
    // this.tab.setNativeProps ={
    //   timeSpan: tab
    // }
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
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
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
        {this.renderTrendingDialog()}
      </View>
    )
  }
}

class TrendingTab extends React.Component {
  constructor(props) {
    super(props);
    const {tabLabel } = this.props;
    this.storeName = tabLabel;
    this.state=({
      timeSpan: TimeSpans[0]
    })
    console.log('storeName:' + this.storeName);
  }

  componentDidMount() {
    this.loadData(false);
  }

  loadData(isLoadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this.getStore();

    if (isLoadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, (message)=>{
        this.refs.toast.show(message);
      });
    } else {
      console.log('store: ' + store);
      onRefreshTrending(this.storeName, this.getFetchURL(this.storeName), pageSize);
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
        projectModes: [],
        hideLoadingMore: true,
        isLoading: false,
      }
    }
    console.log('store.items' + store.items);
    return store;
  }

  getFetchURL(key) {
    // console.log("QUERY_TIME, KEY" + QUERY_TIME + key);
    return URL + key + '?since=daily';
  }

  renderItem(data) {
    const item = data.item;
    return (
      <TrendingItem
        item={item}
        onSelect={()=> {

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
        <FlatList data={store.projectModes}
                  renderItem={data => this.renderItem(data)}
                  keyExtractor={item =>""+ (item.id || item.fullName)}
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
  trending: state.Trending,
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, callBack) =>
    dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray, callBack)),
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
