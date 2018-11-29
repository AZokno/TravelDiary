import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import MapView from 'react-native-maps';

class ChooseLocation extends Component {

    componentWillMount() {
        this.reset();
    }

    reset = () => {
        this.setState({
            focusedLocation: {
                latitude: 37.7900352,
                longitude: -122.4013726,
                latitudeDelta: 0.0122,
                longitudeDelta:
                    Dimensions.get('window').width / Dimensions.get('window').height *
                    0.0122
            },
            locationChosen: false
        });
    }

    pickLocationHandler = event => {
        const coords = event.nativeEvent.coordinate;
        this.setState(prevState => {
            return {
                focusedLocation: {
                    ...prevState.focusedLocation,
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                locationChosen: true
            };
        });
        this.props.onLocationPick({
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    };

    getLocationHandler = () => {
        navigator.geolocation.getCurrentPosition(pos => {
            const coordsEvent = {
                nativeEvent: {
                    coordinate: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                }
            };
            this.pickLocationHandler(coordsEvent);
        },

            err => {
                console.log(err);
                alert("Fetching the position failed");
            })
    }

    render() {
        let marker = null;
        if (this.state.locationChosen) {
            marker = <MapView.Marker coordinate={this.state.focusedLocation} />
        }

        return (
            <View style={styles.container}>
                <MapView
                    initialRegion={this.state.focusedLocation}
                    region={this.state.focusedLocation}
                    style={styles.map}
                    onPress={this.pickLocationHandler}
                    ref={ref => this.map = ref}>
                    {marker}
                </MapView>
                <View style={styles.button}>
                    <Button iconLeft onPress={this.getLocationHandler}>
                        <Icon name='md-locate' />
                        <Text>Get location</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center"
    },
    button: {
        margin: 5
    },
    map: {
        width: "100%",
        height: 250
    }
});

export default ChooseLocation;