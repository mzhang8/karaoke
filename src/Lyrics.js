import React, { Component } from 'react';
import './Lyrics.css';

class Lyrics extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="LyricBox">
        {this.props.song.lyrics.split('%').map((i,key) => {
          if (i === "") {
            return <div key={key}>&nbsp;</div>
          } else {
            return <div key={key}>{i}</div>;
          }
        })}
      </div>
    );
  }
}

export default Lyrics;
