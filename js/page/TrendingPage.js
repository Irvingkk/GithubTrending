import React from "react";
import {StyleSheet, Text, View, Button} from "react-native";
import actions from "../action"
import { onThemeChange } from "../action/theme";
import { connect } from "react-redux";

class TrendingPage extends React.Component{
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>TrendingPage</Text>
        <Button title={'change theme'} onPress={()=>{
          // navigation.setParams({
          //   theme: {
          //     tintColor: 'orange',
          //     updateTime: new Date().getTime()
          //   }
          // })
          this.props.onThemeChange('orange')
        }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})

const mapDispatchToProps = dispatch=>({
  onThemeChange: theme=> dispatch(actions.onThemeChange(theme))
})
export default connect(null, mapDispatchToProps)(TrendingPage)
