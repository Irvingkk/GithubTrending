import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NavigationBar from "../common/NavigationBar";
import ViewUtil from "../util/ViewUtil";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import WebView from "react-native-webview";
import NavigationUtil from "../navigator/NavigationUtil";

const url = 'https://github.com/';
const THEME_COLOR = '#678';
export default class DetailPage extends React.Component{
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {item} = this.params;
    this.url = item.html_url || url + item.fullName;
    const title = item.full_name || item.fullName;
    this.state= {
      title: title,
      url: this.url,
      canGoBack: false,
    }
  }

  onBack() { // callback invoked when press leftButton in NavBar
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  share(){}
  renderRightButton(){
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() =>{

        }}>
        <FontAwesome
          name={'star-o'}
          size={20}
          style={{color: 'red', marginRight: 10}}
        />
      </TouchableOpacity>
      {ViewUtil.getShareButton(this.share())}
    </View>
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }

  render() {
    const titleLayoutStyle = this.state.title.length > 20? {paddingRight: 30}: null;
    const NavBar = <NavigationBar
      title={this.state.title}
      titleLayoutStyle={titleLayoutStyle}
      hide={false}
      style={{backgroundColor: THEME_COLOR}}
      leftButton={ViewUtil.getLeftBackButton(()=> {
        this.onBack();
      })}
      rightButton={this.renderRightButton()}
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
