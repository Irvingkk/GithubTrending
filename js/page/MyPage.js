import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { onThemeChange } from "../action/theme";
import {connect} from "react-redux";
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from "../common/NavigationBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
const THEME_COLOR = '#678';


class MyPage extends React.Component{
  getRightButton(){
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={()=>{
        }}>
        <View style={{padding: 5, marginRight: 8}}>
          <Feather
            name={'search'}
            size={24}
            style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  getLeftButton(callback) {
    return <TouchableOpacity
        onPress={callback}
        style={{padding: 8, paddingLeft: 12}}>
          <View>
            <Ionicons
              name={'ios-arrow-back'}
              size={26}
              style={{color: 'white'}}
            />
          </View>
        </TouchableOpacity>
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={'My Page'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
      rightButton={this.getRightButton()}
      leftButton={this.getLeftButton()}
    />
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        {navigationBar}
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
        <Text style={styles.welcome} onPress={() => {
          NavigationUtil.goTo( 'DetailPage',{navigation: this.props.navigation},)
        }}>jump to DetailPage</Text>
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
    flex: 1,
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

