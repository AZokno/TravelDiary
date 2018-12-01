import React from 'react';
import { View, StyleSheet} from 'react-native';
import { ListItem , Thumbnail, Body, Left, Right, Text, Badge } from 'native-base';
import StarRating from 'react-native-star-rating';
import { KOLIBER_COLOR } from '../utility/config';

const DiaryEntry = (props) => (
    <ListItem onPress={props.onItemPressed} thumbnail>
        <Left>
            <Thumbnail square source={props.image} />
        </Left>
        <Body>
            <Text>{props.title}</Text>
            <Text note numberOfLines={1}>{props.description ? props.description : "-"}</Text>
        </Body>
        <Right badge>
            <View style={styles.starStyle}>
                <View style={{paddingLeft: 10}}>
                    <StarRating
                        disabled={true}
                        maxStars={1}
                        emptyStar={'ios-star-outline'}
                        fullStar={'ios-star'}
                        halfStar={'ios-star-half'}
                        iconSet={'Ionicons'}
                        rating={1}
                        fullStarColor={KOLIBER_COLOR}
                    />
                </View>
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-start', position: 'absolute' }}>
                    <Badge info>
                        <Text>{props.rating}</Text>
                    </Badge>
                </View>
            </View>
        </Right>
    </ListItem>
);

const styles = StyleSheet.create({
    starStyle: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center"
    },
});

export default DiaryEntry;