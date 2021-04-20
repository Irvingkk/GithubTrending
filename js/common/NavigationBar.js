import React from "react";
import PropTypes from "prop-types";
import { StatusBar, Text, View, ViewPropTypes, StyleSheet, Platform} from "react-native";
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = 20;

const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string
}
export default class NavigationBar extends React.Component {
  // type check
  static propTypes ={
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
  }
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    }
  }

  getButtonElement(button) {
    return (
      <View style={styles.navBarButton}>
        {button? button: null}
      </View>
    )
  }

  render() {
    let statusBar = this.props.statusBar.hidden? null:
      <View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar}/>
      </View>;

    let titleView = this.props.titleView? this.props.titleView :
      <Text ellipsizeMode={'head'} numberOfLines={1} style={styles.little}>{this.props.title}</Text>;
    let content = this.props.hide? null:
      <View style={styles.navBar}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={[styles.navBarTitleContainer, this.props.titleLayout]}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>
    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196f3'
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios'? NAV_BAR_HEIGHT_IOS: NAV_BAR_HEIGHT_ANDROID,
  },
  navBarButton: {
    alignItems: 'center',
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  statusBar: {
    height: Platform.OS === 'ios'? STATUS_BAR_HEIGHT: 0,
  }
})
