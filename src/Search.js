import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Loader from 'halogen/ScaleLoader';
import './Search.css';

const PROXY_URL = 'https://infinite-sands-29296.herokuapp.com/'
const API_URL = 'https://musixmatchcom-musixmatch.p.rapidapi.com/wsr/1.1/'

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songTitle: '',
      songArtist: '',

      inProgress: false,

      error: false,
      errorMessage: '',
    };
  }

  onSongTitleChange(e) {
    this.setState({
      songTitle: e.target.value,
      error: false,
    });
  }

  onSongArtistChange(e) {
    this.setState({
      songArtist: e.target.value,
      error: false,
    });
  }

  getLyrics() {
    if (this.state.songTitle === '') {
      this.setState({
        error: true,
        errorMessage: 'Need a song, buster.',
      })
      return;
    }

    if (this.state.songArtist === '') {
      this.setState({
        error: true,
        errorMessage: 'Need an artist, too!',
      })
      return;
    }

    // leggo
    this.setState({
      inProgress: true,
    });

    // get the URL of song lyrics we need to scrape
    fetch(API_URL + `matcher.track.get?f_has_lyrics=1&q_artist=${this.state.songArtist}&q_track=${this.state.songTitle}`, {
      headers: {
        "X-RapidAPI-Key": "[YOUR-API-KEY]"
      },
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
        songTitle: response['track_name'],
        songArtist: response['artist_name'],
      });

      var ind = response['track_share_url'].indexOf('?utm_source');

      const trackUrl = response['track_share_url'].substring(0, ind);
      const trackId = response['track_id'];

      // now we scrape
      this.scrapeURL(trackUrl);
    })
    .catch(error => {
      this.setState({
        inProgress: false,
        error: true,
        errorMessage: 'Could not find song.',
      });
    });
  }

  scrapeURL(url) {
    // use cors proxy
    fetch(PROXY_URL + url)
    .then(response => response.text())
    .then(html => {
      const lyrics = this.parseHtml(html);
      const song = {
        title: this.state.songTitle,
        artist: this.state.songArtist,
        lyrics: lyrics,
      }

      this.props.callbackFromParent(song);
    })
    .catch(error => {
      this.setState({
        inProgress: false,
        error: true,
        errorMessage: 'Something went wrong.',
      })
    });
  }

  parseHtml(htmlBlob) {
    // look for this when parsing html
    const startStr = '"lyrics":{"crowdLyricsList":[],"lyrics":';
    var ind = htmlBlob.indexOf(startStr);
    htmlBlob = htmlBlob.substring(ind + startStr.length);

    var startInd = htmlBlob.indexOf('"body":') + '"body":'.length;
    var endInd = htmlBlob.indexOf(',"language":');

    // remove the quotes 
    var lyrics = htmlBlob.substring(startInd + 1, endInd - 1)
                  .replace(/\\n/g, '%')
                  .replace(/\\/g, '');

    return lyrics;
  }

  render() {
    return (
      <div>
        {this.state.inProgress ? (
          <Loader 
            color="#ffffff"
            size="8px"
            margin="4px"
          />
        ) : (
          <div>
            {this.state.error ? (
              <p>{this.state.errorMessage}</p>
            ) : ''}
            <input
              type="text"
              className="SearchInput"
              placeholder="Enter a song"
              value={this.state.songTitle}
              onChange={this.onSongTitleChange.bind(this)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  this.getLyrics();
                }
              }} 
            />
            <br />
            <input
              type="text"
              className="SearchInput"
              placeholder="Enter the artist"
              value={this.state.songArtist}
              onChange={this.onSongArtistChange.bind(this)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  this.getLyrics();
                }
              }} 
            />
          </div>
        )}
      </div>
    );
  }
}

export default Search;
