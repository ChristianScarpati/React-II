import React from "react";
import { Link } from "react-router-dom";

export default ({ deselectAlbum }) => (
  <div className="col-xs-2">
    <section className="sidebar">
      <img src="juke.svg" className="logo" />
      <h4 className="menu-item active">
        <Link to="/albums">ALBUMS</Link>
        <Link to="/artists">ARTISTS</Link>
      </h4>
    </section>
  </div>
);

// <section>
//   <h4 className="menu-item">
//     <Link to={/**rellename**/}>ARTISTS</Link>
//   </h4>
// </section>
