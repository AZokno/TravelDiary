import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Root, Icon, Button, Body, Container, CardItem, Card, Content, H3, Text } from 'native-base';
import { authLogout } from '../store/actions/index';
import { ASYNC_STORE_EMAIL } from "../utility/config";

class AboutScreen extends Component {

    state = {
        email: "loading..."
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        AsyncStorage.getItem(ASYNC_STORE_EMAIL).then(email => {
            this.setState({
                email: email
            });
        });
    }

    render() {
        return (
            <Root>
                <Container>
                    <Content style={{ alignContent: "center" }}>
                        <Card>
                            <CardItem header>
                                <Text>User</Text>
                            </CardItem>
                            <CardItem>
                                <Body style={styles.cardBodyCenter}>
                                    <H3>{this.state.email}</H3>
                                </Body>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem header>
                                <Text>Application</Text>
                            </CardItem>
                            <CardItem>
                                <Body style={styles.cardBodyCenter}>
                                    <H3>TravelDiary v1.0</H3>
                                </Body>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem>
                                <Body style={styles.cardBodyCenter}>
                                    <Button danger iconLeft onPress={this.props.logoutHandler}>
                                        <Icon name='md-power' />
                                        <Text>Logout</Text>
                                    </Button>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </Container>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    cardBodyCenter: { flexDirection: "row", justifyContent: "center" },
});

const mapToProps = dispatch => {
    return {
        logoutHandler: () => dispatch(authLogout())
    };
};

export default connect(null, mapToProps)(AboutScreen);
