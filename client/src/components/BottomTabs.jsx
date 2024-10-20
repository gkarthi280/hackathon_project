import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaWallet, FaGamepad, FaTrophy } from "react-icons/fa";
import "./BottomTabs.css"; // Add CSS styles for the tab buttons

function BottomTab() {
  return (
    <div className="bottom-tab">
      <NavLink to="/home" activeClassName="active">
        <FaHome size={24} />
      </NavLink>
      <NavLink to="/wallet" activeClassName="active">
        <FaWallet size={24} />
      </NavLink>
      <NavLink to="/games" activeClassName="active">
        <FaGamepad size={24} />
      </NavLink>
      <NavLink to="/ranking" activeClassName="active">
        <FaTrophy size={24} />
      </NavLink>
    </div>
  );
}

export default BottomTab;
