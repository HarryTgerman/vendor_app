import React from "react";
import { imagePath } from "../utils/assetUtils";
import useWindowDimensions from "./hooks/Dimensions";
import { Link } from "react-router-dom";
import BluePhone from "./icons/BluePhone";

export default function Navbar() {
  const { width } = useWindowDimensions();
  return (
    <div className="navbarSection">
      <div className="wrapper">
        <div className="navbar">
          <div className="logo">
            <a href="https://mysoftwarescout.de" target="_blank">
              <img
                alt="Logo"
                src={imagePath("Logo.png")}
              />
            </a>
          </div>
          <div className="rightSection">
            <div className="phone">
            <img
                alt="Logo"
                src={imagePath("jonas-online.png")}
              />
            <BluePhone />
              <div className="text">
              Telefonische Rückfragen:
                <a href={"tel: +49 157 359 948 40"}>+49 157 359 948 40</a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
