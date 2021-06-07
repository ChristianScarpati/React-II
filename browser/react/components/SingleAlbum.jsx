import React from "react";
import Songs from "./Songs";


export default class SingleAlbum extends React.Component {

    componentDidMount () {
      this.props.selectAlbum(this.props.albumId); //lo renderiza solo 1 vez y luego ya está
    }

   render() {
    return (
      <div className="album">
        {console.log(this.props)}
        <div>
          <h3>{this.props.album.name}</h3>
          <img
            src={`/api/albums/${this.props.album.id}/image`}
            className="img-thumbnail"
          />
        </div>
        <Songs songs={this.props.album.songs} start={this.props.start} selectedSong={this.props.selectedSong} />
      </div>
    );
  }
}

//album, start, selectedSong
