import React, { Component } from 'react';
import { Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Root, Text, Container, Content, Textarea, Card, CardItem, Body, Form, Icon, Item, Label, Button } from 'native-base';
import { connect } from 'react-redux';
import { deleteEntry } from '../store/actions/index';
import MapView from 'react-native-maps';
import moment from 'moment';
import StarRating from 'react-native-star-rating';
import { KOLIBER_COLOR } from '../utility/config';

class ShowEntryScreen extends Component {

    constructor(props) {
        super(props);
    }

    entryDeletedHandler = () => {
        this.props.onDeleteEntry(this.props.selectedEntry.key);
        this.props.navigator.pop();
    }

    render() {
        return (
            <Root>
                <Container>
                    <ScrollView>
                        <Content>
                            <Card>
                                <CardItem header>
                                    <Text>Photo</Text>
                                </CardItem>
                                <CardItem>
                                    <Image source={this.props.selectedEntry.image} style={styles.image} />
                                </CardItem>
                            </Card>
                            <Card style={{ height: 300 }}>
                                <CardItem header >
                                    <Text>Location</Text>
                                </CardItem>
                                <CardItem style={{ flex: 1 }}>
                                    <MapView initialRegion={{
                                        ...this.props.selectedEntry.location,
                                        latitudeDelta: 0.01,
                                        longitudeDelta:
                                            Dimensions.get('window').width / Dimensions.get('window').height *
                                            0.01
                                    }}
                                        style={styles.map}>
                                        <MapView.Marker coordinate={this.props.selectedEntry.location} />
                                    </MapView>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem header>
                                    <Text>Details</Text>
                                </CardItem>
                                <CardItem>
                                    <Form style={{ flex: 1 }} >
                                        <Item stackedLabel>
                                            <Label>Title</Label>
                                            <Text>{this.props.selectedEntry.title}</Text>
                                        </Item>
                                        <Item stackedLabel>
                                            <Label>When</Label>
                                            <Text>{moment(this.props.selectedEntry.date).format('L')}</Text>
                                        </Item>
                                        <Item stackedLabel >
                                            <Label>Rating</Label>
                                            <StarRating
                                                disabled={true}
                                                maxStars={5}
                                                emptyStar={'ios-star-outline'}
                                                fullStar={'ios-star'}
                                                halfStar={'ios-star-half'}
                                                iconSet={'Ionicons'}
                                                rating={this.props.selectedEntry.rating}
                                                fullStarColor={KOLIBER_COLOR}
                                            />
                                        </Item>
                                        <Item stackedLabel last>
                                            <Label>Description</Label>
                                            <Textarea
                                                disabled
                                                style={{ width: "100%" }} rowSpan={5}
                                                bordered
                                                value={this.props.selectedEntry.description} />
                                        </Item>
                                    </Form>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem>
                                    <Body style={{ flexDirection: "row", justifyContent: "center" }}>
                                        <Button iconLeft danger onPress={this.entryDeletedHandler}>
                                            <Icon name='md-trash' />
                                            <Text>Delete</Text>
                                        </Button>
                                    </Body>
                                </CardItem>
                            </Card>
                        </Content>
                    </ScrollView>
                </Container>
            </Root>
        );
    };
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 250
    },
    map: {
        ...StyleSheet.absoluteFillObject
    }

});

const mapDispatchToProps = dispatch => {
    return {
        onDeleteEntry: (key) => dispatch(deleteEntry(key))
    };
};

export default connect(null, mapDispatchToProps)(ShowEntryScreen);
