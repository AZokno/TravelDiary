import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { showInfo, showError } from '../utility/utils';

class ChoosePhoto extends Component {
    state = {
        pickedImage: null
    }

    reset = () => {
        this.setState({
            pickedImage: null
        });
    }
    
    pickImageHandler = () => {
        ImagePicker.showImagePicker({ title: "Choose a photo", maxWidth: 1280, maxHeight: 720 }, res => {
            if (res.didCancel) {
                showInfo("Cancelled...");
            } else if (res.error) {
                console.log(res.error);
                showError("Error occurred 😥")
            } else {
                this.setState({
                    pickedImage: { uri: res.uri }
                });
                this.props.onImagePicked({ uri: res.uri, base64: res.data });
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.placeholder}>
                    <Image source={this.state.pickedImage} style={styles.imagePreview} />
                </View>
                <View style={styles.button}>
                    <Button iconLeft onPress={this.pickImageHandler}>
                        <Icon name='md-cloud-upload' />
                        <Text>Upload the picture</Text>
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
    imagePreview: {
        width: "100%",
        height: "100%"
    },
    placeholder: {
        backgroundColor: "grey",
        borderWidth: 1,
        borderColor: "#eee",
        width: "100%",
        height: 250
    }
});

export default ChoosePhoto;