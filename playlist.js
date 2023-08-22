

const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const { redirectUri } = require('./config.js'); // Load your credentials from a config file


const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
let accessToken = process.env.SPOTIFY_TOKEN;
let refreshToken = process.env.SPOTIFY_REFRESH;

async function refreshAccessToken() {
	const refreshResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
	  grant_type: 'refresh_token',
	  refresh_token: refreshToken,
	  client_id: clientId,
	  client_secret: clientSecret
	}));
  
	accessToken = refreshResponse.data.access_token;
  }

async function createPlaylist()
{
	refreshAccessToken();

	// try {
	//   const playlistId = '46N2EDBNHE3dZ9LOJHNJjU';
  
	//   // Add a track to the playlist
	//   const addTrackResponse = await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
	// 	uris: ['spotify:track:5cenvmo6pnbLY2BSGgAubL'] // Replace with a valid track URI
	//   }, {
	// 	headers: {
	// 	  Authorization: `Bearer ${accessToken}`,
	// 	  'Content-Type': 'application/json'
	// 	}
	//   });
  
	//   console.log('Playlist created and track added:');
	// } catch (error) {
	//   console.error('Error:', error.response.data);
	// }
}

createPlaylist()