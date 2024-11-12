interface ExtendedTokenClient extends google.accounts.oauth2.TokenClient {
    callback?: (resp: any) => void;
    error_callback?: (resp: any) => void;
}
  
class CalenderApi {
    isGapiLoaded = false;
    isGisLoaded = false;
    tokenClient: ExtendedTokenClient | null = null;
    onLoadCallback: any = null;
    calendar: string = "primary";

    constructor() {
        this.clientInit();
    }

    private initializeGapi = async () => {
        try {
            await gapi.client.init( {
                apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
                discoveryDocs: [import.meta.env.VITE_DISCOVERY_DOC]
            });
            this.isGapiLoaded = true;
        }
        catch(err) {
            console.log(err);
        }
    }

    private clientInit = () => {
        const googleIdentityScriptSrc = "https://accounts.google.com/gsi/client";
        const googleAPIScriptSrc = "https://apis.google.com/js/api.js";

        const scriptGoogleId = document.createElement("script");
        const scriptGapi = document.createElement("script");
        scriptGoogleId.src = googleIdentityScriptSrc;
        scriptGoogleId.async = true;
        scriptGoogleId.defer = true;
        scriptGapi.src = googleAPIScriptSrc;
        scriptGapi.async = true;
        scriptGapi.defer = true;
        document.body.appendChild(scriptGapi);
        document.body.appendChild(scriptGoogleId);

        // initialized gapi after the loading api.js
        scriptGapi.onload = () => {
            gapi.load('client', this.initializeGapi);
        }

        // callback to run after gsi is loaded
        scriptGoogleId.onload = () => {
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: import.meta.env.VITE_CLIENT_ID,
                scope: import.meta.env.VITE_SCOPES,
                prompt: "",
                callback: (): void => {},
            });
            this.isGisLoaded = true;
        }
    }

    public handleAuthOnclick = () => {
        if(gapi && this.tokenClient) {
            this.tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                  throw (resp);
                }
            };
            if (gapi.client.getToken() === null) {
                // Prompt the user to select a Google Account and ask for consent to share their data
                // when establishing a new session.
                this.tokenClient.requestAccessToken({prompt: 'consent'});
            } else {
                // Skip display of account chooser and consent dialog for an existing session.
                this.tokenClient.requestAccessToken({prompt: ''});
            }
        } else {
            console.log("gapi is not loaded")
        }
    }

    public handleSignOutClick = () => {
        if(gapi) {
            const token = gapi.client.getToken();
            if (token !== null) {
                google.accounts.id.disableAutoSelect();
                google.accounts.oauth2.revoke(token.access_token, (): void => {});
                gapi.client.setToken(null);
            }
        } else {
            console.log("gapi is not loaded")
        }
    }

    public listUpcomingEvents = async (beginDate: Date, endDate: Date) => {
        if(gapi) {
            try {
                const request: gapi.client.calendar.EventsListParameters = {
                  'calendarId': 'primary',
                  'showDeleted': false,
                  'singleEvents': true,
                  'maxResults': 10,
                  'orderBy': "startTime",
                  'timeMax': endDate.toISOString(),
                  'timeMin': beginDate.toISOString(),
                };
                const response = await gapi.client.calendar.events.list(request);
                return response;
              } catch (err) {
                console.log(err);
                return;
              }
        } else {
            console.log("gapi is not loaded")
        }
    }
}

export default CalenderApi;