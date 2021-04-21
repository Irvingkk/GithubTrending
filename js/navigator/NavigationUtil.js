export default class NavigationUtil {
  /**
   * jump to outer navigation routes from child navigation
   * @param params
   * @param page
   * @param navigation
   */
  static goTo(page, params){
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      console.error('NavigationUtil.navigation can not be null')
    } else {
      console.log(`go to page ${page} with params ${params}`);
      navigation.navigate(page, params);
    }
  }

  static goBack(navigation) {
    navigation.goBack()
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
