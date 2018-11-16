import React from 'react';
import { Item, Input, Icon } from 'native-base';
import { KOLIBER_COLOR, HIPPOPOTAM_COLOR } from '../utility/config';

const travelDiaryInput = props => {

    let invalid = !props.valid && props.touched;
    let valid = props.valid;
    let iconName = null;
    let color = null;

    if (invalid) {
        iconName = 'close-circle';
        color = KOLIBER_COLOR;
    } else if (valid) {
        iconName = 'checkmark-circle';
        color = 'green';
    }

    let icon = null;
    if (iconName) {
        icon = <Icon style={[props.style, {color: color}]} name={iconName} />;
    }

    return(
    <Item style={props.style} success={valid} error={invalid} >
        <Input {...props} placeholderTextColor={HIPPOPOTAM_COLOR}/>
        {icon}
    </Item>);
};

export default travelDiaryInput;