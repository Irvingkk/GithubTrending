import React from "react";
import PopularPage from "./PopularPage";
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";
import NavigationUtil from "../navigator/NavigationUtil";

export default class HomePage extends React.Component{
  render() {
    // fix can't jump to outer navigation routes from inside the dynamicTabNavigation
    NavigationUtil.navigation = this.props.navigation;
    return <DynamicTabNavigator/>;
  }
}


