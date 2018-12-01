import { SET_ENTRIES, REMOVE_ENTRY, ENTRY_ADDED, START_ADD_ENTRY, CLEAR_LIST } from "./actions";
import { uiStartLoading, uiStopLoading, authGetToken } from "./index";
import { DB } from "../../utility/config"
import { FIREBASEStoreImage, FIREBASEAddEntry, showError, FIREBASEGetEntries, FIREBASEDeleteEntry } from "../../utility/utils";

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
        showError("Security Token not found");
      })
      .then(token => {
        authToken = token.token;
        uid = token.uid;
        return FIREBASEStoreImage(image.base64, authToken);
      })
      .catch(err => {
        console.log(err);
        showError("Could not send the photo. Please try again.");
        dispatch(uiStopLoading());
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw (new Error());
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
        return FIREBASEAddEntry(uid, authToken, entryData);
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw (new Error());
        }
      })
      .then(parsedRes => {
        console.log(parsedRes);
        dispatch(uiStopLoading());
        dispatch(entryAdded());
      })
      .catch(err => {
        console.log(err);
        showError("Could not add a new diary entry. Please try again.");
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
        return FIREBASEGetEntries(token.uid, token.token);
      })
      .catch(() => {
        showError("Security token could not be found.");
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          dispatch(uiStopLoading());
          throw (new Error());
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
        showError("Could not fetch your diary entires.");
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
        showError("Secutiry token not found.");
      })
      .then(token => {
        dispatch(removeEntry(key));
        return FIREBASEDeleteEntry(token.uid, token.token ,key);
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw (new Error());
        }
      })
      .then(parsedRes => {
        console.log("Done!");
      })
      .catch(err => {
        showError("Could not delete the entry. Please try again.");
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

