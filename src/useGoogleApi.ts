import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

// Client ID and API key from the Developer Console
const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly";

export const useGoogleDriveApi = () => {
  const [signedInUser, setSignedInUser] = useState();

  const doLoad = () => {
    gapi.load("client:auth2", initClient);
  };

  const initClient = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(
        () => {
          stepAfterInit();
          // Handle the initial sign-in state.
          // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        (error: any) => {
          console.error("error", error);
        }
      )
      .catch((err: any) => {
        console.error(err);
      });
  };

  const stepAfterInit = () => {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  };

  const updateSigninStatus = (isSignedIn: boolean) => {
    if (isSignedIn) {
      // Set the signed in user
      setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
      // list files if user is authenticated
      listFilesInFolder();
    } else {
      // user to sign in
      gapi.auth2.getAuthInstance().signIn();
    }
  };

  const listFiles = () => {
    gapi.client.drive.files
      .list({
        pageSize: 1000,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime,webContentLink,webViewLink)",
        q: "",
      })
      .then((response: any) => {
        const res = JSON.parse(response.body);
        console.log("list files res", res);
      });
  };

  const tonayjiFolderId = "1-7BCqVMd0vt5elchh6RX7Xe3cOhn5CYh";
  const minshawiFolderId = "17B6DhJ82hNf47U1uGqh8AHI1F52BLAX0";

  const listFilesInFolder = () => {
    const folderId = minshawiFolderId;
    gapi.client.drive.files
      .list({
        pageSize: 1000,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime,webContentLink,webViewLink)",
        q: `'${folderId}' in parents`,
      })
      .then((response: any) => {
        const res = JSON.parse(response.body);
        console.log("list files res", res);
      });
  };

  const listAllFolders = () => {
    gapi.client.drive.files
      .list({
        pageSize: 1000,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime,webContentLink,webViewLink,parents)",
        q: `mimeType=\'application/vnd.google-apps.folder\'`,
        spaces: "drive",
      })
      .then((response: any) => {
        const res = JSON.parse(response.body);
        console.log("list folders res", res);
      });
  };

  return { doLoad };
};
