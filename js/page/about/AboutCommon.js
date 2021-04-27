import React from "react";
import { Text, View, Image, StyleSheet, Dimensions } from "react-native";
import config from "../../res/data/config.json"
import BackPressComponent from "../../common/BackPressComponent";
import NavigationUtil from "../../navigator/NavigationUtil";
import ParallaxScrollView from "react-native-parallax-scroll-view"
import GlobalStyles from "../../res/styles/GlobalStyles";
import { Platform } from "react-native";
import ViewUtil from "../../util/ViewUtil";


const THEME_COLOR = '#678';
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = (Platform.OS === 'ios') ? 20 : 0;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + TOP : GlobalStyles.nav_bar_height_android;
const window = Dimensions.get('window');
export const FLAG_ABOUT ={flag_about: 'about', flag_about_me: 'about_me'};
export default class AboutCommon{
  constructor(props, updateState) {
    this.props = props;
    this.backpress = new BackPressComponent({backPress: ()=> this.onBackPress()});
    this.updateState = updateState;
  }

  onBackPress() {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }

  onShare() {

  }

  componentDidMount (){
    this.backpress.componentDidMount();

    this.updateState({data: config,});
  }
  componentWillUncount() {
    this.backpress.componentWillUnmount();
  }

  getParallaxRenderConfig(params) {
    let config={};
    const avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar}: params.avatar;
    config.renderBackground = ()=> (
      <View key="background">
        <Image source={{
          uri: params.backgroundImg,
          width: window.width,
          height: PARALLAX_HEADER_HEIGHT}}/>
        <View style={{position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT}}/>
      </View>
    )

    config.renderForeground=() => (
      <View key="parallax-header" style={ styles.parallaxHeader }>
        <Image style={ styles.avatar }
               source={avatar}/>
        <Text style={ styles.sectionSpeakerText }>
          {params.name}
        </Text>
        <Text style={ styles.sectionTitleText }>
          {params.description}
        </Text>
      </View>
    )

    config.renderStickyHeader=() => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    )

    config.renderFixedHeader=() => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() => this.onBackPress())}
        {ViewUtil.getShareButton(()=> this.onShare())}
      </View>
    )
    return config;
  }

  render(contentView, params) {
    const renderConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor={THEME_COLOR}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        {...renderConfig}
        >
        {contentView}
      </ParallaxScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: TOP,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingRight: 8,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
  },
});















