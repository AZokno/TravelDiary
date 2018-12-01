import React, { Component } from 'react';
import { Toast } from 'native-base';
import { STORE_IMAGE_FUNCTION, VERIFY_USER_API, REGISTER_USER_API, REFRESH_TOKEN_API, API_KEY, DB } from './config';

// ## Endpoint calls

// Authentication
export const FIREBASELogin = (authData) => doAuhtentication(VERIFY_USER_API + "?key=" + API_KEY, authData);
export const FIREBASESignUp = (authData) => doAuhtentication(REGISTER_USER_API + "?key=" + API_KEY, authData);

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

export const FIREBASERefreshToken = (refreshToken) => fetch(
    REFRESH_TOKEN_API + "?key=" + API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=refresh_token&refresh_token=" + refreshToken
    }
  )

// Database

export const FIREBASEAddEntry = (uid, authToken, entryData) => fetch(
    DB + uid + ".json?auth=" +
    authToken,
    {
      method: "POST",
      body: JSON.stringify(entryData)
    }
  )

export const FIREBASEGetEntries = (uid, authToken) => fetch(
    DB + uid + ".json?auth=" +
    authToken
  )
  
export const FIREBASEDeleteEntry = (uid, authToken, id) =>  fetch(
    DB + uid + "/" +
    id +
    ".json?auth=" +
    authToken,
    {
      method: "DELETE"
    }
  )


// Store image

export const FIREBASEStoreImage = (base64, token) => fetch(
    STORE_IMAGE_FUNCTION,
    {
      method: "POST",
      body: JSON.stringify({
        image: base64
      }),
      headers: {
        Authorization: "Bearer " + token
      }
    }
  )

// ## Validation

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
        buttonText: 'OK',
        duration: 2000
    });
}

export const showDefaultError = () => {
    showError("An error occured. Sorry 😵. Please try again.");
}

