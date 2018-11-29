import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AboutScreen from './src/screens/About';
import AuthScreen from './src/screens/Auth';
import NewEntryScreen from './src/screens/NewEntry';
import MyDiaryScreen from './src/screens/MyDiary';
import ShowEntryScreen from './src/screens/ShowEntry';
import configureStore from './src/store/configureStore';
import { startLogin } from './src/screens/InitNavigation';

const store = configureStore();

// Register Screens
Navigation.registerComponent("travel-diary.AboutScreen", () => AboutScreen, store, Provider);
Navigation.registerComponent("travel-diary.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("travel-diary.NewEntryScreen", () => NewEntryScreen, store, Provider);
Navigation.registerComponent("travel-diary.MyDiaryScreen", () => MyDiaryScreen, store, Provider);
Navigation.registerComponent("travel-diary.ShowEntryScreen", () => ShowEntryScreen, store, Provider);

// Start a App
startLogin();
