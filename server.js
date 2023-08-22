

const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const { token, refresh, clientId, clientSecret, redirectUri } = require('./config.js'); // Load your credentials from a config file

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


let accessToken = token;
let refreshToken = refresh;

async function refreshAccessToken() {
	const refreshResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
	  grant_type: 'refresh_token',
	  refresh_token: refreshToken,
	  client_id: clientId,
	  client_secret: clientSecret
	}));
  
	accessToken = refreshResponse.data.access_token;
  }

// Authorization Code Flow Step 1: Redirect user to Spotify authorization URL
app.get('/login', (req, res) => {
  const state = 'some-random-state'; // Generate a random state value
  const scopes = 'playlist-modify-public playlist-modify-private'; // Scopes for playlist access

  const authorizationUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
      state: state
    });

  res.redirect(authorizationUrl);
});

// Authorization Code Flow Step 2: Handle the redirect from Spotify
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  // Verify state to prevent CSRF attacks

  // Exchange authorization code for access token
//   const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
//     code: code,
//     redirect_uri: redirectUri,
//     grant_type: 'authorization_code',
//     client_id: clientId,
//     client_secret: clientSecret
//   }));

//    accessToken = tokenResponse.data.access_token;
//    refreshToken = tokenResponse.data.refresh_token;

//    console.log('Access token:', accessToken);
//    console.log('Refresh token:', refreshToken);

   refreshAccessToken();

  // Use the access token to create and edit playlists
  try {
    // Create a new playlist
    const createPlaylistResponse = await axios.post('https://api.spotify.com/v1/me/playlists', {
      name: 'My New Playlist',
      public: false // Set to true for a public playlist
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const playlistId = createPlaylistResponse.data.id;

    // Add a track to the playlist
    const addTrackResponse = await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      uris: ['spotify:track:5cenvmo6pnbLY2BSGgAubL'] // Replace with a valid track URI
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Playlist created and track added:', playlistId, addTrackResponse.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }

  res.send('OAuth2 token obtained and playlist modified.');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

