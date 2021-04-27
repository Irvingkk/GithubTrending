import React from "react";
import { Button, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { onThemeChange } from "../../action/theme";
import {connect} from "react-redux";
import NavigationUtil from "../../navigator/NavigationUtil";
import NavigationBar from "../../common/NavigationBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { MORE_MENU } from "../../common/MORE_MENU";
import ViewUtil from "../../util/ViewUtil";
import GlobalStyles from "../../res/styles/GlobalStyles";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import config from "../../res/data/config.json"


const THEME_COLOR = '#678';
type Props ={}
export default class AboutPage extends React.Component{
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about,
    }, data=> this.setState({...data}))
    this.state = {
      data: config,
    }
  }

  onClick(menu) {
    let RouteName, params = {};
    switch(menu) {
      case MORE_MENU.Tutorial:
        RouteName='WebViewPage';
        params.title = 'Tutorial';
        params.url= 'www.google.com';
        break;
      case MORE_MENU.About_Author:
        RouteName='AboutMePage';
        break;
      case MORE_MENU.Feedback:
        const url = 'mailto://' + 'irvingyyao@gmail.com';
        Linking.canOpenURL(url)
          .then(isSupport =>{
            if(isSupport) {
              Linking.openURL(url);
            } else {
              console.log('Can\'t open url!');
            }
          })
          .catch(e=>{
            console.error('An error occurred when try to open url: ' + e);
          })
    }
    if (RouteName) {
      NavigationUtil.goTo(RouteName, params);
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(()=>{this.onClick(menu)}, menu, THEME_COLOR);
  }
  render() {
    const content = (
      <View>
        {this.getItem(MORE_MENU.Tutorial)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.About_Author)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.Feedback)}
        <View style={GlobalStyles.line} />
    </View>
    )
    return this.aboutCommon.render(content, this.state.data.app);
  }
}





