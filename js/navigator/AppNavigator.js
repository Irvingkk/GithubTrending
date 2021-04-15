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
    screen: DetailPage
  },
  FetchDemoPage: {
    screen: FetchDemoPage
  }
})

const SwitchNavigator = createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
})

export default createAppContainer(SwitchNavigator);

