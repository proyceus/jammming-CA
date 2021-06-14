import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

export default class Playlist extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      playlistView: false,
      playlistTrackView: false
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePlaylistViewClick = this.handlePlaylistViewClick.bind(this);
    this.handlePlaylistsBackClick = this.handlePlaylistsBackClick.bind(this);
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
    this.handlePlaylistsTrackBackClick = this.handlePlaylistsTrackBackClick.bind(this);
  }

  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
  }

  handleClick() {
    this.props.onSave();
  }


  handlePlaylistViewClick() {
    this.props.playlistView()

      this.setState({
        playlistView: true
      })

    setTimeout(console.log(this.props.playlists), 1000);
  }

  handlePlaylistsBackClick() {
    this.setState({
      playlistView: false
    })
  }

  handlePlaylistClick(e) {
    console.log(e.target.id);
    this.props.getPlaylistTracks(e.target.id);
    console.log(this.props.playlistList);

    this.setState({
      playlistView: false,
      playlistTrackView: true
    })
  }

  handlePlaylistsTrackBackClick() {
    this.setState({
      playlistView: true,
      playlistTrackView: false
    })
  }

  render() {


    if (this.state.playlistView === true) {
      return (
        <div className="Playlist">
          <h2>Playlists</h2>
          <button className="Playlist-save special" onClick={this.handlePlaylistsBackClick}>BACK</button>
          {this.props.playlists.map(playlist => {
            return <div className="playlist" id={playlist.playlistId} key={playlist.playlistId} onClick={this.handlePlaylistClick}>{playlist.playlistName}</div>
          })}

        </div>
      )
    } else if (this.state.playlistTrackView === true) {
      return (
        <div className="Playlist">
          <h2>Playlist Tracks</h2>
          <button className="Playlist-save special" onClick={this.handlePlaylistsTrackBackClick}>BACK</button>
          {this.props.playlistList.map(playlistTrack => {
            return <a href={playlistTrack.url} className="playlist" key={playlistTrack.id} target="_blank" rel="noreferrer">{playlistTrack.track} by {playlistTrack.artist}</a>
          })}

        </div>
      )
    } else {
      return(
        <div className="Playlist">
          <input defaultValue="New Playlist" onChange={this.handleNameChange} />
          <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove} />
          <button className="Playlist-save" onClick={this.handleClick}>SAVE TO SPOTIFY</button>
          <button className="Playlist-save" onClick={this.handlePlaylistViewClick}>SEE PLAYLISTS</button>
        </div>
      )
    }
    }
}

