import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import DataStore from "../expand/DataStore";

export default class DetailPage extends React.Component{
  constructor(props) {
    super(props);
    this.searchKey = '';
    this.dataStore = new DataStore();
    this.state = {
      showText: ''
    }
  }
  onLoadData() {
    const url= `https://api.github.com/search/repositories?q=${this.searchKey}`
    this.dataStore.fetchData(url)
      .then(wrapData => {
        const showText = `${new Date(wrapData.timestamp)}\n${JSON.stringify(wrapData.data)}`;
        this.setState({
          showText: showText
        })
      })
      .catch(e=> {
        console.error(e.toString());
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>DetailPage</Text>
        <TextInput style={{width: 300, borderWidth: 1}} onChangeText={text => {
          this.searchKey = text;
        }}/>
        <Button title={'fetch Data'} onPress={() => {
          this.onLoadData();
        }} />
        <Text>
          {this.state.showText}
        </Text>
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
