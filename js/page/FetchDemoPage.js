import React from "react";
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from "react-native";

export default class FetchDemoPage extends React.Component{
  constructor(props) {
    super(props);
    this.state ={
      showText: ''
    }
  }
  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    if (!this.searchKey) {
      this.setState({
        showText: 'no input'
      })
      return;
    }
    let result = '';
    fetch(url)
      .then(request => {
        if (request.ok) {
          return request.text();
        }
        throw new Error('request fail');
      })
      .then(requestText => {
        this.setState({
          showText: requestText
        })
      })
      .catch(e => {
        this.setState({
          showText: e.toString()
        })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FetchDemoPage</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input}
                     onChange={text => {
                       this.searchKey = text;
                     }} />
          <Button title={'Search'} onPress={()=>{
            this.loadData();
          }} />
        </View>
        <ScrollView>
          <Text>
            {this.state.showText}
          </Text>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  input: {
    height: 30,
    width: 260,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
