import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Spinner, Content } from 'native-base';
import { connect } from 'react-redux';

import Diary from '../components/Diary';
import {getEntries } from '../store/actions/index';
import {travelDiaryNavigatorStyle, KOLIBER_COLOR} from '../utility/config';

class MyDiaryScreen extends Component {
    
    state = {
        diaryAnim: new Animated.Value(0)
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

        
    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                this.props.onLoadDiary();
            }
        }
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willDisappear") {
                this.goAwayHandler();
            }
        }
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    }    
    
    diaryLoadedHandler = () => {
        Animated.timing(this.state.diaryAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true
        }).start();
    }

    goAwayHandler = () => {
        Animated.timing(this.state.diaryAnim, {
            toValue: 0,
            duration: 10,
            useNativeDriver: true
        }).start();
    }
    
    itemSelectedHandler = key => {
        const selectedEntry = this.props.entries.find(e => {
                return e.key === key;
            });
        this.props.navigator.push({
            screen: "travel-diary.ShowEntryScreen",
            title: selectedEntry.title,
            navigatorStyle: travelDiaryNavigatorStyle,
            passProps: {
                selectedEntry: selectedEntry
            }
        });
    }

    diaryLoaded() {
        return !this.props.isLoading;
    }
    
    render () {
        let content = (<View style={styles.spinnerContainer}><Spinner color={KOLIBER_COLOR} /></View>);
        if (this.diaryLoaded()) {
            content = (
                <Content>
                    <Animated.View style={{
                        opacity: this.state.diaryAnim
                    }}>
                        <Diary entries={this.props.entries} onItemSelected={this.itemSelectedHandler}/>
                    </Animated.View>
                </Content>
            );
        }
        this.diaryLoadedHandler();
        return content;
    }
}

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});

const mapStateToProps = state => {
    return {
        entries: state.diary.entries,
        isLoading: state.ui.isLoading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadDiary: () => dispatch(getEntries())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDiaryScreen);