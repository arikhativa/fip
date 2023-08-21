

const clientId = '93c1fd7035f34774b27df1a245dcdd36';
const clientSecret = '74772906463948b08245e1e0bcae4141';
const token = 'BQDHzI3WOu2MOfjkYCg1nXm13NwR-6sED2sz1YtHO9H9p5mhQAEwReeLgGlNqlIUjySPjEGYD9-kFeBJ0xhgwAizADWB8tBB8xcfUDpAEZWdtGf2uxctkgbh3a71AilKIu1Eo_uuslAhgWB4AlmnQty769pdY6A6oc1HwKsBher9awyGMkP6YeaKw0a4NQeF_sEHYAmbEE7S7TC-7B5CFDfOBEo05g';
const request = require('request');

function getAccessToken(callback) {
  const options = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
	cache: "no-cache",
	body: 'grant_type=client_credentials&scope=playlist-read-private%20user-read-playback-state%20user-library-read'
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      callback(null, data.access_token);
    } else {
      callback(error || new Error(`Request failed with status code ${response.statusCode}`));
    }
  });
}

// Get a list of user's playlists
function getUserPlaylists(accessToken, callback) {
  const options = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      callback(null, data.items);
    } else {
      callback(error || new Error(`Request failed with status code ${response.statusMessage}`));
    }
  });
}

// Main function
function main() {
  getAccessToken((error, accessToken) => {
    if (error) {
      console.error('Error obtaining access token:', error);
      return;
    }

    getUserPlaylists(accessToken, (error, playlists) => {
      if (error) {
        console.error('Error retrieving playlists:', error);
        return;
      }

      console.log('Your playlists:');
      playlists.forEach(playlist => {
        console.log(playlist.name);
      });
    });
  });
}

main();
