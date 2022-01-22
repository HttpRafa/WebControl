import { LockClosedIcon } from '@heroicons/react/solid'
import TopNavigation from "../../sidebar/TopNavigation";
import React, {useState} from "react";
import {RefreshIcon} from "@heroicons/react/outline";

export default function CreateAccountContent() {

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
                <TopNavigation title={"Create Account"}/>
                <div className='content-list'>
                    <div className="mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-md w-full space-y-8">
                            <div>
                                <img
                                    className="mx-auto h-24 w-24"
                                    src="/images/logo512.png"
                                    alt="Workflow"
                                />
                                <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">Create your account</h2>
                                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                    Or{' '}
                                    <span className="cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500">
                                        login
                                    </span>
                                </p>
                            </div>
                            <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={(event) => {
                                event.preventDefault();

                                setIconSpin(true);
                            }}>

                                <div className="rounded-md shadow-sm -space-y-px">
                                    <input
                                        id="createTokenInput"
                                        name="createTokenInput"
                                        type="text"
                                        autoComplete="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Token"
                                    />
                                </div>

                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                        <input
                                            id="createUsernameInput"
                                            name="createUsernameInput"
                                            type="text"
                                            autoComplete="text"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Username"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="createPasswordInput"
                                            name="createPasswordInput"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="createPasswordConfirmInput"
                                            name="createPasswordConfirmInput"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Confirm Password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            {icon}
                                        </span>
                                        {
                                            iconSpin ? "Creating" : "Create"
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}