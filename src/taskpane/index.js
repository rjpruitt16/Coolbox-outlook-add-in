import "./taskpane.css";
import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { callGraphApi, cleanCoolNowFolder, createFolder, getAllApiFolders } from "../commands/rest";

/* global AppCpntainer, Component, document, Office, module, React, require */

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component title={title} isOfficeInitialized={isOfficeInitialized} />
    </AppContainer>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.initialize = () => {
  isOfficeInitialized = true;

  render(App);
};

/* Initial render showing a progress bar */
render(App);

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}

// callGraphApi(createFolder, { DisplayName: "@COOLNOW" }, {});
callGraphApi(getAllApiFolders, {}, { onDataCompleteCallback: cleanCoolNowFolder });
