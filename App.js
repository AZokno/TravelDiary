import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AboutScreen from './src/screens/About';
import AuthScreen from './src/screens/Auth';
import NewEntryScreen from './src/screens/NewEntry';
import MyDiaryScreen from './src/screens/MyDiary';
import ShowEntryScreen from './src/screens/ShowEntry';
import SideDrawer from './src/screens/SideDrawer';
import configureStore from './src/store/configureStore';

const store = configureStore();

// Register Screens
Navigation.registerComponent("travel-diary.AboutScreen", () => AboutScreen, store, Provider);
Navigation.registerComponent("travel-diary.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("travel-diary.NewEntryScreen", () => NewEntryScreen, store, Provider);
Navigation.registerComponent("travel-diary.MyDiaryScreen", () => MyDiaryScreen, store, Provider);
Navigation.registerComponent("travel-diary.ShowEntryScreen", () => ShowEntryScreen, store, Provider);
Navigation.registerComponent("travel-diary.SideDrawer", () => SideDrawer, store, Provider);

// Start a App
Navigation.startSingleScreenApp({
    screen: {
        screen: "travel-diary.AuthScreen",
        title: "Login"
    }
});