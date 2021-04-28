import React from 'react';
import {Modal, Image, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TimeSpan from "../model/TimeSpan";
export const TimeSpans = [new TimeSpan('today', 'since=daily'),
  new TimeSpan('this week', 'since=weekly'), new TimeSpan('this month', 'since=monthly'),]

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
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={()=> onClose}
      >
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.dismiss()}
        >
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />
          <View style={styles.content}>
            {TimeSpans.map((element, i, arr)=>{
              return (<TouchableOpacity
                underlayColor={'transparent'}
                onPress={()=> {onSelect(element)}}
                key={i}
              >
                <View style={styles.text_container}>
                  <Text style={styles.text}>{element.showText}</Text>
                  {i !== arr.length - 1? <View style={styles.line} />: null}
                </View>
              </TouchableOpacity>)
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    alignItems: 'center'
  },
  arrow: {
    marginTop: 40,
    margin: -15,
    color: 'white',
    padding: 0
  },
  content: {
    borderRadius: 3,
    backgroundColor: 'white',
    paddingTop: 3,
    paddingBottom: 3,
  },
  text_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26,
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray'
  }
})


















