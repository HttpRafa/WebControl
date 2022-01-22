import { VscDebugStart, VscDebugRestart, VscLoading } from 'react-icons/vsc';
import { RiShutDownLine } from 'react-icons/ri';

const ApplicationStats = ({ applicationState }) => {

    let applicationStatus = <dd className="mt-1 text-sm text-green-500 font-medium sm:mt-0 sm:col-span-2">Online</dd>;

    let startButton = (
        <button
            type="button"
            className="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:bg-green-700">
            <VscDebugStart className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Start
        </button>
    );

    let restartButton = (
        <button
            type="button"
            className="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-450">
            <VscDebugRestart className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Restart
        </button>
    );

    if(applicationState.state === "STARTING") {
        startButton = (
            <button
                type="button"
                className="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-300 bg-green-600 hover:bg-green-700 focus:bg-green-700">
                <VscLoading className="-ml-1 mr-2 h-5 w-5 text-white service-button-loading" aria-hidden="true" />
                Start
            </button>
        );
        applicationStatus = <dd className="mt-1 text-sm text-green-500 font-medium sm:mt-0 sm:col-span-2">Starting</dd>;
    } else if(applicationState.state === "RESTARTING") {
        restartButton = (
            <button
                type="button"
                className="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-300 bg-orange-400 hover:bg-orange-450">
                <VscDebugRestart className="-ml-1 mr-2 h-5 w-5 text-white service-button-loading" aria-hidden="true" />
                Restart
            </button>
        );
        applicationStatus = <dd className="mt-1 text-sm text-orange-400 font-medium sm:mt-0 sm:col-span-2">Restarting</dd>;
    }

    return (
        <div className="mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Application Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Information about the Application</p>
                <div className="text-right mt-2">
                    {startButton}
                    {restartButton}
                    <button
                        type="button"
                        className="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:bg-red-700">
                        <RiShutDownLine className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Stop
                    </button>
                </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-850">
                <dl>
                    <div className="bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-white">Current Status</dt>
                        {applicationStatus}
                    </div>
                    <div className="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-white">Type</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">Minecraft Server</dd>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-white">Current Uptime</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">1 min 25 sec</dd>
                    </div>
                    <div className="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-white">CPU load</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">35%</dd>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-white">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                            Nothing
                        </dd>
                    </div>
                    <div className="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-white">Memory Usage</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">2500 MB / 7000 MB</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default ApplicationStats;