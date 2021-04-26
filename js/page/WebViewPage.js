import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NavigationBar from "../common/NavigationBar";
import ViewUtil from "../util/ViewUtil";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import WebView from "react-native-webview";
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import FavoriteUtil from "../util/FavoriteUtil";
import BackPressComponent from "../common/BackPressComponent";

const url = 'https://github.com/';
const THEME_COLOR = '#678';
export default class WebViewPage extends React.Component{
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;
    this.state= {
      title: title,
      url: url,
      canGoBack: false,
    }
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
  }

  onBack() { // callback invoked when press leftButton in NavBar
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  share(){}


  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
      title: navState.url
    })
  }
  onBackPress(){
    this.onBack();
    return true;
  }

  render() {
    // debugger
    const titleLayoutStyle = this.state.title.length > 20? {paddingRight: 30}: null;
    const NavBar = <NavigationBar
      title={this.state.title}
      style={{backgroundColor: THEME_COLOR}}
      leftButton={ViewUtil.getLeftBackButton(()=> {
        this.onBackPress();
      })}
    />
    return (
      <View style={styles.container}>
        {NavBar}
        <WebView
          ref={webView=> this.webView = webView}
          source={{uri: this.state.url}}
          startInLoadingState={true}
          onNavigationStateChange={e=>{
            this.onNavigationStateChange(e)
          }}

        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
