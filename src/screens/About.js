import React, { Component } from 'react';
import { Container, Content, H1, H2, H3, Text } from 'native-base';

class AboutScreen extends Component {

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
        
    onNavigatorEvent = event => {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    }    

    render() {
        return (
            <Container>
                <Content>
                    <H1>Travel Diary</H1>
                    <H2>v1.0</H2>
                    <H3>Aleksandra Ziemińska</H3>
                    <Text>PW - OKNO</Text>
                </Content>
            </Container>
        );
    }
}

export default AboutScreen;
