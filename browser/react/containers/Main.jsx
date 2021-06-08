import React from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Albums from "../components/Albums";
import SingleAlbum from "../components/SingleAlbum";
import Artists from "../components/Artists";
import Artist from "../components/Artist";
import audio from "../audio";
import { Route, Redirect, Switch } from "react-router-dom";

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      albums: [],
      selectedAlbum: {},
      selectedSong: {},
      isPlaying: false,
      currentSongList: [],
      progress: 0,
      artists: [],
      selectedArtist: {},
    };

    this.selectAlbum = this.selectAlbum.bind(this);
    this.deselectAlbum = this.deselectAlbum.bind(this);
    this.selectArtists = this.selectArtists.bind(this);
    this.start = this.start.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentDidMount() {
    axios
      .get("/api/albums")
      .then((res) => res.data)
      .then((serverAlbums) => this.setState({ albums: serverAlbums }));
    audio.addEventListener("ended", () => {
      this.next();
    });
    audio.addEventListener("timeupdate", () => {
      this.setState({
        progress: (100 * audio.currentTime) / audio.duration,
      });
    });
  }

  selectAlbum(albumId) {
    axios
      .get(`/api/albums/${albumId}`)
      .then((res) => res.data)
      .then((serverAlbum) => this.setState({ selectedAlbum: serverAlbum }));
  }

  deselectAlbum() {
    this.setState({ selectedAlbum: {} });
  }

  selectArtists() {
    axios
      .get("/api/artists")
      .then((res) => res.data)
      .then((artists) => {
        this.setState({ artists: artists });
      });
  }

  start(song, songs) {
    this.setState({ selectedSong: song, currentSongList: songs });
    this.loadSong(song.audioUrl);
  }

  loadSong(audioUrl) {
    audio.src = audioUrl;
    audio.load();
    this.play();
  }

  play() {
    audio.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    audio.pause();
    this.setState({ isPlaying: false });
  }

  findSongIndex() {
    return this.state.currentSongList.findIndex(
      (song) => song.id === this.state.selectedSong.id
    );
  }

  next() {
    let index = this.findSongIndex() + 1;
    if (index >= this.state.currentSongList.length) {
      index = 0;
    }
    const song = this.state.currentSongList[index];
    this.setState({ selectedSong: song });
    this.loadSong(song.audioUrl);
  }

  previous() {
    let index = this.findSongIndex() - 1;
    if (index < 0) {
      index = this.state.currentSongList.length - 1;
    }
    const song = this.state.currentSongLists[index];
    this.setState({ selectedSong: song });
    this.loadSong(song.audioUrl);
  }

  render() {
    const {
      albums,
      selectedAlbum,
      selectedSong,
      isPlaying,
      progress,
      artists,
      selectedArtist,
    } = this.state;

    return (
      <div id="main" className="container-fluid">
        <Sidebar deselectAlbum={this.deselectAlbum} />
        <div className="col-xs-10">
          <Switch>
            <Route
              path="/albums/:id"
              render={({ match }) => (
                <SingleAlbum
                  selectedSong={selectedSong}
                  start={this.start}
                  album={selectedAlbum}
                  selectAlbum={this.selectAlbum}
                  albumId={match.params.id}
                />
              )}
            />

            <Route
              path="/albums"
              render={() => (
                <Albums albums={albums} selectAlbum={this.selectAlbum} />
              )}
            />

            <Route path="/artists/:id" render={() => <Artist />} />

            <Route
              path="/artists"
              render={() => (
                <Artists
                  artists={artists}
                  selectedArtist={selectedArtist}
                  selectArtists={this.selectArtists}
                />
              )}
            />

            <Redirect from="/" to="/albums" />
          </Switch>
        </div>

        <Footer
          selectedSong={selectedSong}
          isPlaying={isPlaying}
          play={this.play}
          pause={this.pause}
          next={this.next}
          previous={this.previous}
          progress={progress}
        />
      </div>
    );
  }
}
