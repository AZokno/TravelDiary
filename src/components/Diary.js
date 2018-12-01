import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Separator, Text} from 'native-base';
import * as _ from 'lodash';
import moment from 'moment';

import DiaryEntry from './DiaryEntry';

const Diary = props => {

    let sorted = _.sortBy(props.entries, 'date').reverse();
    let aggr = _.reduce(
        sorted,
        (acc, entry) => {
            let date = entry.date;
            let list = acc[date];
            if (!list) {
                list = [];
            }
            list.push(entry);
            return { ...acc, [date]: list }
        },
        {}
    )

    let data = [];
    _.forOwn(aggr, function (entryInDate, date) {
        data.push({
            separator: true,
            date: date,
            key: date.toString()
        });
        let sortedByRating = _.sortBy(entryInDate, 'rating').reverse();
        data = data.concat(sortedByRating);
    });

    return (
        <FlatList style={styles.listContainer} keyExtractor={(item, index) => item.key} data={data} renderItem={(info) => {
            if (info.item.separator) {
                return (<Separator bordered>
                    <Text>{moment(info.item.date).format('L')}</Text>
                </Separator>)
            }

            return (<DiaryEntry
                title={info.item.title}
                image={info.item.image}
                rating={info.item.rating}
                description={info.item.description}
                onItemPressed={() => props.onItemSelected(info.item.key)} />)
        }}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        width: "100%"
    }
});

export default Diary;