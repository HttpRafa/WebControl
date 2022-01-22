import React, { useState } from "react";

import TopNavigation from '../sidebar/TopNavigation';
import ApplicationNoOptions from "../options/ApplicationNoOptions";
import ApplicationOptions from "../options/ApplicationOptions";

import { BiSave } from "react-icons/bi";
import { VscLoading } from 'react-icons/vsc';
import { MdDone } from 'react-icons/md';

const OptionsContent = () => {

    const [savingState, setSavingState] = useState("NOTHING");

    let saveIcon = (
        <>
            <BiSave className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
            Save
        </>
    );
    if(savingState === "SAVING") {
        saveIcon = (
            <>
                <VscLoading className="-ml-1 mr-2 h-5 w-5 service-button-loading" aria-hidden="true"/>
                Saving
            </>
        );
    } else if(savingState === "SAVED") {
        saveIcon = (
            <>
                <MdDone className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
                Saved
            </>
        );
    }

    return (
        <div className='content-container'>
            <TopNavigation title={"Options"}/>
            <div className="overflow-y-scroll mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Application Options</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Here you can change the options of the application</p>
                    <div className="text-right mt-2">
                        <button
                            type="button"
                            className="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:bg-green-700"
                            onClick={event => {
                                if(savingState === "NOTHING") {
                                    setSavingState("SAVING");

                                    setTimeout(() => {
                                        setSavingState("SAVED")
                                    }, 2000);
                                }
                            }}>
                            {saveIcon}
                        </button>
                    </div>
                </div>
                <ApplicationOptions changeCallback={(selectedOption, selectedOptionValue) => {
                    setSavingState("NOTHING")
                }} options={[{
                        name: 'max-players',
                        value: '5'
                    },
                    {
                        name: 'white-list',
                        value: 'true'
                    },
                    {
                        name: 'enable-command-block',
                        value: 'true'
                    },
                    {
                        name: 'spawn-monsters',
                        value: 'true'
                    },
                    {
                        name: 'spawn-monsters',
                        value: 'true'
                    },
                    {
                        name: 'spawn-monsters',
                        value: 'true'
                    },
                    {
                        name: 'spawn-monsters',
                        value: 'true'
                    },
                    {
                        name: 'spawn-monsters',
                        value: 'true'
                    }]} />
            </div>
        </div>
    );
};

export default OptionsContent;
