import { AsyncStorage } from "react-native";
import { Navigation } from 'react-native-navigation';

import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "./actionTypes";
import { uiStartLoading, uiStopLoading } from "./index";
import startMainTabs from "../../screens/startMainTabs";
import { clearList } from "./diary";
import { API_KEY, ASYNC_STORE_UID, ASYNC_STORE_EMAIL, ASYNC_STORE_TOKEN, ASYNC_STORE_EXPIRY_DATE, ASYNC_STORE_REFRESH_TOKEN, REGISTER_USER_API, REFRESH_TOKEN_API, VERIFY_USER_API } from "../../utility/config";

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    dispatch(uiStartLoading());
    let url = VERIFY_USER_API + "?key=" + API_KEY;
    if (authMode === "signup") {
      url =
        REGISTER_USER_API + "?key=" + API_KEY;
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.ok) {
          return res.json();
      } else {
          throw(new Error());
      }
    }).catch(err => {
        console.log(err);
        alert("Authentication failed, please try again!");
        dispatch(uiStopLoading());
      }).then(parsedRes => {
        dispatch(uiStopLoading());
        console.log(parsedRes);
        if (!parsedRes.idToken) {
          alert("Authentication failed, please try again!");
        } else {
          dispatch(
            authStoreToken(
              parsedRes.localId,
              parsedRes.email,
              parsedRes.idToken,
              parsedRes.expiresIn,
              parsedRes.refreshToken,
            )
          );
          startMainTabs();
        }
      });
  };
};

export const authStoreToken = (uid, email, token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(uid, email, token, expiryDate));
    AsyncStorage.setItem(ASYNC_STORE_UID, uid);
    AsyncStorage.setItem(ASYNC_STORE_EMAIL, email);
    AsyncStorage.setItem(ASYNC_STORE_TOKEN, token);
    AsyncStorage.setItem(ASYNC_STORE_EXPIRY_DATE, expiryDate.toString());
    AsyncStorage.setItem(ASYNC_STORE_REFRESH_TOKEN, refreshToken);
  };
};

export const authSetToken = (uid, email, token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    uid: uid,
    email: email,
    token: token,
    expiryDate: expiryDate
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const uid = getState().auth.uid;
      const token = getState().auth.token;
      const expiryDate = getState().auth.expiryDate;
      const email = getState().auth.email;
      if (!token || new Date(expiryDate) <= new Date()) {
        let uidFromStorage;
        let emailFromStorage;
        let tokenFromStorage;
        Promise.all([
          AsyncStorage.getItem(ASYNC_STORE_UID),
          AsyncStorage.getItem(ASYNC_STORE_EMAIL),
          AsyncStorage.getItem(ASYNC_STORE_TOKEN)
          ])
          .catch(err => reject())
          .then(items => {

            console.log("items");
            console.log(items);

            uidFromStorage = items[0];
            emailFromStorage = items[1];
            tokenFromStorage = items[2];

            if (!tokenFromStorage) {
              reject();
              return;
            }
            return AsyncStorage.getItem(ASYNC_STORE_EXPIRY_DATE);
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date();
            if (parsedExpiryDate > now) {
              console.log("authToken async");
              console.log({uid: uidFromStorage, email: emailFromStorage, token: tokenFromStorage});
              dispatch(authSetToken(uidFromStorage, emailFromStorage, tokenFromStorage, parsedExpiryDate));
              resolve({uid: uidFromStorage, email: emailFromStorage, token: tokenFromStorage});
            } else {
              reject();
            }
          });
      } else {
        console.log("authToken else");
        console.log({uid: uid, email: email, token: token});
        resolve({uid: uid, email: email, token: token});
      }
    });
    return promise
      .catch(err => {
        let uid = null;
        let email = null;
        return Promise.all([
          AsyncStorage.getItem(ASYNC_STORE_REFRESH_TOKEN),
          AsyncStorage.getItem(ASYNC_STORE_UID),
          AsyncStorage.getItem(ASYNC_STORE_EMAIL)
          ]).then(refreshItems => {
            console.log("refreshItems");
            console.log(refreshItems);

            let refreshToken = refreshItems[0];
            uid = refreshItems[1];
            email = refreshItems[2];

            return fetch(
              REFRESH_TOKEN_API + "?key=" + API_KEY,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "grant_type=refresh_token&refresh_token=" + refreshToken
              }
            );
          })
          .then(res => res.json())
          .then(parsedRes => {
            if (parsedRes.id_token) {
              console.log("Refresh token worked!");
              dispatch(
                authStoreToken(
                  uid,
                  email,
                  parsedRes.id_token,
                  parsedRes.expires_in,
                  parsedRes.refresh_token
                )
              );
              return { uid: uid, email: email, token: parsedRes.id_token};
            } else {
              dispatch(authClearStorage());
            }
          });
      })
      .then(token => {
        if (!token) {
          throw new Error();
        } else {
          return token;
        }
      });
  };
};

export const authAutoSignIn = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(token => {
        startMainTabs();
      })
      .catch(err => console.log("Failed to fetch token!"));
  };
};

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem(ASYNC_STORE_UID);
    AsyncStorage.removeItem(ASYNC_STORE_EMAIL);
    AsyncStorage.removeItem(ASYNC_STORE_TOKEN);
    AsyncStorage.removeItem(ASYNC_STORE_EXPIRY_DATE);
    return AsyncStorage.removeItem(ASYNC_STORE_REFRESH_TOKEN);
  };
};

export const authLogout = () => {
    return dispatch => {
        dispatch(authClearStorage())
            .then(() => {
                Navigation.startSingleScreenApp({
                    screen: {
                        screen: "travel-diary.AuthScreen",
                        title: "Login"
                    }
                });
        });
        dispatch(authRemoveToken());
        dispatch(clearList());
    };
};

export const authRemoveToken = () => {
    return {
        type: AUTH_REMOVE_TOKEN
    };
};