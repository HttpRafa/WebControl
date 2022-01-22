import React, { useState } from "react";

import SideBar from "./sidebar/SideBar";
import HomeContent from "./content/HomeContent";
import ApplicationContent from "./content/ApplicationContent";
import OptionsContent from "./content/OptionsContent";
import ConsoleContent from "./content/ConsoleContent";
import FilesContent from "./content/FilesContent";
import AccessContent from "./content/AccessContent";
import ConnectNodeContent from "./content/pre/ConnectNodeContent";
import LoginContent from "./content/pre/LoginContent";
import CreateAccountContent from "./content/pre/CreateAccountContent";
import LoadingContent from "./content/pre/LoadingContent";

const AppRoot = ( { siteId, setSideId, hideSideBar, applicationState, consoleMessages, errorState, setCurrentErrorState, connectNode, submitLogin }) => {

    let content;

    if(siteId === -1) {
        content = <HomeContent />;
    } else if(siteId === -2) {
        content = <ApplicationContent applicationState={applicationState}/>;
    } else if(siteId === -3) {
        content = <OptionsContent />;
    } else if(siteId === -4) {
        content = <ConsoleContent messages={consoleMessages} clickSend={function () {
        }}/>;
    } else if(siteId === -5) {
        content = <FilesContent />;
    } else if(siteId === -6) {
        content = <AccessContent />;
    } else if(siteId === -100) {
        content = <LoadingContent />;
    } else if(siteId === -101) {
        content = <ConnectNodeContent errorState={errorState} setCurrentErrorState={setCurrentErrorState} submitNode={connectNode} />;
    } else if(siteId === -102) {
        content = <LoginContent errorState={errorState} setCurrentErrorState={setCurrentErrorState} submitLogin={submitLogin} />;
    } else if(siteId === -103) {
        content = <CreateAccountContent />;
    }

    return (
        <div className="flex">
            <SideBar hideSideBar={hideSideBar} iconClickCallback={function (callbackSiteId) {
                setSideId(callbackSiteId);
            }}/>
            {content}
        </div>
    );
}

export default AppRoot;