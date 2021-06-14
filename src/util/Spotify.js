let accessToken;
let expiresIn;
let playlistId;

const CLIENT_ID = '1f3358958bca49f8981cfa4b9a74e25f';
const REDIRECT_URI = 'http://localhost:3000/'

const Spotify = {
  getAccessToken: () => {
    if (accessToken) {
      return accessToken;
    }

    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`
    }
  },

  search: (term) => {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`, {
      headers: {Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.tracks) return [];

      return jsonResponse.tracks.items.map(track => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }
      })})
  },

  savePlaylist(playlist, uriArray) {
    if (!playlist || !uriArray) return;

    let headers = {Authorization: `Bearer ${accessToken}`};
    let userID;

    fetch('https://api.spotify.com/v1/me', {
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => userID = jsonResponse.id)
    .then(() => {
      fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: playlist
        })
      })
      .then(response => response.json())
      .then(jsonResponse => playlistId = jsonResponse.id)
      .then(() => {
        fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            uris: uriArray
          })
        })
      })

    })

  },

  getPlaylist() {
    return fetch(`https://api.spotify.com/v1/me/playlists`, {
        headers: {Authorization: `Bearer ${accessToken}`},
    })
    .then(response => response.json())
    .then(jsonResponse => {
      return jsonResponse.items.map(playlist => {
        return {
          playlistName: playlist.name,
          playlistId: playlist.id
        }
      })
    })
},

  getPlaylistTracks(id) {
    return fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(jsonResponse => {
      return jsonResponse.tracks.items.map(track => {
        return {
          track: track.track.name,
          url: track.track.external_urls.spotify,
          id: track.track.id,
          artist: track.track.artists[0].name
        }
      })
    })
  }
}

export default Spotify;