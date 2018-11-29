import { SET_ENTRIES, REMOVE_ENTRY, ENTRY_ADDED, START_ADD_ENTRY, CLEAR_LIST } from "./actions";
import { uiStartLoading, uiStopLoading, authGetToken } from "./index";
import { DB, STORE_IMAGE_FUNCTION } from "../../utility/config"

export const startAddEntry = () => {
    return {
        type: START_ADD_ENTRY
    };
};

export const addEntry = (entryTitle, location, image, date, rating, description) => {
  return dispatch => {
    let authToken;
    let uid;
    dispatch(uiStartLoading());
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
      })
      .then(token => {
        authToken = token.token;
        uid = token.uid;
        return fetch(
          STORE_IMAGE_FUNCTION,
          {
            method: "POST",
            body: JSON.stringify({
              image: image.base64
            }),
            headers: {
              Authorization: "Bearer " + authToken
            }
          }
        );
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong, please try again!");
        dispatch(uiStopLoading());
      })
      .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw(new Error());
        }
      })
      .then(parsedRes => {
        const entryData = {
          title: entryTitle,
          location: location,
          image: parsedRes.imageUrl,
          imagePath: parsedRes.imagePath,
          date: date,
          rating: rating,
          description: description
        };
        console.log(entryData);
        return fetch(
           DB + uid + ".json?auth=" +
            authToken,
          {
            method: "POST",
            body: JSON.stringify(entryData)
          }
        );
      })
      .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw(new Error());
        }
      })
      .then(parsedRes => {
        console.log(parsedRes);
        dispatch(uiStopLoading());
        dispatch(entryAdded());
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong, please try again!");
        dispatch(uiStopLoading());
      });
  };
};

export const entryAdded = () => {
    return {
        type: ENTRY_ADDED
    };
};

export const clearList = () => {
  return {
        type: CLEAR_LIST
    };
}

export const getEntries = () => {
  return dispatch => {
    dispatch(uiStartLoading());
    dispatch(authGetToken())
      .then(token => {
        return fetch(
          DB + token.uid + ".json?auth=" +
            token.token
        );
      })
      .catch(() => {
        alert("No valid token found!");
      })
      .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            dispatch(uiStopLoading());
            throw(new Error());
        }
      })
      .then(parsedRes => {
        const entries = [];
        for (let key in parsedRes) {
          entries.push({
            ...parsedRes[key],
            image: {
              uri: parsedRes[key].image
            },
            key: key
          });
        }
        dispatch(uiStopLoading());
        dispatch(setEntries(entries));
      })
      .catch(err => {
        dispatch(uiStopLoading());
        alert("Something went wrong, sorry :/");
        console.log(err);
      });
  };
};

export const setEntries = entries => {
  return {
    type: SET_ENTRIES,
    entries: entries
  };
};

export const deleteEntry = key => {
  return dispatch => {
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
      })
      .then(token => {
        dispatch(removeEntry(key));
        return fetch(
          DB + token.uid + "/" +
            key +
            ".json?auth=" +
            token.token,
          {
            method: "DELETE"
          }
        );
      })
      .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw(new Error());
        }
      })
      .then(parsedRes => {
        console.log("Done!");
      })
      .catch(err => {
        alert("Something went wrong, sorry :/");
        console.log(err);
      });
  };
};

export const removeEntry = key => {
  return {
    type: REMOVE_ENTRY,
    key: key
  };
};

