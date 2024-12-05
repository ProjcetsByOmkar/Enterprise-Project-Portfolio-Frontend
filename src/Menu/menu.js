import React from "react";
import { NavLink } from "react-router-dom";
import "./menu.css";
import create from "../img/create-project.svg";
import createActive from "../img/create-project-active.svg";
import dashboard from "../img/Dashboard.svg";
import dashboardActive from "../img/Dashboard-active.svg";
import projectList from "../img/Project-list.svg";
import projectListActive from "../img/Project-list-active.svg";
import logout from "../img/Logout.svg";

const Menu = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="menu">
      <ul>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {({ isActive }) =>
              isActive ? (
                <img
                  src={dashboardActive}
                  alt="Dashboard Active"
                  style={{ display: "block" }}
                />
              ) : (
                <img
                  src={dashboard}
                  alt="Dashboard"
                  style={{ display: "block" }}
                />
              )
            }
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/project-listing"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {({ isActive }) =>
              isActive ? (
                <img
                  src={projectListActive}
                  alt="Project Listing Active"
                  style={{ display: "block" }}
                />
              ) : (
                <img
                  src={projectList}
                  alt="Project Listing"
                  style={{ display: "block" }}
                />
              )
            }
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/create-project"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {({ isActive }) =>
              isActive ? (
                <img
                  src={createActive}
                  alt="Project Create Active"
                  style={{ display: "block" }}
                />
              ) : (
                <img
                  src={create}
                  alt="Project Create"
                  style={{ display: "block" }}
                />
              )
            }
          </NavLink>
        </li>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <li>
          <img
            src={logout}
            alt="Logout"
            onClick={handleLogout}
            className="logout-button"
          />
        </li>
      </ul>
    </div>
  );
};

export default Menu;
