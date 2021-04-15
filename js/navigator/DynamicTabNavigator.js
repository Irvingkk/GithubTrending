import React, { Component } from "react";
import PopularPage from "../page/PopularPage";
import HomePage from "../page/HomePage";
import MyPage from "../page/MyPage";
import FavoritePage from "../page/FavoritePage";
import TrendingPage from "../page/TrendingPage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import {createBottomTabNavigator, BottomTabBar} from "react-navigation-tabs";
import {createAppContainer} from "react-navigation";
import { connect } from "react-redux";

const TABS = { // set bottom tabs router here
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: 'Hot',
      tabBarIcon: ({tintColor,focused}) => (
        <MaterialIcons name={'whatshot'}
                       size={26}
                       style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: 'Trend',
      tabBarIcon: ({tintColor,focused}) => (
        <Ionicons name={'md-trending-up'}
                  size={26}
                  style={{color: tintColor}}
        />
      )
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: 'Favorite',
      tabBarIcon: ({tintColor,focused}) => (
        <MaterialIcons name={'favorite'}
                       size={26}
                       style={{color: tintColor}}
        />
      )
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: 'Me',
      tabBarIcon: ({tintColor,focused}) => (
        <Entypo name={'user'}
                size={26}
                style={{color: tintColor}}
        />
      )
    }
  }
}

class DynamicTabNavigator extends Component{
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }

  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs;
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};
    PopularPage.navigationOptions.tabBarLabel = 'Hot D';
    this.Tabs = createAppContainer(createBottomTabNavigator(
      tabs,{
        tabBarComponent: props => (
          <TabBarComponent {...props} theme={this.props.theme}/>
        )
        // tabBarComponent: props =>{
        //   return <TabBarComponent {...props} />
        // }
      }
    ))
    return this.Tabs;
  }

  render() {
    const BottomTabNav = this._tabNavigator();
    return <BottomTabNav />;
  }
}

class TabBarComponent extends Component {
  // constructor(props) {
  //   super(props);
  //   this.theme = {
  //     tintColor: 'blue',
  //     updateTime: new Date().getTime()
  //   }
  // }

  // render() {
  //
  //   const {routes, index} = this.props.navigation.state;
  //   if (routes[index].params) {
  //     const {theme} = routes[index].params;
  //     if (theme && theme.updateTime && theme.updateTime > this.theme.updateTime) {
  //       this.theme = theme;
  //     }
  //   }
  //   return <BottomTabBar
  //     {...this.props}
  //     activeTintColor={this.theme.tintColor}
  //   />
  // }

  render() {
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.props.theme}
    />;
  }
}


const mapStateToProps = state => ({
  theme: state.Theme.theme
})
export default connect(mapStateToProps)(DynamicTabNavigator);















