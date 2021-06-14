import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import './App.css';
import Spotify from '../../util/Spotify';

Spotify.getAccessToken();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      playlists: [],
      playlistList: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.getPlaylistTracks = this.getPlaylistTracks.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    this.setState((prevState) => ({
      playlistTracks: [
        ...prevState.playlistTracks,
        track
      ]
    }))
  };

  removeTrack(track) {
    let x = this.state.playlistTracks.filter(item => item.id !== track.id);

    this.setState({playlistTracks: x});
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  savePlaylist() {
    if (this.state.playlistTracks.length > 1) {
      let trackURIs = this.state.playlistTracks.map(track => track.uri);
      Spotify.savePlaylist(this.state.playlistName, trackURIs);
      this.setState( {
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    }
  }

  search(term) {
    Spotify.search(term)
    .then(searchResults => this.setState({
      searchResults: searchResults
    }))
  }

  getPlaylist() {
    Spotify.getPlaylist()
    .then(searchResults => this.setState({
      playlists: searchResults
    }))
  }

  getPlaylistTracks(id) {
    Spotify.getPlaylistTracks(id)
    .then(searchResults => this.setState({
      playlistList: searchResults
    }))
  }

  render() {
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
            playlistView={this.getPlaylist}
            playlists={this.state.playlists}
            getPlaylistTracks={this.getPlaylistTracks}
            playlistList={this.state.playlistList} />
          </div>
        </div>
      </div>
    )
  }
}


