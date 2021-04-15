import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { onThemeChange } from "../action/theme";
import {connect} from "react-redux";

class MyPage extends React.Component{
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
        <Button title={'change theme'} onPress={()=>{
          // navigation.setParams({
          //   theme: {
          //     tintColor: 'red',
          //     updateTime: new Date().getTime()
          //   }
          // })
          this.props.onThemeChange('red');
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

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(onThemeChange(theme))
})

export default connect(null, mapDispatchToProps)(MyPage)

