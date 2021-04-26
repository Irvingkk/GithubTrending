import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NavigationBar from "../common/NavigationBar";
import ViewUtil from "../util/ViewUtil";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import WebView from "react-native-webview";
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import FavoriteUtil from "../util/FavoriteUtil";

const url = 'https://github.com/';
const THEME_COLOR = '#678';
export default class DetailPage extends React.Component{
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel, flag} = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    const {item, isFavorite} = projectModel;
    this.url = item.html_url || url + item.fullName;
    const title = item.full_name || item.fullName;
    this.state= {
      isFavorite: isFavorite,
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

  onFavoriteButtonClick() {
    // debugger
    const {projectModel,callback} = this.params;
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
    callback(isFavorite);
    this.setState({
      isFavorite: isFavorite,
    })
    FavoriteUtil.onFavorite(this.favoriteDao, projectModel.item, isFavorite, this.params.flag);
    // debugger
  }

  share(){}
  renderRightButton(){
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() =>{
          this.onFavoriteButtonClick();
        }}>
        <FontAwesome
          name={this.state.isFavorite? 'star': 'star-o'}
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
    // debugger
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
