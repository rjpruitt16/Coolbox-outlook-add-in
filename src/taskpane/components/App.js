import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import createFolders from "../../commands/EWS";
import { callGraphApi, getMessageSubject, createFolder } from "../../commands/rest";

import CoolBoxLogo from "../images/Coolbox.png";
import CogIcon from "./icons/cog.js";
import NotificationIcon from "./icons/bell.js";
import AddIcon from "./icons/plus.js";
import BackIcon from "./icons/arrow.js";
import FolderIcon from "./icons/folder.js";
import DeleteIcon from "./icons/delete.js";
/* global Button, Header, HeroList, HeroListItem, Progress */

function App() {
  useEffect(() => {
    const response = callGraphApi(createFolder, { DisplayName: "@COOLMONDAY" });
    console.log(response);
    createFolders(["@COOLMONDAY", "@COOLTUESDAY"], asyncResult => {
      console.log(asyncResult);
    });
  });
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
        <SettingsDropdownMenu />
      </NavButton>
      <NavButton icon={<NotificationIcon />}>
        <NotificationDropdownMenu />
      </NavButton>
      <NavButton icon={<AddIcon />}>
        <AddFolderDropdownMenu />
      </NavButton>
    </div>
  );
}

function DropdownItem(props) {
  return (
    <div
      href="#"
      className={props.leftIcon ? "menu-item" : "menu-title-item"}
      onClick={() => props.goToMenu && props.setActiveMenu(props.goToMenu)}
    >
      {props.leftIcon && (
        <span href="#" className="button-item">
          {props.leftIcon}
        </span>
      )}
      {props.children}
      <a href="#" className="icon-right" onClick={() => props.deleteFolder(props.id)}>
        {props.rightIcon}
      </a>
    </div>
  );
}

function AddFolderDropdownMenu(props) {
  var defaultForm = {
    api: "Outlook Api",
    folderName: ""
  };
  var [formValues, setFormValues] = useState(defaultForm);

  function handleSubmit(event) {
    console.log("Submit form");
    props.addFolder && props.addFolder(formValues.folderName);
    event.preventDefault();
  }

  function handleInputChange(event) {
    const newForm = { ...formValues, api: event.target.value };
    setFormValues(newForm);
    event.preventDefault();
  }

  return (
    <div className="dropdown dropdown-add-folders">
      <form onSubmit={handleSubmit}>
        <label>
          API:
          <select value={formValues.api} onChange={handleInputChange}>
            <option value="Slack">Slack</option>
            <option value="Outlook Api">Outlook</option>
            <option value="Calendar Api">Calendar</option>
            <option value="Tasks">Tasks</option>
          </select>
        </label>
        <input type="text" value={formValues.folderName} />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

function NotificationDropdownMenu() {
  return (
    <div className="dropdown dropdown-notifications">
      <DropdownItem> Email Sent! </DropdownItem>
      <DropdownItem> Email sent! </DropdownItem>
      <DropdownItem> Settings change </DropdownItem>
      <DropdownItem> Settings </DropdownItem>
    </div>
  );
}

function SettingsDropdownMenu() {
  var defaultFolders = [
    "@CoolMonday",
    "@CoolTuesday",
    "@CoolWednesday",
    "@CoolThursday",
    "@CoolFriday",
    "@CoolCalendar"
  ];

  const [activeMenu, setActiveMenu] = useState("settings");
  const [menuHeight, setMenuHeight] = useState(null);
  const [folders, setFolders] = useState(defaultFolders);

  function calcHeight(element) {
    const height = element.offsetHeight;
    setMenuHeight(height);
  }

  function deleteFolder(index) {
    var newFolders = folders.splice(0, index).concat(folders.splice(index + 1));
    console.log(newFolders);

    setFolders(newFolders);
  }

  return (
    <div className="dropdown dropdown-settings" style={{ height: menuHeight }}>
      <CSSTransition
        in={activeMenu === "settings"}
        unmountOnExit
        timeout={500}
        classNames="settings-primary"
        onEnter={calcHeight}
      >
        <div className="settings">
          <DropdownItem> Settings </DropdownItem>
          <DropdownItem goToMenu="folders" setActiveMenu={setActiveMenu} leftIcon={<CogIcon />}>
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
          <DropdownItem
            goToMenu="settings"
            setActiveMenu={setActiveMenu}
            leftIcon={<BackIcon />}
            goToMenu="settings"
          ></DropdownItem>
          {folders.map((folderName, index) => {
            return (
              <DropdownItem id={index} leftIcon={<FolderIcon />} rightIcon={<DeleteIcon />} deleteFolder={deleteFolder}>
                <h4> {folderName} </h4>
              </DropdownItem>
            );
          })}
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
