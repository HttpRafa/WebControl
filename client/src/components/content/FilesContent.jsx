import TopNavigation from '../sidebar/TopNavigation';
import { AiOutlineFile } from 'react-icons/ai';

const ServerContent = () => {
  return (
    <div className='content-container'>
      <TopNavigation title={"Files"}/>
      <div className='content-list'>
          <div className="mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Application Files</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">With this information you can access your files</p>
              </div>
              <div className="ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2">
                      <div className="flex">
                          <div className="cursor-pointer mr-2 text-green-500 w-12 h-12 flex justify-center items-center">
                              <AiOutlineFile size='22' className="" />
                          </div>
                          <div>
                              <div className="font-medium lg:text-xls sm:text-xs text-gray-800 dark:text-gray-300">FTP Server</div>
                              <p className="mt-1 bg-transparent focus:outline-0 font-bold lg:text-lg sm:text-xs text-gray-800 dark:text-gray-300">No information to display</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ServerContent;
