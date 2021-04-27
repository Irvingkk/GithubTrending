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
import Utils from "../../util/Utils";


const THEME_COLOR = '#678';
type Props ={}
export default class AboutMePage extends React.Component{
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me,
    }, data=> this.setState({...data}))
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showContact: false,
    }
  }

  /**
   * callback for a single item, menu is used to detect item type
   * @param menu
   */
  onClick(tag) {
    if(!tag) return;

    // tag have a url property to open
    if(tag.url) {
      NavigationUtil.goTo('WebViewPage', {
        title: tag.title,
        url: tag.url,
      })
      return;
    }

    // tag have a email property to open
    if(tag.account) {
      let url = 'mailto://' + tag.account;
      Linking.canOpenURL(url)
        .then(isSupport=>{
          if(isSupport){
            Linking.openURL(url);
          } else {
            console.log('Can\'t open this url')
          }
        })
        .catch(e=>{
          console.error('An Error occurred when try to open url: ' + e);
        })
      return;
    }
    console.error('tag pass to onClick can\'t be handled');
  }


  /**
   * render item with expandable icon
   * @param menu
   * @param isShow
   * @param key
   * @returns {JSX.Element}
   * @private
   */
  _item(menu, isShow, key) {
    return ViewUtil.getSettingItem(() =>{
      this.setState({
        [key]: !this.state[key],
      })
    }, menu.name, THEME_COLOR, Ionicons, menu.icon, isShow ? 'ios-arrow-up': 'ios-arrow-down');
  }

  /**
   * render each sub item
   * @param tagArr
   * @param isShowAccount Contact type has account number, others don't
   * @returns {null|[]}
   */
  renderItems(tagArr, isShowAccount) {
    // debugger
    if (!tagArr) {
      return null;
    }
    let views =[];
    for (let i in tagArr) {
      const title = isShowAccount? tagArr[i].title + ': ' + tagArr[i].account: tagArr[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(()=>{this.onClick(tagArr[i])}, title, THEME_COLOR)}
        </View>);
    }
    return views;
  }

  render() {
    const content = (
      <View>
        {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
        <View style={GlobalStyles.line} />
        {this.state.showTutorial? this.renderItems(this.state.data.aboutMe.Tutorial.items, false): null}

        {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
        <View style={GlobalStyles.line} />
        {this.state.showBlog? this.renderItems(this.state.data.aboutMe.Blog.items, false): null}

        {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
        <View style={GlobalStyles.line} />
        {this.state.showContact? this.renderItems(this.state.data.aboutMe.Contact.items, true): null}

    </View>
    )
    return this.aboutCommon.render(content, this.state.data.author);
  }
}





