import React from "react";
import {StyleSheet, Text, View, Button} from "react-native";

export default class FetchDemoPage extends React.Component{
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FetchDemoPage</Text>
        <Button title={} onPress={} />
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
