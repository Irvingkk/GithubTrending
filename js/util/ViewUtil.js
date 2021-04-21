import { Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import React from "react";

/**
 * used to create some common view(react component)
 */
export default class ViewUtil {
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








