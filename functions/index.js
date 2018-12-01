const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const fs = require("fs");
const UUID = require("uuid-v4");

const TOKEN_AUTH_HEADER = "TOKEN ";
const TEMP_UPLOADED_FILE = "/tmp/temp-image.jpg";
const BUCKET = "traveldiaryokno-220216.appspot.com";

const gcconfig = {
  projectId: "traveldiaryokno-220216",
  keyFilename: "traveldiary.json"
};

const gcs = require("@google-cloud/storage")(gcconfig);

admin.initializeApp({
  credential: admin.credential.cert(require("./traveldiary.json"))
});

// FIREBASE DEPLOYED FUNCTIONS

exports.storeImage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const authorizationHeader = request.headers.authorization;

    if (!(authorizationHeader && authorizationHeader.startsWith(TOKEN_AUTH_HEADER))
    ) {
      console.log("Could not find the authorization token");
      response.status(403).json({ error: "Unauthorized" });
      return;
    }

    let authToken;
    authToken = authorizationHeader.split(TOKEN_AUTH_HEADER)[1];
    admin
      .auth()
      .verifyIdToken(authToken)
      .then(decodedToken => {
        tokenOKDoStoreImage(request, response);
      })
      .catch(error => {
        console.log("Provided token is invalid");
        response.status(403).json({ error: "Unauthorized" });
      });
  });
});

exports.deleteImage = functions.database
  .ref("/{uid}/{entryId}")
  .onDelete(event => {
    const bucket = gcs.bucket(BUCKET);
    return bucket.file(event.val().imagePath).delete();
  });

// HELPER FUNCTIONS

const tokenOKDoStoreImage = (request, response) => {
  const data = JSON.parse(request.body);

  if (!writeTempFile(data.image)) {
    return response.status(500).json({ error: "Could not store the image." });
  }

  const bucket = gcs.bucket(BUCKET);
  const uuid = UUID();

  bucket.upload(
    TEMP_UPLOADED_FILE,
    createStoredImageMetadataJSON(uuid),
    (err, file) => {
      if (!err) {
        response.status(201).json(
          createResponseSuccessJSON(bucket.name, file.name, uuid)
          );
      } else {
        console.log(err);
        response.status(500).json({ error: err });
      }
    }
  );
}

const writeTempFile = (image) => {
  fs.writeFileSync(
    TEMP_UPLOADED_FILE,
    image,
    "base64",
    err => {
      console.log(err);
      return false;
    }
  );
  return true;
}

const createStoredImageMetadataJSON = (uuid) => {
  return {
    uploadType: "media",
    destination: "/traveldiary_images/" + uuid + ".jpg",
    metadata: {
      metadata: {
        contentType: "image/jpeg",
        firebaseStorageDownloadTokens: uuid
      }
    }
  };
}

const createResponseSuccessJSON = (bucketName, fileName, uuid) => {
  return {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/" +
      bucketName +
      "/o/" +
      encodeURIComponent(fileName) +
      "?alt=media&token=" +
      uuid,
    imagePath: "/traveldiary_images/" + uuid + ".jpg"
  };
}

