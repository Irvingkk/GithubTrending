import React from "react";
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { onThemeChange } from "../action/theme";
import {connect} from "react-redux";
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from "../common/NavigationBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { MORE_MENU } from "../common/MORE_MENU";
import ViewUtil from "../util/ViewUtil";
import GlobalStyles from "../res/styles/GlobalStyles";
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";


const THEME_COLOR = '#678';
class MyPage extends React.Component{
  getRightButton(){
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={()=>{
        }}>
        <View style={{padding: 5, marginRight: 8}}>
          <Feather
            name={'search'}
            size={24}
            style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  getLeftButton(callback) {
    return <TouchableOpacity
        onPress={callback}
        style={{padding: 8, paddingLeft: 12}}>
          <View>
            <Ionicons
              name={'ios-arrow-back'}
              size={26}
              style={{color: 'white'}}
            />
          </View>
        </TouchableOpacity>
  }
// https://coding.m.imooc.com/classindex.html?cid=304
  onClick(menu) {
    let RouteName, params = {};
    switch(menu) {
      case MORE_MENU.Tutorial:
        RouteName='WebViewPage';
        params.title = 'Tutorial';
        params.url= 'www.google.com';
        break;

      case MORE_MENU.Custom_Language:
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Remove_Key:
        RouteName= 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag = menu === MORE_MENU.Custom_Language? FLAG_LANGUAGE.flag_language: FLAG_LANGUAGE.flag_tag;
        break;

      case MORE_MENU.About:
        RouteName= 'AboutPage';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
    }
    if (RouteName) {
      NavigationUtil.goTo(RouteName, params);
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(()=>{this.onClick(menu)}, menu, THEME_COLOR);
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={'My Page'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={this.getRightButton()}
      leftButton={this.getLeftButton()}
    />
    const {navigation} = this.props;

    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
            onPress={() => this.onClick(MORE_MENU.About)}
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{
                  marginRight: 10,
                  color: THEME_COLOR,
                }}
              />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: THEME_COLOR,
              }}/>
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Tutorial)}
          {/*trending manage*/}
          <Text style={styles.groupTitle}>Trending Mode</Text>
          {/*pick language*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*language rank*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*Popular Management*/}
          <Text style={styles.groupTitle}>Popular Mode</Text>
          {/*pick tag*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*tag rank*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*remove tag*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*Setting*/}
          <Text style={styles.groupTitle}>Setting</Text>
          {/*pick theme*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*about author*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}/>
          {/*feedback*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  about_left: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray',
  },

})

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(onThemeChange(theme))
})

export default connect(null, mapDispatchToProps)(MyPage)

