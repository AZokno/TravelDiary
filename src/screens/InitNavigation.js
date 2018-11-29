import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {travelDiaryNavigatorLoginStyle, travelDiaryNavigatorStyle, SMURF_COLOR, KOLIBER_COLOR, SNOWMAN_COLOR} from '../utility/config';

export const startMainApplication = () => {
    Promise.all([
        Icon.getImageSource("md-bookmarks", 30),
        Icon.getImageSource("md-images", 30),
        Icon.getImageSource("md-information-circle", 30),
        Icon.getImageSource("md-menu", 30)
        ]).then(sources => {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: "travel-diary.MyDiaryScreen",
                    label: "My Diary",
                    title: "My Diary",
                    icon: sources[0],
                    navigatorStyle: travelDiaryNavigatorStyle,
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[3],
                                title: "Menu",
                                id: "menu"
                            }
                        ]
                    },
                },
                {
                    screen: "travel-diary.NewEntryScreen",
                    label: "New Entry",
                    title: "New Entry",
                    icon: sources[1],
                    navigatorStyle: travelDiaryNavigatorStyle,
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[3],
                                title: "Menu",
                                id: "menu"
                            }
                        ]
                    }
                },
                {
                    screen: "travel-diary.AboutScreen",
                    label: "About",
                    title: "About",
                    icon: sources[2],
                    navigatorStyle: travelDiaryNavigatorStyle,
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[3],
                                title: "Menu",
                                id: "menu"
                            }
                        ]
                    }
                }
            ],
            
            appStyle: {
                tabBarButtonColor: SNOWMAN_COLOR,
                tabBarSelectedButtonColor: KOLIBER_COLOR,
                tabBarBackgroundColor: SMURF_COLOR,
                selectedTabFontSize: 11,
                tabBarHideShadow: false,
            },
        });
    });
};

export const startLogin = () => {
    Navigation.startSingleScreenApp({
        screen: {
            screen: "travel-diary.AuthScreen",
            title: "Login",
            navigatorStyle: travelDiaryNavigatorLoginStyle
        }
    });
}
