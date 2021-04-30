import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import React from "react";

/**
 * used to create some common view(react component)
 */
export default class ViewUtil {

  /**
   * get the item of setting page
   * @param callBack invoked after click item
   * @param text shown text
   * @param color icon color
   * @param Icons component of 'react-native-vector-icons'
   * @param icon left icon
   * @param expandableIco right icon
   * @returns {JSX.Element}
   */
  static getSettingItem(callBack, text, color, Icons, icon, expandableIco) {
    return (
      <TouchableOpacity
        onPress={callBack}
        style={styles.setting_item_container}
      >
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          {Icons && icon ?
            <Icons
              name={icon}
              size={16}
              style={{color: color, marginRight: 10}}
            /> :
            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIco ? expandableIco : 'ios-arrow-forward'}
          size={16}
          style={{
            marginRight: 10,
            alignSelf: 'center',
            color: color || 'black',
          }}/>
      </TouchableOpacity>
    );
  }

  /**
   * get the item of setting page
   * @param callBack
   * @param menu
   * @param color
   * @param expandableIco
   * @returns {*}
   */
  static getMenuItem(callBack, menu, color, expandableIco) {
    return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIco);
  }

  static getLeftBackButton(callback) {
    return <TouchableOpacity
      onPress={callback}
      style={{ padding: 8, paddingLeft: 12 }}>
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{ color: 'white' }}
      />
    </TouchableOpacity>
  }

  static getRightButton(title, callBack) {
    return <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={callBack}>
      <Text style={{fontSize: 20, color: '#FFFFFF', marginRight: 10}}>{title}</Text>
    </TouchableOpacity>;
  }

  static getShareButton(callback) {
    return <TouchableOpacity
      onPress={callback}
      underlayColor={'transparent'}>
      <Ionicons
        name={'md-share'}
        size={20}
        style={{ opacity: 0.9, marginRight: 10, color: 'white' }}
      />
    </TouchableOpacity>
  }

}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: 'white',
    padding: 10, height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});








