export default class NavigationUtil {
  /**
   * jump to outer navigation routes from child navigation
   * @param params
   * @param page
   * @param navigation
   */
  static goTo(params, page){
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      console.log('NavigationUtil.navigation can not be null')
    } else {
      navigation.navigate(page, params);
    }
  }

  /**
   * Go to HomePage
   * @param params
   */
  static resetToHomePage(props){
    const {navigation} = props;
    navigation.navigate('Main');
  }
}
