import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
export default class BaseItem extends React.Component{
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    }
  }

  setFavoriteState(isFavorite) { //set favorite to state and projectModel
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite: isFavorite,
    })
  }
  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite); //save favorite to local db
  }
  onItemClick() {
    this.props.onSelect((isFavorite)=>{
      this.setFavoriteState(isFavorite);
    })
  }

  _favoriteIcon() {
    return <TouchableOpacity
      style={{padding: 6}}
      onPress={() =>{
        this.onPressFavorite();
      }}
      underlayColor={'transparent'}>
      <FontAwesome
        name={this.state.isFavorite ? 'star' : 'star-o'}
        size={26}
        style={{color: 'red'}}
      />
    </TouchableOpacity>
  }

  /**
   * https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md
   * @param nextProps
   * @param prevState
   * @returns {{isFavorite}}
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite;
    if (isFavorite !== prevState.isFavorite) {
      return {
        isFavorite: isFavorite
      }
    }
    return null;
  }
}



























