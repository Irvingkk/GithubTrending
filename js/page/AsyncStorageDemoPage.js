import React from "react";
import PopularPage from "./PopularPage";
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import NavigationUtil from "../navigator/NavigationUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";

const key = '@storage_key'
export default class AsyncStorageDemoPage extends React.Component{
  constructor(props) {
    super(props);
    this.state= {
      showText: ''
    }
  }

  render() {
    return (<View style={styles.container}>
      <Text style={styles.welcome}>AsyncStorageDemoPage</Text>
      <TextInput style={styles.input} onChangeText={(text)=> {
        this.value = text;
      }}/>
      <View style={styles.button_container}>
        <Button style={styles.button} title={'SAVE'} onPress={()=>{
          this.onSave(key);
        }} />
        <Button style={styles.button} title={'GET'} onPress={()=>{
          this.onGet(key);
        }} />
        <Button style={styles.button} title={'DELETE'} onPress={()=>{
          this.onDelete(key);
        }} />
      </View>
      <Text>
        {this.state.showText}
      </Text>
    </View>)
  }


  async onSave(){
    try {
      await AsyncStorage.setItem(key, this.value);
    } catch (e) {
      console.log(e.toString());
    }
  }
  async onGet() {
    AsyncStorage.getItem(key, (e, result)=> {
      if (e) {
        console.log(e.toString());
      } else {
        this.setState({
          showText: result
        })
      }
    })
  }
  async onDelete() {
    AsyncStorage.removeItem(key)
      .catch(e =>{
        console.log(e.toString());
      })
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
  },
  button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  button: {
    borderWidth: 1
  },
  input: {
    height: 30,
    width: 260,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
  },
})


