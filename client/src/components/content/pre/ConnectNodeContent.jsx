import React, { useState } from "react";
import { LockClosedIcon } from '@heroicons/react/solid'
import { RefreshIcon } from '@heroicons/react/outline'

import TopNavigation from "../../sidebar/TopNavigation";
import ErrorOptionModal from "../../modals/ErrorOptionModal";
import CancelRedOptionModal from "../../modals/CancelRedOptionModal";

export default function ConnectNodeContent( { errorState, setCurrentErrorState, submitNode } ) {

    const [iconSpin, setIconSpin] = useState(false);

    let icon = (
        <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
    );
    if(iconSpin) {
        icon = <RefreshIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 service-button-loading" aria-hidden="true" />;
    }

    return (
        <>
            <div className='content-container'>
                <TopNavigation title={"Node"}/>
                <div className='content-list'>
                    <div className="mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-md w-full space-y-8">
                            <div>
                                <img
                                    className="mx-auto h-24 w-24"
                                    src="/images/logo512.png"
                                    alt="Workflow"
                                />
                                <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">Add Node</h2>
                                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                    The note is needed to be able to set up the login and the services.
                                </p>
                            </div>
                            <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={(event) => {
                                event.preventDefault();

                                if(!iconSpin) {
                                    const address = document.getElementById("nodeServerAddressInput").value;
                                    const port = document.getElementById("nodePortInput").value;

                                    submitNode(address, port);

                                    setIconSpin(true);
                                }
                            }}>
                                <input type="hidden" name="remember" defaultValue="true" />
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                        <input
                                            id="nodeServerAddressInput"
                                            name="nodeServerAddressInput"
                                            type="text"
                                            autoComplete="text"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Server address"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="nodePortInput"
                                            name="nodePortInput"
                                            type="number"
                                            autoComplete="port"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Port"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            {icon}
                                        </span>
                                        {
                                            iconSpin ? "Connecting" : "Connect"
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <ErrorOptionModal icon={(
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                )} title="Error" message={errorState.message} buttonMessage="Ok" show={errorState.error === -1000 || errorState.error === -1001 || errorState.error === -1002} callBack={(result) => {
                    setIconSpin(false);

                    setCurrentErrorState({
                        error: 0,
                        message: ""
                    });
                }}/>
            </div>
        </>
    )
}