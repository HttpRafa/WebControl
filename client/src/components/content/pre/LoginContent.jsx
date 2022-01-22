import { LockClosedIcon } from '@heroicons/react/solid'
import TopNavigation from "../../sidebar/TopNavigation";
import React, {useState} from "react";
import {RefreshIcon} from "@heroicons/react/outline";

export default function LoginContent( { errorState, setCurrentErrorState, submitLogin } ) {

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
                <TopNavigation title={"Login"}/>
                <div className='content-list'>
                    <div className="mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-md w-full space-y-8">
                            <div>
                                <img
                                    className="mx-auto h-24 w-24"
                                    src="/images/logo512.png"
                                    alt="Workflow"
                                />
                                <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">Login to your account</h2>
                                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                    Or{' '}
                                    <span className="cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500">
                                        create one
                                    </span>
                                </p>
                            </div>
                            <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={(event) => {
                                event.preventDefault();

                                if(iconSpin) {
                                    return;
                                }

                                const username = document.getElementById("loginUsernameInput").value;
                                const password = document.getElementById("loginPasswordInput").value;
                                const remember = document.getElementById("remember-me").checked;

                                submitLogin(username, password, remember);

                                setIconSpin(true);
                            }}>
                                <input type="hidden" name="remember" defaultValue="true" />
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                        <input
                                            id="loginUsernameInput"
                                            name="loginUsernameInput"
                                            type="text"
                                            autoComplete="text"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Username"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="loginPasswordInput"
                                            name="loginPasswordInput"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Password"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 bg-white dark:bg-gray-500 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm dark:text-gray-300 text-gray-500">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <span className="cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500">
                                            Forgot your password?
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            {icon}
                                        </span>
                                        {
                                            iconSpin ? "Logging in" : "Login"
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