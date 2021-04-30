import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from "react-navigation-stack";
import {createBottomTabNavigator} from "react-navigation-tabs";
import WelcomePage from "../page/WelcomePage";
import HomePage from "../page/HomePage";
import MyPage from "../page/MyPage";
import FavoritePage from "../page/FavoritePage";
import TrendingPage from "../page/TrendingPage";
import DetailPage from "../page/DetailPage";
import FetchDemoPage from "../page/FetchDemoPage";
import AsyncStorageDemoPage from "../page/AsyncStorageDemoPage"
import DataStoreDemoPage from "../page/DataStoreDemoPage"
import WebViewPage from "../page/WebViewPage";
import AboutPage from "../page/about/AboutPage";
import AboutMePage from "../page/about/AboutMePage";
import CustomKeyPage from "../page/CustomKeyPage";

const InitNavigator = createStackNavigator({
    WelcomePage: {
      screen: WelcomePage,
      navigationOptions: {
        headerShown: false
      }
    }
  })

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      headerShown: false
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      headerShown: false
    }
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  AboutMePage: {
    screen: AboutMePage,
    navigationOptions: {
      headerShown: false,
    }
  },
  CustomKeyPage: {
    screen: CustomKeyPage,
    navigationOptions: {
      headerShown: false,
    }
  }
})

const SwitchNavigator = createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
})

export default createAppContainer(SwitchNavigator);

