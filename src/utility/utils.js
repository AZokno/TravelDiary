import React, { Component } from 'react';
import { Toast } from 'native-base';

// Endpoint calls

export const login = (authData) => doAuhtentication(VERIFY_USER_API + "?key=" + API_KEY, authData);
export const signUp = (authData) => doAuhtentication(REGISTER_USER_API + "?key=" + API_KEY, authData);

const doAuhtentication = (url, authData) => fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email: authData.email,
      password: authData.password,
      returnSecureToken: true
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })

// Validation

export const validate = (val, rules, connectedValue) => {
    let isValid = true;
    for (let rule in rules) {
        switch (rule) {
            case 'isEmail':
                isValid = isValid && emailValidator(val);
                break;
            case 'minLength':
                isValid = isValid && minLengthValidator(val, rules[rule]);
                break;
            case 'equalTo':
                isValid = isValid && equalToValidator(val, connectedValue[rule]);
                break;
            case 'notEmpty':
                isValid = isValid && notEmptyValidator(val);
                break;
            default:
                isValid: true;
        }
    }
    return isValid;
}

const emailValidator = val => {
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(val);
}

const minLengthValidator = (val, minLength) => {
    return val.length >= minLength;
}

const equalToValidator = (val, checkValue) => {
    return val === checkValue;
}

const notEmptyValidator = val => {
    return val.trim() !== "";
}

// Show errors functions

export const showError = message => {
    Toast.show({
        text: message,
        type: "danger",
        buttonText: 'OK'
    });
}

export const showDefaultError = () => {
    showError("An error occured. Sorry 😵. Please try again.");
}

