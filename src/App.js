import React, { Component } from 'react';
import Search from './Search.js';
import Lyrics from './Lyrics.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enteredSong: false,
      song: {},
    };
  }

  enterSong = (song) => {
    this.setState({
      enteredSong: true,
      song: song,
    }); 
  }

  newSong = () => {
    this.setState({
      enteredSong: false,
      song: {},
    });
  }

  render() {
    return (
      <div className="App">
        <header/>
        {!this.state.enteredSong ? (
          <Search callbackFromParent={this.enterSong}/>
        ) : (
          <div>
            <button 
              className="AppButton"
              onClick={this.newSong}>
              Back
            </button>
            <h3>
              {this.state.song.title} - {this.state.song.artist}
            </h3>
            <Lyrics 
              song={this.state.song}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
