import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <nav className="col-md-1 sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item active">
            <a className="nav-link" href="#"></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"></a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
