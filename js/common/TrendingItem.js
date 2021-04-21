import React from 'react';
import { Image, TouchableOpacity, View, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default class TrendingItem extends React.Component {
  render() {
    const {item, onSelect} = this.props;
    if (!item) return null;
    let favoriteButton =
      <TouchableOpacity
        style={{padding: 6}}
        // onPress={}
        underlayColor={'transparent'}>
        <FontAwesome
          name={'star-o'}
          size={26}
          style={{color: 'red'}}
        />
      </TouchableOpacity>
    return (
      <TouchableOpacity
        onPress={onSelect}
      >
        <View style={styles.cell_container}>
          <Text style={styles.title}>
            {item.fullName}
          </Text>
          <Text style={styles.description}>
            {item.description}
          </Text>
          <Text style={styles.description}>
            {item.meta}
          </Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Contributors:</Text>
              {item.contributors.map((element, i, arr) => (
                <Image
                  key={i}
                  style={{height: 22, width: 22, margin: 2}}
                  source={{uri: element}} />
              ))}
            </View>
            <View style={styles.row}>
              <Text>Stars:</Text>
              <Text>{item.starCount}</Text>
            </View>
            {favoriteButton}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  cell_container: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor:'#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'grey',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121'
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575'
  }
}
