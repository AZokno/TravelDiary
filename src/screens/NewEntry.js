import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Root, Button, Text, Container, Icon, Spinner, Content, Textarea, Card, CardItem, Body, DatePicker, Form, Item, Label } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import StarRating from 'react-native-star-rating';
import { addEntry } from '../store/actions/index';
import TravelDiaryInput from '../components/TravelDiaryInput';
import ChoosePhoto from '../components/ChoosePhoto';
import ChooseLocation from '../components/ChooseLocation';
import { validate } from '../utility/utils';
import { startAddEntry } from '../store/actions/index';
import { KOLIBER_COLOR, HIPPOPOTAM_COLOR } from '../utility/config';

class NewEntryScreen extends Component {

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    componentWillMount() {
        this.reset();
    }

    reset = () => {
        this.setState({
            controls: {
                title: {
                    value: "",
                    valid: false,
                    touched: false,
                    validationRules: {
                        notEmpty: true
                    }
                },
                location: {
                    value: null,
                    valid: false
                },
                image: {
                    value: null,
                    valid: false
                },
                date: {
                    value: null,
                    valid: false
                },
                rating: {
                    value: null,
                    valid: false
                },
                description: {
                    value: null,
                    valid: true
                }
            }
        });
    }

    componentDidUpdate() {
        if (this.props.entryAdded) {
            this.props.navigator.switchToTab({ tabIndex: 0 });
        }
    }

    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                this.props.onStartAddEntry();
            }
        }
    }

    titleChangedHandler = val => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    title: {
                        ...prevState.controls.title,
                        value: val,
                        valid: validate(val, prevState.controls.title.validationRules),
                        touched: true
                    }
                }
            };
        });
    };

    locationPickedHandler = location => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    location: {
                        value: location,
                        valid: true
                    }
                }
            }
        });
    }

    entryAddedHandler = () => {
        this.props.onAddEntry(
            this.state.controls.title.value,
            this.state.controls.location.value,
            this.state.controls.image.value,
            this.state.controls.date.value,
            this.state.controls.rating.value,
            this.state.controls.description.value
        );
        this.reset();
        this.imagePicker.reset();
        this.locationPicker.reset();
    }

    imagePickedHandler = image => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    image: {
                        value: image,
                        valid: true
                    }
                }
            }
        });
    }

    datePickedHandler = date => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    date: {
                        value: date,
                        valid: true
                    }
                }
            }
        });
    }

    ratingPickedHandler = rating => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    rating: {
                        value: rating,
                        valid: true
                    }
                }
            }
        });
    }


    descriptionHandler = description => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    description: {
                        value: description,
                        valid: true
                    }
                }
            }
        });
    }

    render() {
        let submitButton = (
            <Button success iconLeft
                onPress={this.entryAddedHandler}
                disabled={!this.state.controls.title.valid ||
                    !this.state.controls.location.valid ||
                    !this.state.controls.image.valid ||
                    !this.state.controls.date.valid ||
                    !this.state.controls.rating.valid}
            >
                <Icon name='md-add-circle' />
                <Text>Add to diary!</Text>
            </Button>
        );

        if (this.props.isLoading) {
            submitButton = <Spinner color={KOLIBER_COLOR} />;
        }
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
                                    <ChoosePhoto onImagePicked={this.imagePickedHandler} ref={ref => (this.imagePicker = ref)} />
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem header>
                                    <Text>Location</Text>
                                </CardItem>
                                <CardItem>
                                    <ChooseLocation onLocationPick={this.locationPickedHandler} ref={ref => (this.locationPicker = ref)} />
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
                                            <TravelDiaryInput
                                                placeholder="Write title here"
                                                value={this.state.controls.title.value}
                                                valid={this.state.controls.title.valid}
                                                touched={this.state.controls.title.touched}
                                                onChangeText={this.titleChangedHandler} />
                                        </Item>

                                        <Item stackedLabel>
                                            <Label>When</Label>
                                            <DatePicker
                                                locale={"pl"}
                                                timeZoneOffsetInMinutes={undefined}
                                                modalTransparent={false}
                                                animationType={"slide"}
                                                androidMode={"default"}
                                                placeHolderText="Select date"
                                                textStyle={{ color: "black" }}
                                                placeHolderTextStyle={{ color: HIPPOPOTAM_COLOR }}
                                                onDateChange={this.datePickedHandler}
                                                formatChosenDate={date => { return moment(date).format('L'); }}
                                            />
                                        </Item>

                                        <Item stackedLabel >
                                            <Label>Rating</Label>
                                            <StarRating
                                                disabled={false}
                                                maxStars={5}
                                                emptyStar={'ios-star-outline'}
                                                fullStar={'ios-star'}
                                                halfStar={'ios-star-half'}
                                                iconSet={'Ionicons'}
                                                rating={this.state.controls.rating.value}
                                                selectedStar={(rating) => this.ratingPickedHandler(rating)}
                                                fullStarColor={KOLIBER_COLOR}
                                            />
                                        </Item>

                                        <Item stackedLabel last>
                                            <Label>Description</Label>
                                            <Textarea
                                                style={{ width: "100%" }} rowSpan={5}
                                                bordered
                                                value={this.state.controls.description.value}
                                                placeholderTextColor={HIPPOPOTAM_COLOR}
                                                onChangeText={this.descriptionHandler}
                                                placeholder="Write description here" />
                                        </Item>
                                    </Form>
                                </CardItem>
                            </Card>

                            <Card>
                                <CardItem>
                                    <Body style={{ flexDirection: "row", justifyContent: "center" }}>
                                        {submitButton}
                                    </Body>
                                </CardItem>
                            </Card>
                        </Content>
                    </ScrollView>
                </Container>
            </Root>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        entryAdded: state.diary.entryAdded
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onAddEntry: (entryTitle, location, image, date, rating, description) => dispatch(addEntry(entryTitle, location, image, date, rating, description)),
        onStartAddEntry: () => dispatch(startAddEntry())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewEntryScreen);