/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './js/App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import AppNavigator from "./js/navigator/AppNavigator";

AppRegistry.registerComponent(appName, () => App);
