import React from 'react'
import {StyleSheet,View, Text} from 'react-native'
import NavigationUtil from "../navigator/NavigationUtil";

export default class WelcomePage extends React.Component{
  componentDidMount() {
    this.timer = setTimeout(()=>{
      NavigationUtil.resetToHomePage(this.props);
    }, 5000)
  }

  componentWillUnmount() {
    // remove timer when unmount
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>WelcomePage</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
