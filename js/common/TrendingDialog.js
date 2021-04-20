import React from 'react';
import {Modal, Image, TouchableOpacity, View, Text } from "react-native";

export default class TrendingDialog extends React.Component {
  state = {
    visible: false,
  }
  dismiss() {
    this.setState({
      visible: false,
    })
  }
  show() {
    this.setState({
      visible: true,
    })
  }
  render() {
    const {onClose, onSelect} = this.props;
    return undefined;
  }
}
