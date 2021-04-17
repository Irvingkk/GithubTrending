import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {createAppContainer} from "react-navigation";
import {createMaterialTopTabNavigator} from "react-navigation-tabs";
import NavigationUtil from "../navigator/NavigationUtil";

export default class PopularPage extends React.Component{
  constructor(props) {
    super(props);
    this.tabNames = ['JS','Java','C','C++', 'C#','Python','Ruby','PHP','GO'];
  }

  _genTabs() {
    const tabs = {}
    this.tabNames.forEach((item, index)=>{
      tabs[`tab${index}`] = {
        screen: props => index === 0?
          (<PopularTab {...props} tabLabel={item} isZero={true}/>):
          (<PopularTab {...props} tabLabel={item} isZero={false}/>),
        navigationOptions: {
          tabBarLabel: item
        }
      }
    })
    return tabs;
  }

  render() {
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),{
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          indicatorStyle: styles.indicatorStyle,
          upperCaseLabel: false,
          style: {
            backgroundColor: '#a67'
          },
          scrollEnabled: true,
          labelStyle: styles.labelStyle
        }
      }
    ))
    return (
      <View style={styles.container} >
        <TabNavigator />
      </View>
    )
  }
}

class PopularTab extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.welcome}>PopularPage</Text>
        {this.props.isZero && <Text style={styles.welcome} onPress={() => {
          NavigationUtil.goTo( 'DetailPage',{navigation: this.props.navigation},)
        }}>jump to DetailPage</Text>}
        <Button title={'useFetch'} onPress={()=>{
          NavigationUtil.goTo( 'FetchDemoPage',{navigation: this.props.navigation});
        }} />
        <Button title={'useAsyncStorage'} onPress={()=>{
          NavigationUtil.goTo( 'AsyncStorageDemoPage',{navigation: this.props.navigation});
        }} />
        <Button title={'data cache system demo'} onPress={()=>{
          NavigationUtil.goTo( 'DataStoreDemoPage',{navigation: this.props.navigation});
        }} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6
  }
})
