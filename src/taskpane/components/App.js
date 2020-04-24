import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import CoolBoxLogo from "../images/Coolbox.png";
import CogIcon from "./icons/cog.js";
import NotificationIcon from "./icons/bell.js";
import AddIcon from "./icons/plus.js";
import BackIcon from "./icons/arrow.js";
import FolderIcon from "./icons/folder.js";
/* global Button, Header, HeroList, HeroListItem, Progress */

function App() {
  return <NavBar />;
}

function NavBar() {
  return (
    <div className="navbar">
      <img id="logo" src={CoolBoxLogo} />
      <h4 className="title"> rjp293@cornell.edu </h4>
      <ButtonBar />
    </div>
  );
}

function ButtonBar() {
  return (
    <div className="button-bar">
      <NavButton icon={<CogIcon />}>
        <DropdownMenu />
      </NavButton>
      <NavButton icon={<NotificationIcon />} />

      <NavButton icon={<AddIcon />} />
    </div>
  );
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState("settings");
  const [menuHeight, setMenuHeight] = useState(null);

  function calcHeight(element) {
    const height = element.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        {props.leftIcon && (
          <span href="#" className="button-item">
            {props.leftIcon}
          </span>
        )}
        {props.children}
        <span href="#" className="icon-right">
          {props.rightIcon}
        </span>
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }}>
      <CSSTransition
        in={activeMenu === "settings"}
        unmountOnExit
        timeout={500}
        classNames="settings-primary"
        onEnter={calcHeight}
      >
        <div className="settings">
          <DropdownItem> Settings </DropdownItem>
          <DropdownItem goToMenu="folders" leftIcon={<CogIcon />}>
            <h4> Folders </h4>
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "folders"}
        unmountOnExit
        timeout={500}
        classNames="settings-folder"
        onEnter={calcHeight}
      >
        <div className="settings">
          <DropdownItem leftIcon={<BackIcon />} goToMenu="settings"></DropdownItem>
          <DropdownItem leftIcon={<FolderIcon />}>
            <h4> @CoolMonday </h4>
          </DropdownItem>
          <DropdownItem leftIcon={<FolderIcon />}>
            <h4> @CoolTuesday </h4>
          </DropdownItem>
          <DropdownItem leftIcon={<FolderIcon />}>
            <h4> @CoolWednesday </h4>
          </DropdownItem>
          <DropdownItem leftIcon={<FolderIcon />}>
            <h4> @CoolThursday </h4>
          </DropdownItem>
          <DropdownItem leftIcon={<FolderIcon />}>
            <h4> @CoolFriday </h4>
          </DropdownItem>
          <DropdownItem leftIcon={<FolderIcon />}>
            <h4> @CoolCalendar </h4>
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

function NavButton(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="button-item">
      <a href="#" className="nav-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </div>
  );
}
export default App;
