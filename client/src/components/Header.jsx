import React from "react";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import "./Header.css";
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";

const Header = () => {
  return (
    <div className="header-container">
      {/* Friends Icon */}
      <Link to="/friends" className="icon-link">
        <FaUserFriends size={24} />
      </Link>
      {/* Connect Wallet Button */}
      <ConnectButton client={client} />
    </div>
  );
};

export default Header;
