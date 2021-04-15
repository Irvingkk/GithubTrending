import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default class FavoritePage extends React.Component{
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FavoritePage</Text>
        <Button title={'change theme'} onPress={()=>{
          navigation.setParams({
            theme: {
              tintColor: 'pink',
              updateTime: new Date().getTime()
            }
          })
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
